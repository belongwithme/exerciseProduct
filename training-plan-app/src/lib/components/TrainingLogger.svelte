<!--
  @component
  TrainingLogger
  ===============
  A component for logging workout sessions.
  It allows creating complex logs with multiple exercises and sets,
  and includes a feature to copy the most recent workout.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { supabase } from '$lib/utils/supabaseClient';
	import Fa from 'svelte-fa';
	import { faPlus, faTrash, faCopy, faGripLines } from '@fortawesome/free-solid-svg-icons';
	import { dndzone } from 'svelte-dnd-action';

	// State variables
	let exercises: any[] = [];
	let logs: any[] = [];
	let loading = true;
	let error: string | null = null;
	let plan_version_id: number | null = null;

	let nextSetId = 1; // For unique IDs for dnd keys
	const flipDurationMs = 200;
	const statusOptions = ['状态良好', '疲劳', '低效率'] as const;

	// New data structure for a full workout log
	let workoutData = {
		date: new Date().toISOString().slice(0, 10),
		status: statusOptions[0],
		mood: '',
		exercises: [
			{
				exercise_id: null as number | null,
				name: '',
				sets: [
					{
						id: nextSetId++,
						set_number: 1,
						reps: null as number | null,
						weight_kg: null as number | null,
						notes: ''
					}
				]
			}
		]
	};

	// Helper functions to manage the dynamic form
	function addExercise() {
		workoutData.exercises.push({
			exercise_id: null,
			name: '',
			sets: [{ id: nextSetId++, set_number: 1, reps: null, weight_kg: null, notes: '' }]
		});
		workoutData = { ...workoutData }; // Trigger Svelte reactivity
	}

	function removeExercise(index: number) {
		workoutData.exercises.splice(index, 1);
		workoutData = { ...workoutData };
	}

	function addSet(exerciseIndex: number) {
		const exercise = workoutData.exercises[exerciseIndex];
		exercise.sets.push({
			id: nextSetId++,
			set_number: exercise.sets.length + 1,
			reps: null,
			weight_kg: null,
			notes: ''
		});
		workoutData = { ...workoutData };
	}

	function removeSet(exerciseIndex: number, setIndex: number) {
		const exercise = workoutData.exercises[exerciseIndex];
		exercise.sets.splice(setIndex, 1);
		exercise.sets.forEach((set, i) => (set.set_number = i + 1)); // Re-number sets
		workoutData = { ...workoutData };
	}

	function handleDndSort(e: CustomEvent, exerciseIndex: number) {
		const { items } = e.detail;
		const exercise = workoutData.exercises[exerciseIndex];
		exercise.sets = items;
		exercise.sets.forEach((set, i) => (set.set_number = i + 1));
		// 使用更精确的更新方式，避免触发整个表单重新渲染
		workoutData = { ...workoutData };
	}

	function handleExerciseSelection(event: Event, exerciseIndex: number) {
		const select = event.target as HTMLSelectElement;
		const exerciseId = parseInt(select.value, 10);
		
		// 验证选择的ID是否有效
		if (isNaN(exerciseId) || exerciseId <= 0) {
			console.log('无效的动作ID:', select.value);
			return;
		}
		
		const selectedExercise = exercises.find((e) => e.id === exerciseId);
		if (selectedExercise) {
			console.log('选择动作:', selectedExercise.name, 'ID:', selectedExercise.id);
			workoutData.exercises[exerciseIndex].exercise_id = selectedExercise.id;
			workoutData.exercises[exerciseIndex].name = selectedExercise.name;
			// 确保状态更新能正确触发响应式更新
			workoutData = { ...workoutData };
		} else {
			console.log('未找到动作，ID:', exerciseId);
		}
	}

	/**
	 * Fetches the list of available exercises from the database.
	 */
	async function getExercises() {
		const { data, error: fetchError } = await supabase
			.from('exercises')
			.select('id, name')
			.order('name');

		if (fetchError) {
			error = fetchError.message;
			console.error('Error fetching exercises:', fetchError);
		} else {
			exercises = data || [];
		}
	}

	/**
	 * Fetches the recent training logs. This is a simplified view showing raw sets.
	 */
	async function getLogs() {
		const { data, error: fetchError } = await supabase
			.from('logged_sets')
			.select(`*, exercises (name)`)
			.order('created_at', { ascending: false })
			.limit(10);

		if (fetchError) {
			error = fetchError.message;
			console.error('Error fetching logs:', fetchError);
		} else {
			logs = data || [];
		}
	}

	/**
	 * Finds the ID of the most recent workout log for the current user.
	 */
	async function getLastLogId() {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) return null;

		const { data, error } = await supabase
			.from('workout_logs')
			.select('id')
			.eq('user_id', user.id)
			.order('date', { ascending: false })
			.order('created_at', { ascending: false })
			.limit(1)
			.single();

		if (error && error.code !== 'PGRST116') {
			// Ignore "exact one row" error if no logs exist
			console.error('Error fetching last log id:', error);
			return null;
		}
		return data ? data.id : null;
	}

	/**
	 * Copies the exercises and sets from the last workout.
	 */
	async function copyLastWorkout() {
		loading = true;
		error = null;
		const lastLogId = await getLastLogId();

		if (!lastLogId) {
			alert('没有找到最近的训练记录用于复制。');
			loading = false;
			return;
		}

		const { data, error: rpcError } = await supabase.rpc('copy_workout_from_log', {
			previous_log_id: lastLogId
		});

		if (rpcError || !data) {
			error = rpcError ? rpcError.message : '复制失败，未收到数据。';
			console.error('Error copying workout:', error);
		} else if (data) {
			if (data.error) {
				error = data.error;
			} else if (Array.isArray(data) && data.length > 0) {
				workoutData.exercises = data.map((ex: any) => ({
					exercise_id: ex.exercise_id,
					name: ex.name,
					sets: ex.sets.map((s: any) => ({
						id: nextSetId++,
						set_number: s.set_number,
						reps: s.reps,
						weight_kg: s.weight_kg,
						notes: s.notes || ''
					}))
				}));
				alert('已成功复制上次训练内容！');
			} else {
				alert('复制成功，但上次训练没有任何动作记录。');
				workoutData.exercises = []; // Clear current exercises
			}
		}
		loading = false;
	}

	/**
	 * Handles form submission to create a new, detailed workout log.
	 */
	async function handleSubmit() {
		// 更精确的验证逻辑
		if (workoutData.exercises.some((e) => !e.exercise_id || e.exercise_id === null)) {
			console.log('验证失败的动作:', workoutData.exercises.filter(e => !e.exercise_id || e.exercise_id === null));
			alert('请为所有动作选择一个有效的训练项目。');
			return;
		}

		loading = true;

		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();
			if (!user) throw new Error('用户未登录');

			const insertData: { [key: string]: any } = {
				user_id: user.id,
				date: workoutData.date,
				status: workoutData.status,
				mood: workoutData.mood
			};

			if (plan_version_id) {
				insertData.plan_version_id = plan_version_id;
			}

			const { data: logData, error: logError } = await supabase
				.from('workout_logs')
				.insert(insertData)
				.select('id')
				.single();

			if (logError) throw logError;
			if (!logData) throw new Error('Failed to create log entry.');

			const newLogId = (logData as any).id;

			for (const exercise of workoutData.exercises) {
				for (const set of exercise.sets) {
					if (set.reps !== null && set.weight_kg !== null) {
						const { error: setError } = await supabase.from('logged_sets').insert({
							log_id: newLogId,
							exercise_id: exercise.exercise_id,
							set_number: set.set_number,
							reps: set.reps,
							weight_kg: set.weight_kg,
							notes: set.notes
						});
						if (setError) throw setError;
					}
				}
			}

			// Reset form
			workoutData.date = new Date().toISOString().slice(0, 10);
			workoutData.status = statusOptions[0];
			workoutData.mood = '';
			workoutData.exercises = [
				{
					exercise_id: null,
					name: '',
					sets: [{ id: nextSetId++, set_number: 1, reps: null, weight_kg: null, notes: '' }]
				}
			];

			await getLogs();
			alert('训练记录已成功添加！');
		} catch (e: any) {
			error = e.message;
			console.error('Error creating log:', e);
			alert('添加记录失败: ' + e.message);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		const urlParams = $page.url.searchParams;
		const versionId = urlParams.get('plan_version_id');
		if (versionId) {
			plan_version_id = parseInt(versionId, 10);
		}

		loading = true;
		await Promise.all([getExercises(), getLogs()]);
		loading = false;
	});
</script>

<div class="p-4 bg-white rounded-lg shadow-md">
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-2xl font-bold">记录训练</h2>
		<button
			on:click={copyLastWorkout}
			disabled={loading}
			class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
		>
			<Fa icon={faCopy} />
			<span>复制上次训练</span>
		</button>
	</div>

	{#if error}
		<div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
			<span class="font-medium">错误:</span>
			{error}
		</div>
	{/if}

	<!-- Refactored Training Log Form -->
	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<label for="date" class="block text-sm font-medium text-gray-700">日期</label>
				<input
					type="date"
					id="date"
					bind:value={workoutData.date}
					class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
				/>
			</div>
			<div>
				<label for="status" class="block text-sm font-medium text-gray-700"
					>训练后状态</label
				>
				<select
					id="status"
					bind:value={workoutData.status}
					class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				>
					{#each statusOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="mood" class="block text-sm font-medium text-gray-700"
					>心情/感想 <span class="text-gray-400">(可选)</span></label
				>
				<input
					type="text"
					id="mood"
					bind:value={workoutData.mood}
					class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="今天感觉棒极了！✨"
				/>
			</div>
		</div>

		{#if plan_version_id}
			<div class="p-3 bg-blue-100 text-blue-800 rounded-md text-center">
				正在从计划版本 <span class="font-bold">#{plan_version_id}</span> 记录训练。
			</div>
		{/if}

		<hr />

		{#each workoutData.exercises as exercise, exerciseIndex}
			<div class="p-4 border border-gray-200 rounded-lg space-y-4 relative">
				<button
					type="button"
					on:click={() => removeExercise(exerciseIndex)}
					class="absolute top-2 right-2 text-red-500 hover:text-red-700"
					aria-label="删除动作"
				>
					<Fa icon={faTrash} />
				</button>

				<div class="grid grid-cols-1 gap-4">
					<div>
						<label for="exercise-{exerciseIndex}" class="block text-sm font-medium text-gray-700"
							>动作 #{exerciseIndex + 1}</label
						>
						<select
							id="exercise-{exerciseIndex}"
							bind:value={exercise.exercise_id}
							on:change={(e) => handleExerciseSelection(e, exerciseIndex)}
							class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							required
						>
							<option value="" disabled>选择一个动作</option>
							{#each exercises as ex}
								<option value={ex.id}>{ex.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Sets -->
				<div
					class="space-y-2"
					use:dndzone={{ items: exercise.sets, flipDurationMs }}
					on:consider={(e) => handleDndSort(e, exerciseIndex)}
					on:finalize={(e) => handleDndSort(e, exerciseIndex)}
				>
					<label class="block text-sm font-medium text-gray-700">组数</label>
					{#each exercise.sets as set, setIndex (set.id)}
						<div class="grid grid-cols-12 gap-2 items-center">
							<div class="col-span-1 text-gray-400 cursor-grab active:cursor-grabbing">
								<Fa icon={faGripLines} />
							</div>
							<span class="col-span-1 text-sm text-gray-500">#{set.set_number}</span>
							<div class="col-span-3">
								<input
									type="number"
									placeholder="次数"
									bind:value={set.reps}
									class="w-full p-2 border border-gray-300 rounded-md sm:text-sm"
									min="0"
								/>
							</div>
							<div class="col-span-4">
								<input
									type="number"
									placeholder="重量 (kg)"
									step="0.5"
									bind:value={set.weight_kg}
									class="w-full p-2 border border-gray-300 rounded-md sm:text-sm"
									min="0"
								/>
							</div>
							<div class="col-span-2">
								<button
									type="button"
									on:click={() => removeSet(exerciseIndex, setIndex)}
									class="text-red-500 hover:text-red-700"
									aria-label="删除该组"
								>
									<Fa icon={faTrash} size="sm" />
								</button>
							</div>
						</div>
					{/each}
					<button
						type="button"
						on:click={() => addSet(exerciseIndex)}
						class="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
					>
						<Fa icon={faPlus} size="sm" />
						添加一组
					</button>
				</div>
			</div>
		{/each}

		<button
			type="button"
			on:click={addExercise}
			class="w-full flex justify-center items-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600"
		>
			<Fa icon={faPlus} />
			添加训练动作
		</button>

		<button
			type="submit"
			disabled={loading}
			class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
		>
			{loading ? '正在保存...' : '保存完整训练'}
		</button>
	</form>

	<!-- Training History -->
	<div class="mt-8">
		<h3 class="text-xl font-bold mb-4">最近的训练历史 (原始组)</h3>
		{#if loading && logs.length === 0}
			<p>正在加载历史记录...</p>
		{:else if logs.length === 0}
			<p>没有找到训练记录。</p>
		{:else}
			<div class="space-y-2">
				{#each logs as log}
					<div class="p-3 bg-gray-100 rounded-md">
						<p class="font-semibold">
							{log.exercises.name}: {log.reps}次 @ {log.weight_kg}kg
						</p>
						<p class="text-sm text-gray-500">
							组号: {log.set_number} | {new Date(log.created_at).toLocaleString()}
						</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
