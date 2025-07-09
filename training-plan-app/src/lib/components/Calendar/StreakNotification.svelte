<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { X, Flame, Trophy, Target, Star, Heart, Zap } from 'lucide-svelte';

	export let streakDays: number = 0;

	const dispatch = createEventDispatcher<{
		close: void;
	}>();

	let isVisible = false;

	// 获取激励消息
	function getMotivationMessage(): { title: string; message: string; emoji: string; gradient: string } {
		if (streakDays >= 30) {
			return {
				title: `超级成就：连续训练 ${streakDays} 天！`,
				message: '你已经成为真正的健身达人！这种坚持不懈的精神令人敬佩。',
				emoji: '🏆',
				gradient: 'from-yellow-400 via-orange-400 to-red-500'
			};
		} else if (streakDays >= 14) {
			return {
				title: `两周连胜：${streakDays} 天连续训练`,
				message: '坚持不懈的精神正在转化为健康的生活习惯，继续保持！',
				emoji: '💎',
				gradient: 'from-purple-400 via-pink-400 to-red-400'
			};
		} else if (streakDays >= 7) {
			return {
				title: `一周冠军：${streakDays} 天连续打卡`,
				message: '恭喜你完成了一周的连续训练！这是培养习惯的重要里程碑。',
				emoji: '🔥',
				gradient: 'from-red-400 via-pink-400 to-purple-500'
			};
		} else if (streakDays >= 3) {
			return {
				title: `连续之星：${streakDays} 天坚持训练`,
				message: '很棒的开始！坚持下去，你正在养成优秀的健身习惯。',
				emoji: '⭐',
				gradient: 'from-blue-400 via-indigo-400 to-purple-500'
			};
		}
		
		return {
			title: `连续训练 ${streakDays} 天`,
			message: '每一天的坚持都是向目标迈进的一步，继续加油！',
			emoji: '🎯',
			gradient: 'from-green-400 via-blue-400 to-indigo-500'
		};
	}

	// 获取下一个目标
	function getNextGoal(): { target: number; description: string } {
		if (streakDays < 3) return { target: 3, description: '连续 3 天' };
		if (streakDays < 7) return { target: 7, description: '连续 1 周' };
		if (streakDays < 14) return { target: 14, description: '连续 2 周' };
		if (streakDays < 30) return { target: 30, description: '连续 1 个月' };
		return { target: 60, description: '连续 2 个月' };
	}

	// 计算进度百分比
	function getProgressPercentage(): number {
		const goal = getNextGoal();
		return Math.min((streakDays / goal.target) * 100, 100);
	}

	// 获取成就徽章
	function getAchievementLevel(): string {
		if (streakDays >= 30) return 'legendary';
		if (streakDays >= 14) return 'expert';
		if (streakDays >= 7) return 'advanced';
		if (streakDays >= 3) return 'intermediate';
		return 'beginner';
	}

	function closeNotification() {
		isVisible = false;
		setTimeout(() => {
			dispatch('close');
		}, 300);
	}

	// 点击背景关闭
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeNotification();
		}
	}

	// 按键处理
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeNotification();
		}
	}

	// 自动关闭通知
	onMount(() => {
		isVisible = true;
		
		// 6秒后自动关闭
		const timer = setTimeout(() => {
			if (isVisible) {
				closeNotification();
			}
		}, 6000);

		return () => clearTimeout(timer);
	});

	$: motivationData = getMotivationMessage();
	$: nextGoal = getNextGoal();
	$: progressPercentage = getProgressPercentage();
	$: achievementLevel = getAchievementLevel();
</script>

<!-- 通知背景 -->
{#if isVisible}
	<div 
		class="notification-backdrop"
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="notification-title"
		tabindex="0"
	>
		<!-- 通知卡片 -->
		<div class="notification-card achievement-{achievementLevel}">
			<!-- 关闭按钮 -->
			<button 
				class="close-btn"
				on:click={closeNotification}
				aria-label="关闭通知"
			>
				<X class="w-5 h-5" />
			</button>

			<!-- 成就图标 -->
			<div class="achievement-icon">
				<div class="icon-background bg-gradient-to-br {motivationData.gradient}">
					<span class="achievement-emoji">{motivationData.emoji}</span>
				</div>
				<div class="streak-ring">
					<Flame class="w-6 h-6 text-orange-500" />
				</div>
			</div>

			<!-- 内容区域 -->
			<div class="content-area">
				<h2 id="notification-title" class="achievement-title">
					{motivationData.title}
				</h2>
				<p class="achievement-message">
					{motivationData.message}
				</p>

				<!-- 进度条 -->
				<div class="progress-section">
					<div class="progress-info">
						<span class="progress-label">下一个目标: {nextGoal.description}</span>
						<span class="progress-value">{streakDays}/{nextGoal.target}</span>
					</div>
					<div class="progress-bar">
						<div 
							class="progress-fill bg-gradient-to-r {motivationData.gradient}"
							style="width: {progressPercentage}%"
						></div>
					</div>
				</div>

				<!-- 统计信息 -->
				<div class="stats-grid">
					<div class="stat-item">
						<div class="stat-icon">
							<Flame class="w-4 h-4 text-orange-500" />
						</div>
						<div class="stat-content">
							<div class="stat-value">{streakDays}</div>
							<div class="stat-label">连续天数</div>
						</div>
					</div>
					
					<div class="stat-item">
						<div class="stat-icon">
							<Target class="w-4 h-4 text-blue-500" />
						</div>
						<div class="stat-content">
							<div class="stat-value">{nextGoal.target - streakDays}</div>
							<div class="stat-label">距离目标</div>
						</div>
					</div>
					
					<div class="stat-item">
						<div class="stat-icon">
							<Heart class="w-4 h-4 text-red-500" />
						</div>
						<div class="stat-content">
							<div class="stat-value">{Math.round(progressPercentage)}%</div>
							<div class="stat-label">完成度</div>
						</div>
					</div>
				</div>

				<!-- 鼓励语句 -->
				<div class="encouragement-section">
					<div class="encouragement-quote">
						"坚持不懈，直到成功！"
					</div>
					<div class="encouragement-subtext">
						你的每一天坚持都在创造更好的自己
					</div>
				</div>
			</div>

			<!-- 装饰元素 -->
			<div class="decoration-elements">
				<div class="decoration-particle particle-1">✨</div>
				<div class="decoration-particle particle-2">🌟</div>
				<div class="decoration-particle particle-3">💫</div>
				<div class="decoration-particle particle-4">⭐</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.notification-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 50;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.notification-card {
		position: relative;
		background-color: white;
		border-radius: 1rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		width: 100%;
		max-width: 28rem;
		padding: 1.5rem;
		overflow: hidden;
		animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-30px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		padding: 0.5rem;
		border-radius: 9999px;
		transition: background-color 0.2s;
		color: #9ca3af;
		z-index: 10;
		background: none;
		border: none;
		cursor: pointer;
	}

	.close-btn:hover {
		background-color: #f3f4f6;
		color: #4b5563;
	}

	.achievement-icon {
		position: relative;
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.icon-background {
		width: 5rem;
		height: 5rem;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		position: relative;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	.achievement-emoji {
		font-size: 2.25rem;
		line-height: 1;
	}

	.streak-ring {
		position: absolute;
		bottom: -0.25rem;
		right: -0.25rem;
		width: 2rem;
		height: 2rem;
		background-color: white;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.content-area {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.achievement-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #111827;
		line-height: 1.25;
	}

	.achievement-message {
		color: #4b5563;
		line-height: 1.625;
	}

	.progress-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
	}

	.progress-label {
		color: #4b5563;
		font-weight: 500;
	}

	.progress-value {
		color: #1f2937;
		font-weight: 700;
	}

	.progress-bar {
		width: 100%;
		height: 0.5rem;
		background-color: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		transition: all 1s ease-out;
		border-radius: 9999px;
		animation: fillProgress 1.5s ease-out;
	}

	@keyframes fillProgress {
		from { width: 0%; }
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.stat-item {
		background-color: #f9fafb;
		border-radius: 0.5rem;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-icon {
		padding: 0.5rem;
		background-color: white;
		border-radius: 9999px;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.stat-content {
		text-align: center;
	}

	.stat-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: #111827;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #4b5563;
	}

	.encouragement-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.encouragement-quote {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		font-style: italic;
	}

	.encouragement-subtext {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.decoration-elements {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.decoration-particle {
		position: absolute;
		font-size: 1.5rem;
		opacity: 0.7;
		animation: float 3s ease-in-out infinite;
	}

	.particle-1 {
		top: 10%;
		left: 10%;
		animation-delay: 0s;
	}

	.particle-2 {
		top: 20%;
		right: 15%;
		animation-delay: 0.5s;
	}

	.particle-3 {
		bottom: 25%;
		left: 15%;
		animation-delay: 1s;
	}

	.particle-4 {
		bottom: 15%;
		right: 10%;
		animation-delay: 1.5s;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0px) rotate(0deg);
			opacity: 0.7;
		}
		50% {
			transform: translateY(-10px) rotate(10deg);
			opacity: 1;
		}
	}

	/* 成就等级样式 */
	.achievement-legendary {
		border: 4px solid #fcd34d;
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%);
	}

	.achievement-expert {
		border: 4px solid #c4b5fd;
		background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #8b5cf6 100%);
	}

	.achievement-advanced {
		border: 4px solid #fca5a5;
		background: linear-gradient(135deg, #fee2e2 0%, #fecaca 50%, #ef4444 100%);
	}

	.achievement-intermediate {
		border: 4px solid #93c5fd;
		background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #3b82f6 100%);
	}

	.achievement-beginner {
		border: 4px solid #86efac;
		background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #10b981 100%);
	}

	/* 响应式设计 */
	@media (max-width: 480px) {
		.notification-card {
			margin: 0 0.5rem;
			padding: 1rem;
		}

		.achievement-title {
			font-size: 1.25rem;
		}

		.achievement-emoji {
			font-size: 1.875rem;
		}

		.icon-background {
			width: 4rem;
			height: 4rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.stat-item {
			flex-direction: row;
			gap: 0.75rem;
			justify-content: flex-start;
			padding: 0.5rem;
		}
	}

	/* 可访问性 */
	@media (prefers-reduced-motion: reduce) {
		.notification-card {
			animation: none;
		}

		.icon-background {
			animation: none;
		}

		.progress-fill {
			animation: none;
		}

		.decoration-particle {
			animation: none;
		}
	}
</style> 