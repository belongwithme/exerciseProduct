<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	// 'plans' is an array of workout plans, each with its exercises.
	// We infer the type from PageData to ensure it's in sync with the load function.
	$: plans = data.plans;

	// Index of the currently selected plan (tab). Defaults to the first plan.
	let selectedPlanIndex = 0;

	// A derived variable for the currently selected plan.
	$: selectedPlan = plans?.[selectedPlanIndex];

	/**
	 * Changes the selected plan index.
	 * @param {number} index - The index of the plan to select.
	 */
	function selectPlan(index: number) {
		selectedPlanIndex = index;
	}
</script>

<div class="container mx-auto p-4 md:p-8">
	<h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">
		训练计划
	</h1>

	{#if plans && plans.length > 0}
		<!-- Tabs for selecting a plan -->
		<div class="flex border-b mb-6">
			{#each plans as plan, index}
				<button
					on:click={() => selectPlan(index)}
					class="py-2 px-4 font-semibold text-lg focus:outline-none"
					class:text-blue-600={selectedPlanIndex === index}
					class:border-b-2={selectedPlanIndex === index}
					class:border-blue-600={selectedPlanIndex === index}
					class:text-gray-500={selectedPlanIndex !== index}
				>
					{plan.name || `计划 ${index + 1}`}
				</button>
			{/each}
		</div>

		<!-- Selected Plan Details -->
		{#if selectedPlan}
			<div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
				<!-- Plan Description -->
				<div class="mb-6">
					<h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
						阶段目标
					</h2>
					<p class="text-gray-600 dark:text-gray-400">
						{selectedPlan.description || '暂无描述'}
					</p>
				</div>

				<!-- Exercises List -->
				<div>
					<h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">训练内容</h3>
					<div class="space-y-4">
						{#each selectedPlan.plan_exercises as item}
							<div
								class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center"
							>
								<div>
									<h4 class="font-bold text-lg text-gray-800 dark:text-white">
										{item.exercises.name}
									</h4>
									<p class="text-sm text-gray-500 dark:text-gray-400">
										{item.exercises.muscle_group} | {item.exercises.equipment}
									</p>
									{#if item.notes}
										<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
											备注: {item.notes}
										</p>
									{/if}
								</div>
								<div class="text-right">
									<p class="text-lg font-semibold text-gray-800 dark:text-white">
										{item.target_sets} x {item.target_reps}
									</p>
									<p class="text-sm text-gray-500 dark:text-gray-400">组x次</p>
								</div>
							</div>
						{:else}
							<p class="text-gray-500 dark:text-gray-400">这个阶段没有指定训练动作。</p>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<!-- No plans available -->
		<div
			class="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md"
		>
			<svg
				class="w-16 h-16 text-gray-400 mb-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
				></path></svg
			>
			<p class="text-xl text-gray-500 dark:text-gray-400">暂无训练计划</p>
			<p class="text-gray-400 dark:text-gray-500 mt-2">
				您可以先创建一些示例训练计划来体验功能。
			</p>
			<div class="mt-4">
				<a
					href="/setup-demo"
					class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
					</svg>
					创建示例训练计划
				</a>
			</div>
		</div>
	{/if}
</div> 