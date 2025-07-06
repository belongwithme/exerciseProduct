<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let time = 60; // 默认时间
	let remaining = time;
	let timer: NodeJS.Timeout | null = null;
	let audio: HTMLAudioElement | null;

	const presets = [30, 60, 90, 120, 180];

	onMount(() => {
		// 在 onMount 中创建 Audio 对象，以确保在浏览器环境中执行
		audio = new Audio('https://cdn.jsdelivr.net/gh/zenghongtu/resource/music/4721.mp3');
		return () => {
			if (timer) clearInterval(timer);
		};
	});

	function startTimer() {
		if (timer) clearInterval(timer);
		if (remaining <= 0) remaining = time;
		
		timer = setInterval(() => {
			remaining -= 1;
			if (remaining <= 0) {
				if (timer) clearInterval(timer);
				timer = null;
				playNotificationSound();
			}
		}, 1000);
	}

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function resetTimer() {
		stopTimer();
		remaining = time;
	}

	function setTime(newTime: number) {
		time = newTime;
		resetTimer();
	}

	function playNotificationSound() {
		if (audio) {
			audio.currentTime = 0;
			audio.play().catch(error => {
				console.error("音频播放失败:", error);
			});
		}
	}

	// 格式化时间显示
	$: minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
	$: seconds = (remaining % 60).toString().padStart(2, '0');
</script>

<div class="container mx-auto p-4 md:p-8">
	<a href="/tools" class="text-blue-600 hover:underline mb-6 inline-block">&larr; 返回工具箱</a>
	<h1 class="text-3xl font-bold mb-2">训练计时器</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-8">精确控制你的组间休息时间，提升训练效率。</p>

	<div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
		<!-- 时间显示 -->
		<div class="text-center mb-6">
			<p class="text-8xl font-mono font-bold text-gray-800 dark:text-white">
				{minutes}:{seconds}
			</p>
		</div>

		<!-- 控制按钮 -->
		<div class="flex justify-center space-x-4 mb-6">
			{#if !timer}
				<button on:click={startTimer} class="w-24 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full transition-transform transform hover:scale-105">
					开始
				</button>
			{:else}
				<button on:click={stopTimer} class="w-24 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full transition-transform transform hover:scale-105">
					暂停
				</button>
			{/if}
			<button on:click={resetTimer} class="w-24 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-full transition-transform transform hover:scale-105">
				重置
			</button>
		</div>

		<!-- 预设时间 -->
		<div class="text-center">
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">快速设置 (秒)</p>
			<div class="flex justify-center space-x-2">
				{#each presets as preset}
					<button
						on:click={() => setTime(preset)}
						class="w-12 h-12 rounded-full transition-colors {time === preset
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} hover:bg-blue-500 hover:text-white"
					>
						{preset}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div> 