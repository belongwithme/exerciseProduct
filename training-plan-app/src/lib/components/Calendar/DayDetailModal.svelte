<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X, Clock, Activity, Heart, MessageCircle } from 'lucide-svelte';

	// 类型定义
	type CalendarData = {
		date: string;
		log_count: number;
		status_summary?: string | null;
		mood_summary?: string | null;
		total_duration_minutes?: number;
	};

	type WorkoutLog = {
		id: string;
		date: string;
		duration_minutes?: number;
		status?: string;
		mood?: string;
		logged_sets?: Array<{
			exercise_name: string;
			set_number: number;
			reps: number;
			weight_kg?: number;
		}>;
	};

	// Props
	export let isOpen = false;
	export let selectedDate: string = '';
	export let calendarData: CalendarData | null = null;
	export let workoutLogs: WorkoutLog[] = [];

	// 事件派发器
	const dispatch = createEventDispatcher<{
		close: void;
		editLog: { logId: string };
		createLog: { date: string };
	}>();

	/**
	 * 关闭模态框
	 */
	function closeModal() {
		dispatch('close');
	}

	/**
	 * 格式化日期显示
	 */
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
		return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日 ${weekDays[date.getDay()]}`;
	}

	/**
	 * 格式化时长显示
	 */
	function formatDuration(minutes?: number): string {
		if (!minutes) return '未记录';
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
	}

	/**
	 * 获取状态对应的颜色和图标
	 */
	function getStatusStyle(status?: string) {
		switch (status) {
			case '状态良好':
			case '精力充沛':
				return { color: 'text-green-600', bg: 'bg-green-100', emoji: '🟢' };
			case '疲劳':
				return { color: 'text-yellow-600', bg: 'bg-yellow-100', emoji: '🟡' };
			case '低效率':
				return { color: 'text-red-600', bg: 'bg-red-100', emoji: '🔴' };
			case '一般':
				return { color: 'text-blue-600', bg: 'bg-blue-100', emoji: '🔵' };
			default:
				return { color: 'text-gray-600', bg: 'bg-gray-100', emoji: '⚪' };
		}
	}

	/**
	 * 创建新的训练日志
	 */
	function handleCreateLog() {
		dispatch('createLog', { date: selectedDate });
		closeModal();
	}

	/**
	 * 编辑现有训练日志
	 */
	function handleEditLog(logId: string) {
		dispatch('editLog', { logId });
		closeModal();
	}

	/**
	 * 点击背景关闭模态框
	 */
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	/**
	 * 按键处理
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	/**
	 * 按动作名称分组训练组数
	 */
	function groupSetsByExercise(sets: Array<{exercise_name: string; set_number: number; reps: number; weight_kg?: number}>) {
		return sets.reduce((acc: Record<string, Array<{exercise_name: string; set_number: number; reps: number; weight_kg?: number}>>, set) => {
			if (!acc[set.exercise_name]) {
				acc[set.exercise_name] = [];
			}
			acc[set.exercise_name].push(set);
			return acc;
		}, {});
	}
</script>

<!-- 模态框背景 -->
{#if isOpen}
	<div 
		class="modal-backdrop"
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- 模态框内容 -->
		<div class="modal-content">
			<!-- 头部 -->
			<div class="modal-header">
				<h2 id="modal-title" class="modal-title">
					<Activity class="w-6 h-6 mr-2 text-blue-600" />
					{formatDate(selectedDate)}
				</h2>
				<button 
					class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
					on:click={closeModal}
					aria-label="关闭"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- 内容区域 -->
			<div class="modal-body">
				{#if calendarData && calendarData.log_count > 0}
					<!-- 日期概览 -->
					<div class="day-summary">
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
							<div class="stat-item">
								<Activity class="w-5 h-5 text-blue-600" />
								<div>
									<div class="stat-value">{calendarData.log_count}</div>
									<div class="stat-label">训练次数</div>
								</div>
							</div>
							
							{#if calendarData.total_duration_minutes}
								<div class="stat-item">
									<Clock class="w-5 h-5 text-green-600" />
									<div>
										<div class="stat-value">
											{formatDuration(calendarData.total_duration_minutes)}
										</div>
										<div class="stat-label">总时长</div>
									</div>
								</div>
							{/if}
							
							{#if calendarData.status_summary}
								<div class="stat-item">
									<Heart class="w-5 h-5 text-purple-600" />
									<div>
										<div class="stat-value status-badge {getStatusStyle(calendarData.status_summary).bg}">
											<span class="status-emoji">
												{getStatusStyle(calendarData.status_summary).emoji}
											</span>
											{calendarData.status_summary}
										</div>
										<div class="stat-label">主要状态</div>
									</div>
								</div>
							{/if}
						</div>
						
						{#if calendarData.mood_summary}
							<div class="mood-summary">
								<MessageCircle class="w-4 h-4 text-orange-600" />
								<span class="mood-text">心情: {calendarData.mood_summary}</span>
							</div>
						{/if}
					</div>

					<!-- 训练日志列表 -->
					<div class="workout-logs-section">
						<h3 class="section-title">训练详情</h3>
						<div class="workout-logs-list">
							{#each workoutLogs as log}
								<div class="workout-log-item">
									<div class="log-header">
										<div class="log-time">
											{#if log.duration_minutes}
												<Clock class="w-4 h-4 text-gray-500" />
												<span>{formatDuration(log.duration_minutes)}</span>
											{/if}
										</div>
										<button 
											class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
											on:click={() => handleEditLog(log.id)}
										>
											编辑
										</button>
									</div>
									
									{#if log.status || log.mood}
										<div class="log-meta">
											{#if log.status}
												<span class="status-badge {getStatusStyle(log.status).bg} {getStatusStyle(log.status).color}">
													{getStatusStyle(log.status).emoji} {log.status}
												</span>
											{/if}
											{#if log.mood}
												<span class="mood-badge">
													💭 {log.mood}
												</span>
											{/if}
										</div>
									{/if}
									
									{#if log.logged_sets && log.logged_sets.length > 0}
										<div class="exercise-summary">
											<div class="exercise-count">
												共 {new Set(log.logged_sets.map(s => s.exercise_name)).size} 个动作，
												{log.logged_sets.length} 组
											</div>
											<div class="exercise-list">
												{#each Object.entries(groupSetsByExercise(log.logged_sets)) as [exerciseName, sets]}
													<div class="exercise-item">
														<span class="exercise-name">{exerciseName}</span>
														<span class="exercise-sets">
															{sets.length}组 × {sets[0]?.reps || '?'}次
															{#if sets[0]?.weight_kg}
																@ {sets[0].weight_kg}kg
															{/if}
														</span>
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<!-- 无训练记录 -->
					<div class="no-data">
						<div class="no-data-icon">📊</div>
						<h3 class="no-data-title">这一天还没有训练记录</h3>
						<p class="no-data-description">
							点击下方按钮开始记录今天的训练
						</p>
					</div>
				{/if}
			</div>

			<!-- 底部操作按钮 -->
			<div class="modal-footer">
				<button 
					class="create-log-button"
					on:click={handleCreateLog}
				>
					{calendarData?.log_count ? '添加新训练' : '开始记录训练'}
				</button>
				<button 
					class="cancel-button"
					on:click={closeModal}
				>
					关闭
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		@apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
	}

	.modal-content {
		@apply bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col;
	}

	.modal-header {
		@apply flex justify-between items-center p-6 border-b border-gray-200;
	}

	.modal-title {
		@apply text-xl font-bold text-gray-800 flex items-center;
	}

	.close-button {
		/* @apply p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700; */
	}

	.modal-body {
		@apply flex-1 overflow-y-auto p-6;
	}

	.day-summary {
		@apply mb-6 p-4 bg-gray-50 rounded-lg;
	}

	.summary-stats {
		/* @apply grid grid-cols-1 md:grid-cols-3 gap-4 mb-4; */
	}

	.stat-item {
		@apply flex items-center space-x-3;
	}

	.stat-value {
		@apply text-lg font-semibold text-gray-800;
	}

	.stat-label {
		@apply text-sm text-gray-600;
	}

	.status-badge {
		@apply inline-flex items-center px-2 py-1 rounded-full text-sm font-medium;
	}

	.status-emoji {
		@apply mr-1;
	}

	.mood-summary {
		@apply flex items-center space-x-2 pt-3 border-t border-gray-200;
	}

	.mood-text {
		@apply text-sm text-gray-700;
	}

	.workout-logs-section {
		@apply space-y-4;
	}

	.section-title {
		@apply text-lg font-semibold text-gray-800 mb-3;
	}

	.workout-logs-list {
		@apply space-y-3;
	}

	.workout-log-item {
		@apply border border-gray-200 rounded-lg p-4 space-y-3;
	}

	.log-header {
		@apply flex justify-between items-center;
	}

	.log-time {
		@apply flex items-center space-x-2 text-sm text-gray-600;
	}

	.edit-log-button {
		/* @apply px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm; */
	}

	.log-meta {
		@apply flex flex-wrap gap-2;
	}

	.mood-badge {
		@apply inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm;
	}

	.exercise-summary {
		@apply space-y-2;
	}

	.exercise-count {
		@apply text-sm text-gray-600 font-medium;
	}

	.exercise-list {
		@apply space-y-1;
	}

	.exercise-item {
		@apply flex justify-between items-center text-sm;
	}

	.exercise-name {
		@apply font-medium text-gray-800;
	}

	.exercise-sets {
		@apply text-gray-600;
	}

	.no-data {
		@apply text-center py-12;
	}

	.no-data-icon {
		@apply text-6xl mb-4;
	}

	.no-data-title {
		@apply text-lg font-semibold text-gray-800 mb-2;
	}

	.no-data-description {
		@apply text-gray-600 mb-6;
	}

	.modal-footer {
		@apply flex justify-end space-x-3 p-6 border-t border-gray-200;
	}

	.create-log-button {
		@apply px-4 py-2 bg-blue-600 text-white rounded-lg font-medium;
		transition: background-color 0.2s;
	}
	
	.create-log-button:hover {
		@apply bg-blue-700;
	}

	.cancel-button {
		@apply px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium;
		transition: background-color 0.2s;
	}
	
	.cancel-button:hover {
		@apply bg-gray-400;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.modal-content {
			@apply mx-2;
		}

		.summary-stats {
			@apply grid-cols-1;
		}

		.log-header {
			@apply flex-col space-y-2 items-start;
		}

		.exercise-item {
			@apply flex-col items-start space-y-1;
		}

		.modal-footer {
			@apply flex-col space-y-2 space-x-0;
		}
	}
</style> 