<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import { fly, scale } from 'svelte/transition';
	import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-svelte';

	function getIcon(type: string) {
		switch (type) {
			case 'success':
				return CheckCircle;
			case 'error':
				return XCircle;
			case 'warning':
				return AlertTriangle;
			case 'info':
				return Info;
			default:
				return Info;
		}
	}

	function getColorClasses(type: string) {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
			case 'info':
				return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
			default:
				return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300';
		}
	}

	function getIconColor(type: string) {
		switch (type) {
			case 'success':
				return 'text-green-500';
			case 'error':
				return 'text-red-500';
			case 'warning':
				return 'text-yellow-500';
			case 'info':
				return 'text-blue-500';
			default:
				return 'text-gray-500';
		}
	}
</script>

<!-- 通知容器 - 固定在页面右上角 -->
<div class="fixed top-4 right-4 z-50 space-y-2 w-80 max-w-sm">
	{#each $notifications as notification (notification.id)}
		<div
			in:fly={{ x: 300, duration: 300 }}
			out:fly={{ x: 300, duration: 200 }}
			class="border rounded-lg p-4 shadow-lg backdrop-blur-sm {getColorClasses(notification.type)}"
		>
			<div class="flex items-start gap-3">
				<!-- 图标 -->
				<div class="flex-shrink-0 mt-0.5">
					<svelte:component 
						this={getIcon(notification.type)} 
						class="w-5 h-5 {getIconColor(notification.type)}" 
					/>
				</div>

				<!-- 内容 -->
				<div class="flex-1 min-w-0">
					<h4 class="text-sm font-semibold">
						{notification.title}
					</h4>
					{#if notification.message}
						<p class="text-sm mt-1 opacity-90">
							{notification.message}
						</p>
					{/if}
				</div>

				<!-- 关闭按钮 -->
				<button
					on:click={() => notifications.removeNotification(notification.id)}
					class="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
					title="关闭"
				>
					<X class="w-4 h-4" />
				</button>
			</div>
		</div>
	{/each}
</div> 