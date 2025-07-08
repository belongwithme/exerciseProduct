<!-- 连续打卡中断通知组件 -->
<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { AlertTriangle, Heart, TrendingUp, Calendar, Zap } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

	// 组件属性
	export let streakDays: number = 0;
	export let lastWorkoutDate: string | null = null;
	export let showNotification: boolean = true;

	// 组件状态
	let notificationType: 'streak_broken' | 'at_risk' | 'good_streak' | 'long_streak' | null = null;
	let daysSinceLastWorkout = 0;
	let isVisible = false;

	/**
	 * 计算距离上次训练的天数
	 */
	function calculateDaysSinceLastWorkout(): number {
		if (!lastWorkoutDate) return 999; // 如果没有训练记录，返回一个大数
		
		const today = new Date();
		const lastDate = new Date(lastWorkoutDate);
		const diffTime = today.getTime() - lastDate.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		
		return diffDays;
	}

	/**
	 * 确定通知类型
	 */
	function determineNotificationType() {
		daysSinceLastWorkout = calculateDaysSinceLastWorkout();

		if (streakDays === 0 && daysSinceLastWorkout >= 2) {
			// 连续打卡已中断且超过2天没训练
			notificationType = 'streak_broken';
		} else if (streakDays > 0 && daysSinceLastWorkout === 1) {
			// 有连续记录但昨天没训练，连续性可能中断
			notificationType = 'at_risk';
		} else if (streakDays >= 1 && streakDays <= 6) {
			// 短期连续记录，鼓励继续
			notificationType = 'good_streak';
		} else if (streakDays >= 7) {
			// 长期连续记录，给予认可
			notificationType = 'long_streak';
		} else {
			notificationType = null;
		}

		// 只有在有意义的通知时才显示
		isVisible = showNotification && notificationType !== null;
	}

	/**
	 * 获取通知配置
	 */
	function getNotificationConfig() {
		switch (notificationType) {
			case 'streak_broken':
				return {
					type: 'warning',
					icon: AlertTriangle,
					title: '连续打卡已中断',
					message: `已经${daysSinceLastWorkout}天没有训练了，重新开始永远不晚！`,
					encouragement: [
						'每一次重新开始都是一个新的机会 💪',
						'小步前进胜过原地踏步 🚀',
						'今天就是重新开始的最佳时机！'
					],
					actionText: '开始训练',
					bgColor: 'bg-orange-50',
					borderColor: 'border-orange-200',
					textColor: 'text-orange-800',
					iconColor: 'text-orange-600'
				};

			case 'at_risk':
				return {
					type: 'alert',
					icon: Zap,
					title: '连续记录面临中断',
					message: `您已经连续训练${streakDays}天，昨天没有训练可能会中断连续记录！`,
					encouragement: [
						'坚持了这么久，不要轻易放弃 🔥',
						'今天训练一下，保持连续记录',
						'习惯的力量就是持续的小行动'
					],
					actionText: '继续打卡',
					bgColor: 'bg-yellow-50',
					borderColor: 'border-yellow-200',
					textColor: 'text-yellow-800',
					iconColor: 'text-yellow-600'
				};

			case 'good_streak':
				return {
					type: 'success',
					icon: TrendingUp,
					title: '连续训练进行中',
					message: `太棒了！您已经连续训练${streakDays}天，习惯正在养成中！`,
					encouragement: [
						'持续的努力正在带来改变 🌟',
						'每一天的坚持都值得赞赏',
						'继续保持这个美好的节奏！'
					],
					actionText: '查看进度',
					bgColor: 'bg-green-50',
					borderColor: 'border-green-200',
					textColor: 'text-green-800',
					iconColor: 'text-green-600'
				};

			case 'long_streak':
				return {
					type: 'celebration',
					icon: Heart,
					title: '连续训练成就',
					message: `令人佩服！您已经连续训练${streakDays}天，这是真正的毅力体现！`,
					encouragement: [
						'您的坚持令人敬佩！🎉',
						'这样的毅力一定会带来惊人的成果',
						'您已经证明了自己的决心和毅力'
					],
					actionText: '分享成就',
					bgColor: 'bg-purple-50',
					borderColor: 'border-purple-200',
					textColor: 'text-purple-800',
					iconColor: 'text-purple-600'
				};

			default:
				return null;
		}
	}

	/**
	 * 处理行动按钮点击
	 */
	function handleAction() {
		switch (notificationType) {
			case 'streak_broken':
			case 'at_risk':
				dispatch('startWorkout');
				break;
			case 'good_streak':
				dispatch('viewProgress');
				break;
			case 'long_streak':
				dispatch('shareAchievement', { streakDays });
				break;
		}
	}

	/**
	 * 关闭通知
	 */
	function handleClose() {
		isVisible = false;
		dispatch('close');
	}

	/**
	 * 获取随机鼓励语句
	 */
	function getRandomEncouragement(encouragements: string[]): string {
		const randomIndex = Math.floor(Math.random() * encouragements.length);
		return encouragements[randomIndex];
	}

	// 响应式更新
	$: {
		if (showNotification) {
			determineNotificationType();
		}
	}

	$: config = getNotificationConfig();
	$: randomEncouragement = config ? getRandomEncouragement(config.encouragement) : '';

	onMount(() => {
		determineNotificationType();
	});
</script>

{#if isVisible && config}
	<!-- 通知卡片 -->
	<div class="notification-card {config.bgColor} {config.borderColor} {config.textColor}" role="alert">
		<!-- 头部区域 -->
		<div class="notification-header">
			<div class="flex items-center">
				<svelte:component this={config.icon} class="notification-icon {config.iconColor}" />
				<h3 class="notification-title">{config.title}</h3>
			</div>
			<button 
				class="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
				on:click={handleClose}
				aria-label="关闭通知"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
		</div>

		<!-- 主要消息 -->
		<div class="notification-content">
			<p class="notification-message">{config.message}</p>
			
			<!-- 鼓励信息 -->
			<div class="encouragement-section">
				<div class="encouragement-text">
					{randomEncouragement}
				</div>
			</div>

			<!-- 统计信息 -->
			{#if notificationType === 'good_streak' || notificationType === 'long_streak'}
				<div class="stats-section">
					<div class="stat-item">
						<Calendar class="w-4 h-4 {config.iconColor}" />
						<span>连续 {streakDays} 天</span>
					</div>
					{#if daysSinceLastWorkout === 0}
						<div class="stat-item">
							<Zap class="w-4 h-4 text-green-600" />
							<span>今日已完成</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- 行动区域 -->
			<div class="action-section">
				<button 
					class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 {config.type}"
					on:click={handleAction}
				>
					{config.actionText}
				</button>
				
				{#if notificationType === 'streak_broken' || notificationType === 'at_risk'}
					<button 
						class="secondary-button"
						on:click={() => dispatch('setReminder')}
					>
						设置提醒
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.notification-card {
		@apply border rounded-lg p-6 mb-6 shadow-md;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.notification-header {
		@apply flex justify-between items-start mb-4;
	}

	.notification-icon {
		@apply w-6 h-6 mr-3 flex-shrink-0;
	}

	.notification-title {
		@apply text-lg font-semibold;
	}

	.close-button {
		/* @apply p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors; */
	}

	.notification-content {
		@apply space-y-4;
	}

	.notification-message {
		@apply text-base leading-relaxed;
	}

	.encouragement-section {
		@apply py-3 px-4 bg-white bg-opacity-50 rounded-lg;
	}

	.encouragement-text {
		@apply text-sm font-medium italic text-center;
	}

	.stats-section {
		@apply flex items-center space-x-4 text-sm;
	}

	.stat-item {
		@apply flex items-center space-x-1;
	}

	.action-section {
		@apply flex items-center space-x-3 pt-2;
	}

	.action-button {
		/* @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2; */
	}

	.action-button.warning {
		@apply bg-orange-600 text-white focus:ring-orange-500;
	}
	.action-button.warning:hover {
		@apply bg-orange-700;
	}

	.action-button.alert {
		@apply bg-yellow-600 text-white focus:ring-yellow-500;
	}
	.action-button.alert:hover {
		@apply bg-yellow-700;
	}

	.action-button.success {
		@apply bg-green-600 text-white focus:ring-green-500;
	}
	.action-button.success:hover {
		@apply bg-green-700;
	}

	.action-button.celebration {
		@apply bg-purple-600 text-white focus:ring-purple-500;
	}
	.action-button.celebration:hover {
		@apply bg-purple-700;
	}

	.secondary-button {
		@apply px-4 py-2 border border-current rounded-lg font-medium transition-colors;
	}
	.secondary-button:hover {
		@apply bg-black bg-opacity-5;
	}

	/* 移动端优化 */
	@media (max-width: 640px) {
		.notification-card {
			@apply p-4;
		}

		.notification-title {
			@apply text-base;
		}

		.action-section {
			@apply flex-col items-stretch space-y-2 space-x-0;
		}

		.action-button,
		.secondary-button {
			@apply w-full justify-center;
		}
	}
</style> 