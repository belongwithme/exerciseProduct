<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: plans = data.plans;

	let showNotification = false;
	let notificationMessage = '';
	let shareableLink = '';

	async function generateShareLink(planId: number) {
		// 这是未来实现后端逻辑的地方
		// 1. 调用一个RPC函数，在 a `shared_plans` 表中创建一个记录，并返回一个唯一的 share_id (UUID)
		// 2. 构建链接
		
		// 目前，我们只模拟这个行为
		const shareId = crypto.randomUUID();
		shareableLink = `${window.location.origin}/plans/view/${shareId}`;

		notificationMessage = `分享链接已生成并复制到剪贴板!`;
		showNotification = true;
		await copyToClipboard(shareableLink);

		setTimeout(() => {
			showNotification = false;
		}, 3000);
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error('无法复制到剪贴板', err);
			notificationMessage = '复制失败，请手动复制。';
			showNotification = true;
		}
	}
</script>

<div class="container mx-auto p-4 md:p-8">
	<a href="/tools" class="text-blue-600 hover:underline mb-6 inline-block">&larr; 返回工具箱</a>
	<h1 class="text-3xl font-bold mb-2">分享训练计划</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-8">
		生成一个公开链接，将你的训练计划分享给朋友或教练。
	</p>

	{#if plans && plans.length > 0}
		<div class="space-y-4">
			{#each plans as plan}
				<div
					class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center"
				>
					<div>
						<h3 class="font-bold text-lg">{plan.name}</h3>
						<p class="text-sm text-gray-500">{plan.description || '暂无描述'}</p>
					</div>
					<button
						on:click={() => generateShareLink(plan.id)}
						class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
					>
						生成分享链接
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<p>你还没有任何训练计划可以分享。</p>
	{/if}

	{#if shareableLink}
		<div class="mt-8">
			<label for="share-link" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>生成的链接:</label
			>
			<div class="mt-1 flex rounded-md shadow-sm">
				<input
					id="share-link"
					type="text"
					readonly
					value={shareableLink}
					class="block w-full flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
				/>
				<button
					on:click={() => copyToClipboard(shareableLink)}
					class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-500"
				>
					复制
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- 浮动通知 -->
{#if showNotification}
	<div
		class="fixed bottom-5 right-5 bg-gray-900 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300"
	>
		{notificationMessage}
	</div>
{/if} 