<script lang="ts">
	import type { PageData } from './$types';
	import { ChevronLeft, Edit, History, Copy, Download, BarChart3, Clock, Weight, Target } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const { plan } = data;

	// 计算统计数据
	function calculateStats() {
		const exercises = plan.plan_exercises || [];
		
		const totalSets = exercises.reduce((sum: number, ex: any) => sum + (ex.target_sets || 0), 0);
		const totalReps = exercises.reduce((sum: number, ex: any) => sum + ((ex.target_sets || 0) * (ex.target_reps || 0)), 0);
		const totalWeight = exercises.reduce((sum: number, ex: any) => {
			const weight = ex.target_weight_kg || 0;
			const sets = ex.target_sets || 0;
			return sum + (weight * sets);
		}, 0);
		const estimatedDuration = exercises.length * 5; // 每个动作估计5分钟

		return {
			totalExercises: exercises.length,
			totalSets,
			totalReps,
			totalWeight,
			estimatedDuration
		};
	}

	// 辅助函数获取exercise数据
	function getExerciseData(exercise: any) {
		return Array.isArray(exercise.exercises) ? exercise.exercises[0] : exercise.exercises;
	}

	function analyzeMuscleGroups() {
		const exercises = plan.plan_exercises || [];
		const groups: Record<string, number> = {};
		
		exercises.forEach((ex: any) => {
			const exerciseData = getExerciseData(ex);
			const muscle = exerciseData?.muscle_group || '其他';
			groups[muscle] = (groups[muscle] || 0) + 1;
		});
		
		return groups;
	}

	function analyzeDifficulty() {
		const exercises = plan.plan_exercises || [];
		const levels: Record<string, number> = {};
		
		exercises.forEach((ex: any) => {
			const exerciseData = getExerciseData(ex);
			const difficulty = exerciseData?.difficulty_level || '未知';
			levels[difficulty] = (levels[difficulty] || 0) + 1;
		});
		
		return levels;
	}

	$: stats = calculateStats();
	$: muscleGroups = analyzeMuscleGroups();
	$: difficultyLevels = analyzeDifficulty();

	async function copyPlan() {
		try {
			const duplicatedPlan = {
				name: `${plan.name} (副本)`,
				description: plan.description,
				exercises: plan.plan_exercises.map((ex: any) => ({
					exercise_id: ex.exercises?.id,
					target_sets: ex.target_sets,
					target_reps: ex.target_reps,
					target_weight_kg: ex.target_weight_kg,
					notes: ex.notes,
					exercise_order: ex.exercise_order,
					day_of_week: ex.day_of_week || 1
				}))
			};

			const response = await fetch('/api/plans', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(duplicatedPlan)
			});

			if (response.ok) {
				const newPlan = await response.json();
				goto(`/plans/${newPlan.id}`);
			}
		} catch (error) {
			console.error('复制计划失败:', error);
		}
	}

	function exportPlan() {
		const exportData = {
			name: plan.name,
			description: plan.description,
			created_at: plan.created_at,
			updated_at: plan.updated_at,
			exercises: plan.plan_exercises.map((ex: any) => ({
				name: ex.exercises?.name || '未知动作',
				muscle_group: ex.exercises?.muscle_group,
				sets: ex.target_sets,
				reps: ex.target_reps,
				weight: ex.target_weight_kg,
				notes: ex.notes
			})),
			stats
		};

		const dataStr = JSON.stringify(exportData, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${plan.name}_训练计划.json`;
		link.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>{plan.name} - 训练计划详情</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="max-w-7xl mx-auto px-4 py-6">
		<!-- 顶部导航 -->
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center gap-4">
				<button
					on:click={() => goto('/plans')}
					class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
				>
					<ChevronLeft class="w-5 h-5" />
					返回列表
				</button>
				<h1 class="text-2xl font-bold text-gray-800 dark:text-white">{plan.name}</h1>
			</div>

			<div class="flex items-center gap-3">
				<button
					on:click={copyPlan}
					class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
				>
					<Copy class="w-4 h-4" />
					复制计划
				</button>
				<button
					on:click={exportPlan}
					class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Download class="w-4 h-4" />
					导出
				</button>
				<button
					on:click={() => goto(`/plans/${plan.id}/edit`)}
					class="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
				>
					<Edit class="w-4 h-4" />
					编辑
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- 左侧：基本信息和统计 -->
			<div class="lg:col-span-1 space-y-6">
				<!-- 基本信息 -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
					<h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">基本信息</h2>
					
					{#if plan.description}
						<div class="mb-4">
							<div class="text-sm font-medium text-gray-600 dark:text-gray-400">描述</div>
							<p class="mt-1 text-gray-800 dark:text-white">{plan.description}</p>
						</div>
					{/if}

					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">创建时间</span>
							<span class="text-gray-800 dark:text-white">
								{new Date(plan.created_at).toLocaleDateString()}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">更新时间</span>
							<span class="text-gray-800 dark:text-white">
								{new Date(plan.updated_at).toLocaleDateString()}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">版本</span>
							<span class="text-gray-800 dark:text-white">v{plan.version || 1}</span>
						</div>
					</div>
				</div>

				<!-- 统计数据 -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
					<h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
						<BarChart3 class="w-5 h-5" />
						训练统计
					</h2>
					
					<div class="grid grid-cols-2 gap-4">
						<div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
							<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalExercises}</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">总动作数</div>
						</div>
						<div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
							<div class="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalSets}</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">总组数</div>
						</div>
						<div class="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
							<div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalReps}</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">总次数</div>
						</div>
						<div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
							<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.estimatedDuration}m</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">预计时长</div>
						</div>
					</div>

					{#if stats.totalWeight > 0}
						<div class="mt-4 text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
							<div class="text-2xl font-bold text-red-600 dark:text-red-400">{stats.totalWeight}kg</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">总重量</div>
						</div>
					{/if}
				</div>

				<!-- 肌群分布 -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
					<h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">肌群分布</h3>
					<div class="space-y-2">
						{#each Object.entries(muscleGroups) as [muscle, count]}
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-600 dark:text-gray-400">{muscle}</span>
								<span class="text-sm font-medium text-gray-800 dark:text-white">{count} 个动作</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- 难度分布 -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
					<h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">难度分布</h3>
					<div class="space-y-2">
						{#each Object.entries(difficultyLevels) as [level, count]}
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-600 dark:text-gray-400">{level}</span>
								<span class="text-sm font-medium text-gray-800 dark:text-white">{count} 个动作</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- 右侧：动作列表 -->
			<div class="lg:col-span-2">
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow">
					<div class="p-6 border-b border-gray-200 dark:border-gray-700">
						<h2 class="text-lg font-semibold text-gray-800 dark:text-white">训练动作</h2>
					</div>

					<div class="p-6">
						{#if plan.plan_exercises && plan.plan_exercises.length > 0}
							<div class="space-y-4">
								{#each plan.plan_exercises.sort((a, b) => (a.exercise_order || 0) - (b.exercise_order || 0)) as exercise, index}
									<div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
										<div class="flex items-center gap-3 mb-2">
											<span class="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-bold">
												{index + 1}
											</span>
											<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
												{getExerciseData(exercise)?.name || '未知动作'}
											</h3>
										</div>
										
										<div class="flex flex-wrap gap-2 mb-3">
											{#if getExerciseData(exercise)?.muscle_group}
												<span class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-300">
													{getExerciseData(exercise).muscle_group}
												</span>
											{/if}
											{#if getExerciseData(exercise)?.difficulty_level}
												<span class="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded dark:bg-orange-900 dark:text-orange-300">
													{getExerciseData(exercise).difficulty_level}
												</span>
											{/if}
											{#if getExerciseData(exercise)?.equipment}
												<span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded dark:bg-green-900 dark:text-green-300">
													{getExerciseData(exercise).equipment}
												</span>
											{/if}
										</div>
										
										{#if getExerciseData(exercise)?.description}
											<p class="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
												{getExerciseData(exercise).description}
											</p>
										{/if}

										<div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<div class="text-center">
												<div class="text-lg font-bold text-gray-800 dark:text-white">{exercise.target_sets || 0}</div>
												<div class="text-xs text-gray-600 dark:text-gray-400">组数</div>
											</div>
											<div class="text-center">
												<div class="text-lg font-bold text-gray-800 dark:text-white">{exercise.target_reps || 0}</div>
												<div class="text-xs text-gray-600 dark:text-gray-400">次数</div>
											</div>
											{#if exercise.target_weight_kg}
												<div class="text-center">
													<div class="text-lg font-bold text-gray-800 dark:text-white">{exercise.target_weight_kg}kg</div>
													<div class="text-xs text-gray-600 dark:text-gray-400">重量</div>
												</div>
											{/if}
											{#if exercise.day_of_week}
												<div class="text-center">
													<div class="text-lg font-bold text-gray-800 dark:text-white">第{exercise.day_of_week}天</div>
													<div class="text-xs text-gray-600 dark:text-gray-400">训练日</div>
												</div>
											{/if}
										</div>

										{#if exercise.notes}
											<div class="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
												<p class="text-sm text-yellow-800 dark:text-yellow-200">{exercise.notes}</p>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						{:else}
							<div class="text-center py-12">
								<Target class="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<p class="text-gray-600 dark:text-gray-400">此计划暂无训练动作</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div> 