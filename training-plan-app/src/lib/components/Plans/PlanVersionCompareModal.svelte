<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { X, ArrowLeft, ArrowRight } from 'lucide-svelte';

	// 类型定义
	type PlanContent = {
		plan_name?: string;
		plan_description?: string;
		exercises?: Array<{
			exercise_id: number;
			target_sets: number;
			target_reps: number;
			target_weight_kg?: number;
			notes?: string;
			exercise_order: number;
			day_of_week: number;
		}>;
	};

	// Props
	export let planId: string | number;
	export let planName: string = '';
	export let version1Number: number;
	export let version2Number: number;

	// 事件派发
	const dispatch = createEventDispatcher();

	// 组件状态
	let version1Content: PlanContent | null = null;
	let version2Content: PlanContent | null = null;
	let isLoading = true;
	let errorMessage = '';

	/**
	 * 获取指定版本的内容
	 */
	async function fetchVersionContent(versionNumber: number): Promise<PlanContent | null> {
		try {
			const response = await fetch(`/api/plans/${planId}/versions/${versionNumber}`);
			
			if (response.ok) {
				return await response.json();
			} else {
				const result = await response.json();
				throw new Error(result.error || `获取版本 ${versionNumber} 失败`);
			}
		} catch (error) {
			console.error(`获取版本 ${versionNumber} 内容时发生错误:`, error);
			throw error;
		}
	}

	/**
	 * 加载两个版本的内容
	 */
	async function loadVersionContents() {
		isLoading = true;
		errorMessage = '';

		try {
			const [content1, content2] = await Promise.all([
				fetchVersionContent(version1Number),
				fetchVersionContent(version2Number)
			]);

			version1Content = content1;
			version2Content = content2;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '加载版本内容失败';
		} finally {
			isLoading = false;
		}
	}

	/**
	 * 比较两个值是否不同
	 */
	function isDifferent(value1: any, value2: any): boolean {
		return JSON.stringify(value1) !== JSON.stringify(value2);
	}

	/**
	 * 获取差异样式类
	 */
	function getDiffClass(value1: any, value2: any): string {
		return isDifferent(value1, value2) ? 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700' : '';
	}

	/**
	 * 关闭模态框
	 */
	function close() {
		dispatch('close');
	}

	// 组件挂载时加载版本内容
	onMount(() => {
		loadVersionContents();
	});
</script>

<!-- 模态框遮罩 -->
<div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
		
		<!-- 标题栏 -->
		<div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
			<div>
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">版本对比</h2>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{planName || `计划 #${planId}`} - 版本 {version1Number} vs 版本 {version2Number}
				</p>
			</div>
			<button
				on:click={close}
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
			>
				<X class="w-5 h-5" />
			</button>
		</div>

		<!-- 内容区域 -->
		<div class="flex-1 overflow-hidden">
			{#if errorMessage}
				<div class="p-6">
					<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
						<p class="text-red-800 dark:text-red-200 text-sm">{errorMessage}</p>
					</div>
				</div>
			{:else if isLoading}
				<div class="flex justify-center items-center py-12">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<span class="ml-3 text-gray-600 dark:text-gray-300">加载版本内容...</span>
				</div>
			{:else if version1Content && version2Content}
				<div class="h-full overflow-y-auto">
					<!-- 并排对比布局 -->
					<div class="grid grid-cols-2 gap-6 p-6">
						<!-- 版本1 -->
						<div class="space-y-4">
							<div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
								<h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center">
									<ArrowLeft class="w-5 h-5 mr-2" />
									版本 {version1Number}
								</h3>
							</div>

							<!-- 基本信息对比 -->
							<div class="space-y-3">
								<h4 class="font-semibold text-gray-700 dark:text-gray-300">基本信息</h4>
								
								<!-- 计划名称 -->
								<div class="p-3 rounded {getDiffClass(version1Content.plan_name, version2Content.plan_name)}">
									<label class="text-sm font-medium text-gray-600 dark:text-gray-400">计划名称:</label>
									<p class="text-gray-800 dark:text-gray-200">{version1Content.plan_name || '未设置'}</p>
								</div>

								<!-- 计划描述 -->
								<div class="p-3 rounded {getDiffClass(version1Content.plan_description, version2Content.plan_description)}">
									<label class="text-sm font-medium text-gray-600 dark:text-gray-400">计划描述:</label>
									<p class="text-gray-800 dark:text-gray-200">{version1Content.plan_description || '未设置'}</p>
								</div>
							</div>

							<!-- 动作列表 -->
							<div class="space-y-3">
								<h4 class="font-semibold text-gray-700 dark:text-gray-300">训练动作</h4>
								{#if version1Content.exercises && version1Content.exercises.length > 0}
									<div class="space-y-2">
										{#each version1Content.exercises as exercise, index}
											{@const correspondingExercise = version2Content.exercises?.[index]}
											<div class="p-3 border rounded {getDiffClass(exercise, correspondingExercise)}">
												<div class="font-medium text-gray-800 dark:text-gray-200">
													动作 ID: {exercise.exercise_id}
												</div>
												<div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
													{exercise.target_sets} 组 × {exercise.target_reps} 次
													{#if exercise.target_weight_kg}
														@ {exercise.target_weight_kg}kg
													{/if}
												</div>
												{#if exercise.notes}
													<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
														备注: {exercise.notes}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-gray-500 dark:text-gray-400 italic">无训练动作</p>
								{/if}
							</div>
						</div>

						<!-- 版本2 -->
						<div class="space-y-4">
							<div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
								<h3 class="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center">
									<ArrowRight class="w-5 h-5 mr-2" />
									版本 {version2Number}
								</h3>
							</div>

							<!-- 基本信息对比 -->
							<div class="space-y-3">
								<h4 class="font-semibold text-gray-700 dark:text-gray-300">基本信息</h4>
								
								<!-- 计划名称 -->
								<div class="p-3 rounded {getDiffClass(version2Content.plan_name, version1Content.plan_name)}">
									<label class="text-sm font-medium text-gray-600 dark:text-gray-400">计划名称:</label>
									<p class="text-gray-800 dark:text-gray-200">{version2Content.plan_name || '未设置'}</p>
								</div>

								<!-- 计划描述 -->
								<div class="p-3 rounded {getDiffClass(version2Content.plan_description, version1Content.plan_description)}">
									<label class="text-sm font-medium text-gray-600 dark:text-gray-400">计划描述:</label>
									<p class="text-gray-800 dark:text-gray-200">{version2Content.plan_description || '未设置'}</p>
								</div>
							</div>

							<!-- 动作列表 -->
							<div class="space-y-3">
								<h4 class="font-semibold text-gray-700 dark:text-gray-300">训练动作</h4>
								{#if version2Content.exercises && version2Content.exercises.length > 0}
									<div class="space-y-2">
										{#each version2Content.exercises as exercise, index}
											{@const correspondingExercise = version1Content.exercises?.[index]}
											<div class="p-3 border rounded {getDiffClass(exercise, correspondingExercise)}">
												<div class="font-medium text-gray-800 dark:text-gray-200">
													动作 ID: {exercise.exercise_id}
												</div>
												<div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
													{exercise.target_sets} 组 × {exercise.target_reps} 次
													{#if exercise.target_weight_kg}
														@ {exercise.target_weight_kg}kg
													{/if}
												</div>
												{#if exercise.notes}
													<div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
														备注: {exercise.notes}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-gray-500 dark:text-gray-400 italic">无训练动作</p>
								{/if}
							</div>
						</div>
					</div>

					<!-- 差异说明 -->
					<div class="border-t border-gray-200 dark:border-gray-700 p-6">
						<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
							<h4 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">差异说明</h4>
							<p class="text-sm text-yellow-700 dark:text-yellow-300">
								标记为黄色背景的区域表示两个版本间存在差异。未标记的区域表示内容相同。
							</p>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- 底部操作栏 -->
		<div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
			<button
				on:click={close}
				class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
			>
				关闭
			</button>
		</div>
	</div>
</div> 