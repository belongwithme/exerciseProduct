<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X, Clock, Activity, Heart, MessageCircle, Plus, Edit3, Calendar } from 'lucide-svelte';

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
		const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
		return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate().toString().padStart(2, '0')}日 ${weekDays[date.getDay()]}`;
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
	 * 获取状态对应的样式
	 */
	function getStatusStyle(status?: string) {
		switch (status) {
			case '状态良好':
				return { 
					color: 'text-green-700', 
					bg: 'bg-green-100', 
					border: 'border-green-300',
					emoji: '🟢' 
				};
			case '精力充沛':
				return { 
					color: 'text-amber-700', 
					bg: 'bg-amber-100', 
					border: 'border-amber-300',
					emoji: '⚡' 
				};
			case '疲劳':
				return { 
					color: 'text-yellow-700', 
					bg: 'bg-yellow-100', 
					border: 'border-yellow-300',
					emoji: '🟡' 
				};
			case '低效率':
				return { 
					color: 'text-red-700', 
					bg: 'bg-red-100', 
					border: 'border-red-300',
					emoji: '🔴' 
				};
			case '一般':
				return { 
					color: 'text-blue-700', 
					bg: 'bg-blue-100', 
					border: 'border-blue-300',
					emoji: '🔵' 
				};
			default:
				return { 
					color: 'text-gray-700', 
					bg: 'bg-gray-100', 
					border: 'border-gray-300',
					emoji: '⚪' 
				};
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

	/**
	 * 计算动作的总重量
	 */
	function getTotalVolume(sets: Array<{reps: number; weight_kg?: number}>): number {
		return sets.reduce((total, set) => {
			return total + (set.reps * (set.weight_kg || 0));
		}, 0);
	}

	/**
	 * 获取今天是否为过去、今天还是未来
	 */
	function getDateStatus(dateString: string): 'past' | 'today' | 'future' {
		const date = new Date(dateString);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		date.setHours(0, 0, 0, 0);
		
		if (date < today) return 'past';
		if (date > today) return 'future';
		return 'today';
	}

	$: dateStatus = getDateStatus(selectedDate);
	$: hasWorkouts = calendarData && calendarData.log_count > 0;
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
				<div class="header-info">
					<div class="date-info">
						<Calendar class="w-6 h-6 text-indigo-600" />
						<div>
							<h2 id="modal-title" class="modal-title">
								{formatDate(selectedDate)}
							</h2>
							<p class="date-subtitle">
								{#if dateStatus === 'today'}
									今天
								{:else if dateStatus === 'future'}
									未来日期
								{:else}
									{Math.floor((new Date().getTime() - new Date(selectedDate).getTime()) / (1000 * 60 * 60 * 24))}天前
								{/if}
							</p>
						</div>
					</div>
				</div>
				<button 
					class="close-btn"
					on:click={closeModal}
					aria-label="关闭"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- 内容区域 -->
			<div class="modal-body">
				{#if hasWorkouts}
					<!-- 日期概览卡片 -->
					<div class="overview-card">
						<h3 class="section-title">
							<Activity class="w-5 h-5 text-indigo-600" />
							训练概览
						</h3>
						
						<div class="stats-grid">
							<div class="stat-card">
								<div class="stat-icon bg-blue-100">
									<Activity class="w-5 h-5 text-blue-600" />
								</div>
								<div class="stat-content">
									<div class="stat-value">{calendarData?.log_count || 0}</div>
									<div class="stat-label">训练次数</div>
								</div>
							</div>
							
							{#if calendarData?.total_duration_minutes}
								<div class="stat-card">
									<div class="stat-icon bg-green-100">
										<Clock class="w-5 h-5 text-green-600" />
									</div>
									<div class="stat-content">
										<div class="stat-value">
											{formatDuration(calendarData.total_duration_minutes)}
										</div>
										<div class="stat-label">总时长</div>
									</div>
								</div>
							{/if}
							
							{#if calendarData?.status_summary}
								<div class="stat-card">
									<div class="stat-icon bg-purple-100">
										<Heart class="w-5 h-5 text-purple-600" />
									</div>
									<div class="stat-content">
										<div class="status-badge {getStatusStyle(calendarData.status_summary).bg} {getStatusStyle(calendarData.status_summary).border}">
											<span class="status-emoji">
												{getStatusStyle(calendarData.status_summary).emoji}
											</span>
											<span class="{getStatusStyle(calendarData.status_summary).color}">
												{calendarData.status_summary}
											</span>
										</div>
										<div class="stat-label">主要状态</div>
									</div>
								</div>
							{/if}
						</div>
						
						{#if calendarData?.mood_summary}
							<div class="mood-section">
								<MessageCircle class="w-4 h-4 text-orange-600" />
								<span class="mood-text">心情: {calendarData.mood_summary}</span>
							</div>
						{/if}
					</div>

					<!-- 训练日志列表 -->
					<div class="workouts-section">
						<h3 class="section-title">
							<Edit3 class="w-5 h-5 text-green-600" />
							训练详情
						</h3>
						
						<div class="workouts-list">
							{#each workoutLogs as log, index}
								<div class="workout-card">
									<div class="workout-header">
										<div class="workout-info">
											<span class="workout-number">训练 #{index + 1}</span>
											{#if log.duration_minutes}
												<div class="duration-chip">
													<Clock class="w-3 h-3" />
													<span>{formatDuration(log.duration_minutes)}</span>
												</div>
											{/if}
										</div>
										<button 
											class="edit-btn"
											on:click={() => handleEditLog(log.id)}
										>
											<Edit3 class="w-4 h-4" />
											编辑
										</button>
									</div>
									
									{#if log.status || log.mood}
										<div class="workout-meta">
											{#if log.status}
												<span class="status-chip {getStatusStyle(log.status).bg} {getStatusStyle(log.status).border}">
													<span class="{getStatusStyle(log.status).color}">
														{getStatusStyle(log.status).emoji} {log.status}
													</span>
												</span>
											{/if}
											{#if log.mood}
												<span class="mood-chip">
													💭 {log.mood}
												</span>
											{/if}
										</div>
									{/if}
									
									{#if log.logged_sets && log.logged_sets.length > 0}
										{@const groupedSets = groupSetsByExercise(log.logged_sets)}
										<div class="exercises-summary">
											<div class="exercises-header">
												<span class="exercises-count">
													{Object.keys(groupedSets).length} 个动作
												</span>
												<span class="sets-count">
													{log.logged_sets.length} 组
												</span>
											</div>
											
											<div class="exercises-list">
												{#each Object.entries(groupedSets) as [exerciseName, sets]}
													{@const totalVolume = getTotalVolume(sets)}
													<div class="exercise-item">
														<div class="exercise-header">
															<span class="exercise-name">{exerciseName}</span>
															<span class="exercise-stats">
																{sets.length}组
																{#if totalVolume > 0}
																	· {totalVolume}kg
																{/if}
															</span>
														</div>
														<div class="sets-preview">
															{#each sets.slice(0, 3) as set}
																<span class="set-chip">
																	{set.reps}×{set.weight_kg || 0}kg
																</span>
															{/each}
															{#if sets.length > 3}
																<span class="more-sets">+{sets.length - 3}</span>
															{/if}
														</div>
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
					<!-- 无训练记录状态 -->
					<div class="empty-state">
						<div class="empty-icon">
							<Activity class="w-12 h-12 text-gray-400" />
						</div>
						<h3 class="empty-title">这一天还没有训练记录</h3>
						<p class="empty-description">
							{#if dateStatus === 'future'}
								这是未来的日期，快来制定训练计划吧！
							{:else if dateStatus === 'today'}
								今天还没有训练，现在开始还不晚！
							{:else}
								这一天没有训练记录，创建一个回忆吧
							{/if}
						</p>
					</div>
				{/if}
			</div>

			<!-- 底部操作区 -->
			<div class="modal-footer">
				{#if hasWorkouts}
					<button 
						class="secondary-btn"
						on:click={closeModal}
					>
						关闭
					</button>
					<button 
						class="primary-btn"
						on:click={handleCreateLog}
					>
						<Plus class="w-4 h-4" />
						添加训练
					</button>
				{:else}
					<button 
						class="secondary-btn"
						on:click={closeModal}
					>
						关闭
					</button>
					<button 
						class="primary-btn"
						on:click={handleCreateLog}
						disabled={dateStatus === 'future'}
					>
						<Plus class="w-4 h-4" />
						{#if dateStatus === 'future'}
							暂不可用
						{:else if dateStatus === 'today'}
							开始训练
						{:else}
							添加记录
						{/if}
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 50;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-content {
		background-color: white;
		border-radius: 1rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		width: 100%;
		max-width: 42rem;
		max-height: 90vh;
		overflow: hidden;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.modal-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 1.5rem;
		background: linear-gradient(to right, #eef2ff, #faf5ff);
		border-bottom: 1px solid #f3f4f6;
	}

	.header-info {
		flex: 1;
	}

	.date-info {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: #111827;
		margin-bottom: 0.25rem;
	}

	.date-subtitle {
		font-size: 0.875rem;
		color: #4b5563;
	}

	.close-btn {
		padding: 0.5rem;
		border-radius: 0.5rem;
		transition: background-color 0.2s;
		color: #6b7280;
		background: none;
		border: none;
		cursor: pointer;
	}

	.close-btn:hover {
		background-color: rgba(255, 255, 255, 0.5);
		color: #374151;
	}

	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
		max-height: calc(90vh - 200px);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.overview-card {
		background: linear-gradient(to bottom right, #eef2ff, white);
		border: 1px solid #e0e7ff;
		border-radius: 0.75rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.stat-card {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border: 1px solid #f3f4f6;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.stat-icon {
		padding: 0.5rem;
		border-radius: 0.5rem;
	}

	.stat-content {
		flex: 1;
	}

	.stat-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: #111827;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #4b5563;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 500;
		border: 1px solid;
	}

	.status-emoji {
		font-size: 0.75rem;
	}

	.mood-section {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid #e0e7ff;
	}

	.mood-text {
		font-size: 0.875rem;
		color: #374151;
		font-weight: 500;
	}

	.workouts-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.workouts-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.workout-card {
		background-color: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		padding: 1.25rem;
		transition: box-shadow 0.2s;
	}

	.workout-card:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.workout-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.workout-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.workout-number {
		font-size: 0.875rem;
		font-weight: 600;
		color: #4f46e5;
		background-color: #e0e7ff;
		padding: 0.25rem 0.5rem;
		border-radius: 0.5rem;
	}

	.duration-chip {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: #4b5563;
		background-color: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
	}

	.edit-btn {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.375rem 0.75rem;
		background-color: #2563eb;
		color: white;
		border-radius: 0.5rem;
		transition: background-color 0.2s;
		font-size: 0.875rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
	}

	.edit-btn:hover {
		background-color: #1d4ed8;
	}

	.workout-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.status-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		border: 1px solid;
	}

	.mood-chip {
		font-size: 0.75rem;
		background-color: #fed7aa;
		color: #c2410c;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
		font-weight: 500;
	}

	.exercises-summary {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.exercises-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.875rem;
		color: #4b5563;
	}

	.exercises-count, .sets-count {
		font-weight: 500;
	}

	.exercises-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.exercise-item {
		background-color: #f9fafb;
		border-radius: 0.5rem;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.exercise-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.exercise-name {
		font-weight: 500;
		color: #111827;
	}

	.exercise-stats {
		font-size: 0.875rem;
		color: #4b5563;
	}

	.sets-preview {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.set-chip {
		font-size: 0.75rem;
		background-color: white;
		color: #374151;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid #e5e7eb;
	}

	.more-sets {
		font-size: 0.75rem;
		color: #6b7280;
		font-weight: 500;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.empty-icon {
		margin: 0 auto 1rem;
	}

	.empty-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #111827;
	}

	.empty-description {
		color: #4b5563;
		max-width: 24rem;
		margin: 0 auto;
	}

	.modal-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		padding: 1.5rem;
		background-color: #f9fafb;
		border-top: 1px solid #f3f4f6;
	}

	.primary-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: linear-gradient(to right, #4f46e5, #7c3aed);
		color: white;
		border-radius: 0.5rem;
		transition: all 0.2s;
		font-weight: 500;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: none;
		cursor: pointer;
	}

	.primary-btn:hover {
		background: linear-gradient(to right, #4338ca, #6d28d9);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.primary-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.secondary-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #d1d5db;
		color: #374151;
		border-radius: 0.5rem;
		transition: background-color 0.2s;
		font-weight: 500;
		background: white;
		cursor: pointer;
	}

	.secondary-btn:hover {
		background-color: #f9fafb;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.modal-content {
			max-width: 100%;
			margin: 0.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.workout-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.workout-info {
			width: 100%;
		}

		.edit-btn {
			width: 100%;
			justify-content: center;
		}

		.modal-footer {
			flex-direction: column;
			gap: 0.5rem;
		}

		.primary-btn, .secondary-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style> 