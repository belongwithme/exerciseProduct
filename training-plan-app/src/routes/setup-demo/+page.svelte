<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	
	export let data: PageData;
	
	let isCreating = false;
	let message = '';
	let messageType: 'success' | 'error' | '' = '';
	
	/**
	 * 创建示例训练计划数据
	 */
	async function createDemoPlans() {
		if (isCreating) return;
		
		isCreating = true;
		message = '';
		messageType = '';
		
		try {
			const response = await fetch('/api/setup-demo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			
			const result = await response.json();
			
			if (response.ok) {
				message = '示例训练计划创建成功！';
				messageType = 'success';
				
				// 3秒后跳转到训练计划页面
				setTimeout(() => {
					goto('/plans');
				}, 3000);
			} else {
				message = result.error || '创建失败，请重试';
				messageType = 'error';
			}
		} catch (error) {
			console.error('创建示例数据失败:', error);
			message = '网络错误，请重试';
			messageType = 'error';
		} finally {
			isCreating = false;
		}
	}
</script>

<div class="container mx-auto p-4 md:p-8">
	<div class="max-w-2xl mx-auto">
		<h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
			设置演示数据
		</h1>
		
		<div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
			<div class="mb-4">
				<h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
					创建示例训练计划
				</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-4">
					点击下方按钮将为您创建三个示例训练计划：
				</p>
				<ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6">
					<li><strong>第一阶段：基础重建</strong> - 建立基础力量和稳定性</li>
					<li><strong>第二阶段：力量发展</strong> - 重点发展最大力量</li>
					<li><strong>第三阶段：爆发力提升</strong> - 将力量转化为爆发力</li>
				</ul>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
					每个阶段都包含了详细的训练动作、组数、次数和训练要点。
				</p>
			</div>
			
			{#if message}
				<div class="mb-4 p-3 rounded-lg {messageType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}">
					{message}
				</div>
			{/if}
			
			<div class="flex justify-center">
				<button
					on:click={createDemoPlans}
					disabled={isCreating}
					class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isCreating}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						创建中...
					{:else}
						创建示例训练计划
					{/if}
				</button>
			</div>
		</div>
		
		<div class="text-center">
			<a href="/plans" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
				← 返回训练计划页面
			</a>
		</div>
	</div>
</div> 