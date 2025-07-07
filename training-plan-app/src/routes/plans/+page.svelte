<script lang="ts">
	import type { PageData } from './$types';
	import { Plus, Trash2, Edit } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	export let data: PageData;

	// 使用 store 来管理计划，方便实时更新 UI
	const plans = writable(data.plans || []);
	
	onMount(() => {
		// 如果从服务器加载的数据不为空，则更新 store
		if (data.plans) {
			plans.set(data.plans);
		}
	});

	let showCreateEditModal = false;
	let showDeleteModal = false;
	let selectedPlan = null;
	let planToDelete = null;

	function openNewPlanModal() {
		selectedPlan = null;
		showCreateEditModal = true;
	}

	function openEditPlanModal(plan) {
		selectedPlan = plan;
		showCreateEditModal = true;
	}

	function openDeletePlanModal(plan) {
		planToDelete = plan;
		showDeleteModal = true;
	}

	async function handlePlanSave(event) {
		const savedPlan = event.detail;
		if (savedPlan.id) {
			// 更新
			plans.update(p => p.map(plan => plan.id === savedPlan.id ? savedPlan : plan));
		} else {
			// 创建
			plans.update(p => [...p, savedPlan]);
		}
		showCreateEditModal = false;
	}

	async function handlePlanDelete() {
		if (!planToDelete) return;
		
		const response = await fetch(`/api/plans/${planToDelete.id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			plans.update(p => p.filter(plan => plan.id !== planToDelete.id));
			planToDelete = null;
			showDeleteModal = false;
		} else {
			// 可以在这里添加错误提示
			console.error('删除失败');
		}
	}

	// 动态导入组件，因为它们只在特定交互时需要
	let PlanFormModal;
	onMount(async () => {
		const module = await import('$lib/components/Plans/PlanFormModal.svelte');
		PlanFormModal = module.default;
	});

</script>

<div class="container mx-auto p-4 md:p-8">
	<div class="flex justify-between items-center mb-6 border-b pb-2">
		<h1 class="text-3xl font-bold text-gray-800 dark:text-white">
			我的训练计划
		</h1>
		<button
			on:click={openNewPlanModal}
			class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			<Plus class="w-5 h-5 mr-2" />
			新建计划
		</button>
	</div>

	{#if $plans && $plans.length > 0}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each $plans as plan (plan.id)}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1">
					<div class="p-6">
						<div class="flex justify-between items-start">
							<h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{plan.name}</h2>
							<div class="flex space-x-2">
								<button on:click={() => openEditPlanModal(plan)} class="text-gray-500 hover:text-blue-600">
									<Edit class="w-5 h-5" />
								</button>
								<button on:click={() => openDeletePlanModal(plan)} class="text-gray-500 hover:text-red-600">
									<Trash2 class="w-5 h-5" />
								</button>
							</div>
						</div>
						<p class="text-gray-600 dark:text-gray-400 mb-4 h-12 overflow-hidden">
							{plan.description || '暂无描述'}
						</p>
						<div class="mt-4 border-t pt-4">
							<h4 class="font-semibold mb-2">包含动作:</h4>
							<ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
								{#each plan.plan_exercises.slice(0, 3) as item}
									<li>{item.exercises.name}</li>
								{/each}
								{#if plan.plan_exercises.length > 3}
									<li class="text-gray-500">...等 {plan.plan_exercises.length} 个动作</li>
								{/if}
							</ul>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
			<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
			</svg>
			<h3 class="mt-2 text-xl font-medium text-gray-900 dark:text-white">暂无训练计划</h3>
			<p class="mt-1 text-gray-500">开始创建你的第一个训练计划吧！</p>
		</div>
	{/if}
</div>

{#if showCreateEditModal && PlanFormModal}
	<svelte:component this={PlanFormModal} plan={selectedPlan} on:save={handlePlanSave} on:close={() => showCreateEditModal = false} />
{/if}

{#if showDeleteModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
			<h2 class="text-lg font-bold mb-4">确认删除</h2>
			<p>你确定要删除训练计划 "{planToDelete?.name}" 吗？此操作无法撤销。</p>
			<div class="mt-6 flex justify-end space-x-4">
				<button on:click={() => showDeleteModal = false} class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
					取消
				</button>
				<button on:click={handlePlanDelete} class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
					删除
				</button>
			</div>
		</div>
	</div>
{/if} 