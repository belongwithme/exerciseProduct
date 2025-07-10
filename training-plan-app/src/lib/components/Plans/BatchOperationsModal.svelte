<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Download, Copy, Trash2, X } from 'lucide-svelte';
	import { notifications } from '$lib/stores/notifications';

	export let selectedPlans: string[] = [];
	export let allPlans: any[] = [];

	const dispatch = createEventDispatcher();

	$: selectedPlanDetails = allPlans.filter(plan => selectedPlans.includes(plan.id));

	let isLoading = false;

	function close() {
		dispatch('close');
	}

	async function batchDelete() {
		if (selectedPlans.length === 0) return;

		isLoading = true;

		try {
			const deletePromises = selectedPlans.map(planId => 
				fetch(`/api/plans/${planId}`, { method: 'DELETE' })
			);

			const results = await Promise.all(deletePromises);
			const failedDeletes = results.filter(result => !result.ok);

			if (failedDeletes.length > 0) {
				notifications.error('删除失败', `${failedDeletes.length} 个计划删除失败`);
			} else {
				notifications.success('删除成功', `成功删除 ${selectedPlans.length} 个训练计划`);
				dispatch('success', { action: 'delete', count: selectedPlans.length });
				close();
			}
		} catch (error) {
			console.error('批量删除失败:', error);
			notifications.error('删除失败', '删除过程中发生错误，请重试');
		}

		isLoading = false;
	}

	async function batchCopy() {
		if (selectedPlans.length === 0) return;

		isLoading = true;

		try {
			const copyPromises = selectedPlanDetails.map(plan => {
				const duplicatedPlan = {
					name: `${plan.name} (副本)`,
					description: plan.description,
					exercises: plan.plan_exercises.map((ex: any) => ({
						exercise_id: ex.exercise_id,
						target_sets: ex.target_sets,
						target_reps: ex.target_reps,
						target_weight_kg: ex.target_weight_kg,
						notes: ex.notes,
						exercise_order: ex.exercise_order,
						day_of_week: ex.day_of_week
					}))
				};

				return fetch('/api/plans', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(duplicatedPlan)
				});
			});

			const results = await Promise.all(copyPromises);
			const failedCopies = results.filter(result => !result.ok);

			if (failedCopies.length > 0) {
				notifications.error('复制失败', `${failedCopies.length} 个计划复制失败`);
			} else {
				notifications.success('复制成功', `成功复制 ${selectedPlans.length} 个训练计划`);
				dispatch('success', { action: 'copy', count: selectedPlans.length });
				close();
			}
		} catch (error) {
			console.error('批量复制失败:', error);
			notifications.error('复制失败', '复制过程中发生错误，请重试');
		}

		isLoading = false;
	}

	function batchExport() {
		if (selectedPlans.length === 0) return;

		const exportData = {
			export_date: new Date().toISOString(),
			total_plans: selectedPlans.length,
			plans: selectedPlanDetails.map(plan => ({
				name: plan.name,
				description: plan.description,
				created_at: plan.created_at,
				updated_at: plan.updated_at,
				exercises: plan.plan_exercises.map((ex: any) => ({
					exercise_name: ex.exercises?.name || '未知动作',
					muscle_group: ex.exercises?.muscle_group,
					sets: ex.target_sets,
					reps: ex.target_reps,
					weight: ex.target_weight_kg,
					notes: ex.notes,
					order: ex.exercise_order
				})),
				stats: {
					total_exercises: plan.plan_exercises.length,
					total_sets: plan.plan_exercises.reduce((sum: number, ex: any) => sum + (ex.target_sets || 0), 0),
					total_reps: plan.plan_exercises.reduce((sum: number, ex: any) => sum + ((ex.target_sets || 0) * (ex.target_reps || 0)), 0)
				}
			}))
		};

		const dataStr = JSON.stringify(exportData, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `训练计划批量导出_${new Date().toISOString().split('T')[0]}.json`;
		link.click();
		URL.revokeObjectURL(url);

		notifications.success('导出成功', `成功导出 ${selectedPlans.length} 个训练计划`);
		dispatch('success', { action: 'export', count: selectedPlans.length });
		close();
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
		<div class="p-6 border-b flex justify-between items-center">
			<h2 class="text-xl font-bold text-gray-800 dark:text-white">
				批量操作 ({selectedPlans.length} 个计划)
			</h2>
			<button
				on:click={close}
				class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
			>
				<X class="w-6 h-6" />
			</button>
		</div>

		<div class="p-6 flex-1 overflow-y-auto">
			<!-- 选中的计划列表 -->
			<div class="mb-6">
				<h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white">选中的计划</h3>
				<div class="space-y-2 max-h-40 overflow-y-auto">
					{#each selectedPlanDetails as plan}
						<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<div>
								<div class="font-medium text-gray-800 dark:text-white">{plan.name}</div>
								<div class="text-sm text-gray-600 dark:text-gray-400">
									{plan.plan_exercises.length} 个动作
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- 操作按钮 -->
			<div class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<button
						on:click={batchCopy}
						disabled={isLoading}
						class="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
					>
						<Copy class="w-5 h-5 mr-2" />
						批量复制
					</button>

					<button
						on:click={batchExport}
						disabled={isLoading}
						class="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
					>
						<Download class="w-5 h-5 mr-2" />
						批量导出
					</button>

					<button
						on:click={batchDelete}
						disabled={isLoading}
						class="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
					>
						<Trash2 class="w-5 h-5 mr-2" />
						批量删除
					</button>
				</div>

				<!-- 删除警告 -->
				<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800 dark:text-red-200">
								注意事项
							</h3>
							<div class="mt-2 text-sm text-red-700 dark:text-red-300">
								<ul class="list-disc list-inside space-y-1">
									<li>批量删除操作无法撤销，请谨慎操作</li>
									<li>复制操作会创建新的计划副本</li>
									<li>导出为 JSON 格式，包含完整的计划数据</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>


		</div>

		<!-- 底部按钮 -->
		<div class="p-6 border-t flex justify-end">
			<button
				on:click={close}
				disabled={isLoading}
				class="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
			>
				{isLoading ? '处理中...' : '关闭'}
			</button>
		</div>
	</div>
</div>
