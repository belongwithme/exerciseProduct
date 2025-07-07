<script lang="ts">
	const tools = [
		{
			title: '弹跳计算器',
			description: '根据身高和摸高计算你的垂直弹跳高度。',
			href: '/tools/jump-calculator'
		},
		{
			title: '训练计时器',
			description: '在训练组间精确计时，优化你的休息时间。',
			href: '/tools/timer'
		},
		{
			title: '导出训练计划',
			description: '将你的训练计划导出为PDF文件，方便打印或离线查看。',
			href: '/tools/share'
		}
	];
</script>

<div class="container mx-auto p-4 md:p-8">
	<h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">工具箱</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-8">这里提供一系列实用工具，辅助你的训练。</p>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each tools as tool}
			<a
				href={tool.href}
				class="block group bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
			>
				<h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{tool.title}</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
				<div class="flex justify-end items-center text-blue-600 dark:text-blue-400">
					<span>立即使用</span>
					<svg
						class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg
					>
				</div>
			</a>
		{/each}
	</div>
</div> 