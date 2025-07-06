<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let standingReach: number | null = null;
	let maxReach: number | null = null;
	let targetReach = 305; // 篮筐标准高度

	const verticalJump = tweened(0, { duration: 500, easing: cubicOut });
	const targetGap = tweened(0, { duration: 500, easing: cubicOut });

	let showAlert = false;

	function calculate() {
		if (standingReach && maxReach && standingReach < maxReach) {
			const jump = maxReach - standingReach;
			verticalJump.set(jump > 0 ? jump : 0);

			const gap = targetReach - maxReach;
			targetGap.set(gap > 0 ? gap : 0);

			showAlert = false;
		} else {
			showAlert = true;
		}
	}
</script>

<div class="container mx-auto p-4 md:p-8">
	<a href="/tools" class="text-blue-600 hover:underline mb-6 inline-block">&larr; 返回工具箱</a>
	<h1 class="text-3xl font-bold mb-2">弹跳计算器</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-8">计算你的垂直弹跳高度，看看距离扣篮还有多远。</p>

	<div class="grid md:grid-cols-2 gap-8">
		<!-- 输入卡片 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
			<h2 class="text-xl font-bold mb-4">输入数据</h2>
			<div class="space-y-4">
				{#if showAlert}
					<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
						<span class="block sm:inline">请输入有效的站立摸高和最大摸高，并确保最大摸高大于站立摸高。</span>
					</div>
				{/if}
				<div class="space-y-2">
					<label for="standing-reach" class="block text-sm font-medium text-gray-700 dark:text-gray-300">站立摸高 (cm)</label>
					<input
						id="standing-reach"
						type="number"
						placeholder="例如: 230"
						bind:value={standingReach}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					/>
					<p class="text-xs text-gray-500 dark:text-gray-400">单手向上伸直时指尖的高度。</p>
				</div>
				<div class="space-y-2">
					<label for="max-reach" class="block text-sm font-medium text-gray-700 dark:text-gray-300">最大摸高 (cm)</label>
					<input
						id="max-reach"
						type="number"
						placeholder="例如: 280"
						bind:value={maxReach}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					/>
					<p class="text-xs text-gray-500 dark:text-gray-400">跳起时能摸到的最高点。</p>
				</div>
				<div class="space-y-2">
					<label for="target-reach" class="block text-sm font-medium text-gray-700 dark:text-gray-300">目标摸高 (cm)</label>
					<input
						id="target-reach"
						type="number"
						bind:value={targetReach}
						class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					/>
					<p class="text-xs text-gray-500 dark:text-gray-400">默认是标准篮筐高度。</p>
				</div>
				<button on:click={calculate} class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
					计算
				</button>
			</div>
		</div>

		<!-- 结果卡片 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col">
			<h2 class="text-xl font-bold mb-4">计算结果</h2>
			<div class="flex-grow flex flex-col items-center justify-center space-y-8">
				<div class="text-center">
					<p class="text-lg text-gray-600 dark:text-gray-400">当前垂直弹跳</p>
					<p class="text-6xl font-bold text-blue-600 dark:text-blue-400">
						{Math.round($verticalJump)}<span class="text-2xl ml-2">cm</span>
					</p>
				</div>
				<div class="text-center">
					<p class="text-lg text-gray-600 dark:text-gray-400">距离目标</p>
					<p class="text-6xl font-bold text-orange-500">
						{Math.round($targetGap)}<span class="text-2xl ml-2">cm</span>
					</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        你需要再提升的高度才能达到 {targetReach}cm
                    </p>
				</div>
			</div>
		</div>
	</div>
</div> 