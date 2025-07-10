<script lang="ts">
	import type { PageData } from './$types';
	import { Plus, Trash2, Edit, History, Search, Filter, Copy, Eye, CheckSquare, Square } from 'lucide-svelte';
	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import BatchOperationsModal from '$lib/components/Plans/BatchOperationsModal.svelte';

	export let data: PageData;

	// 类型定义
	type Plan = {
		id: string;
		name: string;
		description: string;
		created_at: string;
		updated_at: string;
		plan_exercises: any[];
	};

	// 使用 store 来管理计划，方便实时更新 UI
	const allPlans = writable(data.plans || []);
	const searchTerm = writable('');
	const sortBy = writable('updated_at');
	const sortOrder = writable('desc');
	const filterBy = writable('all');

	// 辅助函数获取exercise数据
	function getExerciseData(exercise: any) {
		return Array.isArray(exercise.exercises) ? exercise.exercises[0] : exercise.exercises;
	}
	
	// 派生状态 - 基于搜索和筛选条件过滤计划
	const filteredPlans = derived(
		[allPlans, searchTerm, sortBy, sortOrder, filterBy],
		([$allPlans, $searchTerm, $sortBy, $sortOrder, $filterBy]) => {
			let filtered = [...$allPlans];

			// 搜索过滤
			if ($searchTerm) {
				const term = $searchTerm.toLowerCase();
				filtered = filtered.filter(plan => 
					plan.name.toLowerCase().includes(term) || 
					plan.description?.toLowerCase().includes(term) ||
					plan.plan_exercises.some(ex => {
						const exerciseData = getExerciseData(ex);
						return exerciseData?.name?.toLowerCase().includes(term);
					})
				);
			}

			// 类型过滤
			if ($filterBy !== 'all') {
				if ($filterBy === 'recent') {
					const oneWeekAgo = new Date();
					oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
					filtered = filtered.filter(plan => new Date(plan.updated_at) > oneWeekAgo);
				} else if ($filterBy === 'large') {
					filtered = filtered.filter(plan => plan.plan_exercises.length >= 5);
				} else if ($filterBy === 'small') {
					filtered = filtered.filter(plan => plan.plan_exercises.length < 5);
				}
			}

			// 排序
			filtered.sort((a, b) => {
				let aValue, bValue;
				
				switch ($sortBy) {
					case 'name':
						aValue = a.name.toLowerCase();
						bValue = b.name.toLowerCase();
						break;
					case 'created_at':
						aValue = new Date(a.created_at).getTime();
						bValue = new Date(b.created_at).getTime();
						break;
					case 'updated_at':
						aValue = new Date(a.updated_at).getTime();
						bValue = new Date(b.updated_at).getTime();
						break;
					case 'exercise_count':
						aValue = a.plan_exercises.length;
						bValue = b.plan_exercises.length;
						break;
					default:
						aValue = new Date(a.updated_at).getTime();
						bValue = new Date(b.updated_at).getTime();
				}

				if ($sortOrder === 'asc') {
					return aValue > bValue ? 1 : -1;
				} else {
					return aValue < bValue ? 1 : -1;
				}
			});

			return filtered;
		}
	);
	
	onMount(() => {
		// 如果从服务器加载的数据不为空，则更新 store
		if (data.plans) {
			allPlans.set(data.plans);
		}
	});

	let showCreateEditModal = false;
	let showDeleteModal = false;
	let showVersionHistoryModal = false;
	let showVersionCompareModal = false;
	let showBatchOperationsModal = false;
	let showFilters = false;
	let selectedPlan: Plan | null = null;
	let planToDelete: Plan | null = null;
	let planForVersionHistory: Plan | null = null;
	let compareVersions: { version1: number; version2: number } | null = null;
	let selectedPlans: string[] = [];
	let selectAllChecked = false;

	function openNewPlanModal() {
		selectedPlan = null;
		showCreateEditModal = true;
	}

	function openEditPlanModal(plan: Plan) {
		selectedPlan = plan;
		showCreateEditModal = true;
	}

	function openDeletePlanModal(plan: Plan) {
		planToDelete = plan;
		showDeleteModal = true;
	}

	function openVersionHistoryModal(plan: Plan) {
		planForVersionHistory = plan;
		showVersionHistoryModal = true;
	}

	async function handlePlanSave(event: CustomEvent) {
		const savedPlan = event.detail;
		if (savedPlan.id) {
			// 更新
			allPlans.update(p => p.map((plan: Plan) => plan.id === savedPlan.id ? savedPlan : plan));
		} else {
			// 创建
			allPlans.update(p => [...p, savedPlan]);
		}
		showCreateEditModal = false;
	}

	async function handlePlanDelete() {
		if (!planToDelete) return;
		
		const response = await fetch(`/api/plans/${planToDelete.id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			allPlans.update(p => p.filter((plan: Plan) => plan.id !== planToDelete!.id));
			planToDelete = null;
			showDeleteModal = false;
		} else {
			// 可以在这里添加错误提示
			console.error('删除失败');
		}
	}

	async function duplicatePlan(plan: Plan) {
		const duplicatedPlan = {
			name: `${plan.name} (副本)`,
			description: plan.description,
			exercises: plan.plan_exercises.map(ex => ({
				exercise_id: ex.exercise_id,
				target_sets: ex.target_sets,
				target_reps: ex.target_reps,
				target_weight_kg: ex.target_weight_kg,
				notes: ex.notes,
				exercise_order: ex.exercise_order,
				day_of_week: ex.day_of_week
			}))
		};

		const response = await fetch('/api/plans', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(duplicatedPlan)
		});

		if (response.ok) {
			const newPlan = await response.json();
			allPlans.update(p => [...p, newPlan]);
		} else {
			console.error('复制失败');
		}
	}

	function handleVersionHistoryClose() {
		showVersionHistoryModal = false;
		planForVersionHistory = null;
	}

	function handleVersionRevert() {
		// 恢复版本后刷新计划列表
		window.location.reload();
	}

	function handleVersionCompare(event: CustomEvent) {
		const { version1, version2 } = event.detail;
		compareVersions = { version1, version2 };
		showVersionCompareModal = true;
	}

	// 批量操作相关函数
	function toggleSelectAll() {
		if (selectAllChecked) {
			selectedPlans = [];
		} else {
			selectedPlans = $filteredPlans.map(plan => plan.id);
		}
		selectAllChecked = !selectAllChecked;
	}

	function toggleSelectPlan(planId: string) {
		if (selectedPlans.includes(planId)) {
			selectedPlans = selectedPlans.filter(id => id !== planId);
		} else {
			selectedPlans = [...selectedPlans, planId];
		}
		selectAllChecked = selectedPlans.length === $filteredPlans.length;
	}

	function openBatchOperationsModal() {
		if (selectedPlans.length > 0) {
			showBatchOperationsModal = true;
		}
	}

	function handleBatchOperationSuccess(event: CustomEvent) {
		const { action, count } = event.detail;
		
		if (action === 'delete') {
			// 从列表中移除被删除的计划
			allPlans.update(plans => plans.filter(plan => !selectedPlans.includes(plan.id)));
		} else if (action === 'copy') {
			// 重新加载数据以获取新复制的计划
			window.location.reload();
		}
		
		// 清空选择
		selectedPlans = [];
		selectAllChecked = false;
		showBatchOperationsModal = false;
	}

	function handleVersionCompareClose() {
		showVersionCompareModal = false;
		compareVersions = null;
		// 重新显示版本历史模态框
		showVersionHistoryModal = true;
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('zh-CN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// 动态导入组件，因为它们只在特定交互时需要
	let PlanFormModal: any;
	let PlanVersionHistoryModal: any;
	let PlanVersionCompareModal: any;
	onMount(async () => {
		const [formModule, historyModule, compareModule] = await Promise.all([
			import('$lib/components/Plans/PlanFormModal.svelte'),
			import('$lib/components/Plans/PlanVersionHistoryModal.svelte'),
			import('$lib/components/Plans/PlanVersionCompareModal.svelte')
		]);
		PlanFormModal = formModule.default;
		PlanVersionHistoryModal = historyModule.default;
		PlanVersionCompareModal = compareModule.default;
	});

</script>

<div class="container mx-auto p-4 md:p-8">
	<!-- 页面标题和操作按钮 -->
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
		<div>
			<h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
				我的训练计划
			</h1>
			<p class="text-gray-600 dark:text-gray-400">
				共 {$allPlans.length} 个计划，筛选后显示 {$filteredPlans.length} 个
				{#if selectedPlans.length > 0}
					<span class="ml-2 text-blue-600 dark:text-blue-400">
						已选择 {selectedPlans.length} 个
					</span>
				{/if}
			</p>
		</div>
		<div class="flex gap-2 mt-4 md:mt-0">
			{#if selectedPlans.length > 0}
				<button
					on:click={openBatchOperationsModal}
					class="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
				>
					批量操作 ({selectedPlans.length})
				</button>
			{/if}
			<button
				on:click={openNewPlanModal}
				class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				<Plus class="w-5 h-5 mr-2" />
				新建计划
			</button>
		</div>
	</div>

	<!-- 搜索和筛选工具栏 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 mb-6">
		<div class="flex flex-col md:flex-row gap-4">
			<!-- 搜索框 -->
			<div class="flex-1 relative">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
				<input
					type="text"
					placeholder="搜索计划名称、描述或动作..."
					bind:value={$searchTerm}
					class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				>
			</div>

			<!-- 筛选和排序 -->
			<div class="flex gap-2">
				<button
					on:click={() => showFilters = !showFilters}
					class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800"
				>
					<Filter class="w-4 h-4 mr-2" />
					筛选
				</button>

				<select
					bind:value={$sortBy}
					class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
				>
					<option value="updated_at">最近更新</option>
					<option value="created_at">创建时间</option>
					<option value="name">名称</option>
					<option value="exercise_count">动作数量</option>
				</select>

				<select
					bind:value={$sortOrder}
					class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
				>
					<option value="desc">降序</option>
					<option value="asc">升序</option>
				</select>
			</div>
		</div>

		<!-- 批量选择和展开的筛选选项 -->
		{#if showFilters || selectedPlans.length > 0}
			<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
				{#if selectedPlans.length > 0 || $filteredPlans.length > 0}
					<div class="flex items-center gap-4 mb-4">
						<label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							<button 
								on:click={toggleSelectAll}
								class="flex items-center justify-center w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded {selectAllChecked ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-700'}"
							>
								{#if selectAllChecked}
									<CheckSquare class="w-3 h-3 text-white" />
								{:else}
									<Square class="w-3 h-3 text-transparent" />
								{/if}
							</button>
							全选
						</label>
						{#if selectedPlans.length > 0}
							<span class="text-sm text-blue-600 dark:text-blue-400">
								已选择 {selectedPlans.length} / {$filteredPlans.length} 个计划
							</span>
						{/if}
					</div>
				{/if}
				
				{#if showFilters}
					<div class="flex flex-wrap gap-2">
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">类型筛选:</span>
					{#each [
						{ value: 'all', label: '全部' },
						{ value: 'recent', label: '最近一周' },
						{ value: 'large', label: '大型计划(≥5动作)' },
						{ value: 'small', label: '小型计划(<5动作)' }
					] as filter}
						<button
							on:click={() => filterBy.set(filter.value)}
							class="px-3 py-1 rounded-full text-sm transition-colors {$filterBy === filter.value 
								? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
								: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
						>
							{filter.label}
						</button>
					{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- 计划列表 -->
	{#if $filteredPlans && $filteredPlans.length > 0}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each $filteredPlans as plan (plan.id)}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {selectedPlans.includes(plan.id) ? 'ring-2 ring-blue-500' : ''}">
					<div class="p-6">
						<div class="flex justify-between items-start mb-3">
							<div class="flex items-center gap-3 flex-1">
								<button 
									on:click={() => toggleSelectPlan(plan.id)}
									class="flex items-center justify-center w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded {selectedPlans.includes(plan.id) ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-700'}"
								>
									{#if selectedPlans.includes(plan.id)}
										<CheckSquare class="w-3 h-3 text-white" />
									{:else}
										<Square class="w-3 h-3 text-transparent" />
									{/if}
								</button>
								<h2 class="text-xl font-bold text-gray-800 dark:text-white line-clamp-2 flex-1">{plan.name}</h2>
							</div>
							<div class="flex space-x-1 ml-2">
								<button 
									on:click={() => window.location.href = `/plans/${plan.id}`} 
									class="text-gray-500 hover:text-indigo-600 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
									title="查看详情"
								>
									<Eye class="w-4 h-4" />
								</button>
								<button 
									on:click={() => duplicatePlan(plan)} 
									class="text-gray-500 hover:text-green-600 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
									title="复制计划"
								>
									<Copy class="w-4 h-4" />
								</button>
								<button 
									on:click={() => openEditPlanModal(plan)} 
									class="text-gray-500 hover:text-blue-600 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
									title="编辑计划"
								>
									<Edit class="w-4 h-4" />
								</button>
								<button 
									on:click={() => openVersionHistoryModal(plan)} 
									class="text-gray-500 hover:text-purple-600 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
									title="版本历史"
								>
									<History class="w-4 h-4" />
								</button>
								<button 
									on:click={() => openDeletePlanModal(plan)} 
									class="text-gray-500 hover:text-red-600 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
									title="删除计划"
								>
									<Trash2 class="w-4 h-4" />
								</button>
							</div>
						</div>
						
						<p class="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3">
							{plan.description || '暂无描述'}
						</p>

						<!-- 计划统计信息 -->
						<div class="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
							<span>{plan.plan_exercises.length} 个动作</span>
							<span>更新于 {formatDate(plan.updated_at)}</span>
						</div>

						<div class="border-t pt-4">
							<h4 class="font-semibold mb-2 text-gray-800 dark:text-white">包含动作:</h4>
							<ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
								{#each plan.plan_exercises.slice(0, 3) as item}
									<li class="flex justify-between">
										<span>{getExerciseData(item)?.name || '未知动作'}</span>
										<span class="text-gray-400">{item.target_sets}组×{item.target_reps}次</span>
									</li>
								{/each}
								{#if plan.plan_exercises.length > 3}
									<li class="text-gray-500 text-center py-1">
										...还有 {plan.plan_exercises.length - 3} 个动作
									</li>
								{/if}
							</ul>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else if $allPlans.length > 0}
		<!-- 有数据但搜索结果为空 -->
		<div class="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
			<Search class="mx-auto h-12 w-12 text-gray-400 mb-4" />
			<h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">未找到匹配的训练计划</h3>
			<p class="text-gray-500 mb-4">尝试修改搜索条件或筛选选项</p>
			<button
				on:click={() => {
					searchTerm.set('');
					filterBy.set('all');
				}}
				class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
			>
				清除筛选条件
			</button>
		</div>
	{:else}
		<!-- 完全没有数据 -->
		<div class="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
			</svg>
			<h3 class="mt-2 text-xl font-medium text-gray-900 dark:text-white">暂无训练计划</h3>
			<p class="mt-1 text-gray-500 mb-6">开始创建你的第一个训练计划吧！</p>
			<button
				on:click={openNewPlanModal}
				class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
			>
				<Plus class="w-5 h-5 mr-2" />
				创建第一个计划
			</button>
		</div>
	{/if}
</div>

{#if showCreateEditModal && PlanFormModal}
	<svelte:component this={PlanFormModal} plan={selectedPlan} on:save={handlePlanSave} on:close={() => showCreateEditModal = false} />
{/if}

{#if showVersionHistoryModal && PlanVersionHistoryModal && planForVersionHistory}
	<svelte:component 
		this={PlanVersionHistoryModal} 
		planId={planForVersionHistory.id} 
		planName={planForVersionHistory.name}
		on:close={handleVersionHistoryClose}
		on:revertSuccess={handleVersionRevert}
		on:compare={handleVersionCompare}
	/>
{/if}

{#if showVersionCompareModal && PlanVersionCompareModal && planForVersionHistory && compareVersions}
	<svelte:component 
		this={PlanVersionCompareModal} 
		planId={planForVersionHistory.id} 
		planName={planForVersionHistory.name}
		version1Number={compareVersions.version1}
		version2Number={compareVersions.version2}
		on:close={handleVersionCompareClose}
	/>
{/if}

{#if showBatchOperationsModal}
	<BatchOperationsModal
		{selectedPlans}
		allPlans={$allPlans}
		on:success={handleBatchOperationSuccess}
		on:close={() => showBatchOperationsModal = false}
	/>
{/if}

{#if showDeleteModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
			<h2 class="text-lg font-bold mb-4">确认删除</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-6">
				你确定要删除训练计划 <span class="font-semibold">"{planToDelete?.name}"</span> 吗？
				<br><br>
				<span class="text-red-600 dark:text-red-400 text-sm">此操作无法撤销，请谨慎操作。</span>
			</p>
			<div class="flex justify-end space-x-4">
				<button 
					on:click={() => showDeleteModal = false} 
					class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
				>
					取消
				</button>
				<button 
					on:click={handlePlanDelete} 
					class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
				>
					确认删除
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style> 