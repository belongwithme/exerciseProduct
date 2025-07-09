<script lang="ts">
	import { onMount } from 'svelte';
	import CalendarView from '$lib/components/Calendar/CalendarView.svelte';
	import DayDetailModal from '$lib/components/Calendar/DayDetailModal.svelte';
	import StreakNotification from '$lib/components/Calendar/StreakNotification.svelte';
	import { generateMockCalendarData, generateMockWorkoutLogs } from '$lib/data/mockCalendarData';

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

	// 组件状态
	let calendarData: CalendarData[] = [];
	let workoutLogs: WorkoutLog[] = [];
	let currentYear = new Date().getFullYear();
	let currentMonth = new Date().getMonth() + 1;
	let isLoading = false;
	let error = '';
	
	// 模态框状态
	let isModalOpen = false;
	let selectedDate = '';
	let selectedDayData: CalendarData | null = null;
	let selectedDayLogs: WorkoutLog[] = [];
	
	// 连续训练状态
	let streakDays = 0;
	let showStreakNotification = false;

	/**
	 * 加载指定月份的日历数据
	 */
	async function loadCalendarData(year: number, month: number) {
		isLoading = true;
		error = '';
		
		try {
			// 使用模拟数据
			const mockData = generateMockCalendarData(year, month);
			calendarData = mockData;
			
			// 计算连续训练天数
			calculateStreakDays();
			
		} catch (err) {
			console.error('加载日历数据失败:', err);
			error = '加载日历数据失败，请稍后重试';
		} finally {
			isLoading = false;
		}
	}

	/**
	 * 加载指定日期的训练日志
	 */
	async function loadWorkoutLogs(date: string) {
		try {
			// 使用模拟数据
			const mockLogs = generateMockWorkoutLogs(date);
			return mockLogs;
		} catch (err) {
			console.error('加载训练日志失败:', err);
			return [];
		}
	}

	/**
	 * 计算连续训练天数
	 */
	function calculateStreakDays() {
		const today = new Date();
		let streak = 0;
		let checkDate = new Date(today);
		
		// 从今天开始往前检查
		while (true) {
			const dateStr = checkDate.toISOString().split('T')[0];
			const dayData = calendarData.find(d => d.date === dateStr);
			
			if (dayData && dayData.log_count > 0) {
				streak++;
				checkDate.setDate(checkDate.getDate() - 1);
			} else {
				break;
			}
		}
		
		streakDays = streak;
		
		// 如果连续训练超过3天，显示祝贺通知
		if (streak >= 3 && !showStreakNotification) {
			showStreakNotification = true;
			setTimeout(() => {
				showStreakNotification = false;
			}, 5000);
		}
	}

	/**
	 * 处理月份切换
	 */
	function handleMonthChange(event: CustomEvent<{ year: number; month: number }>) {
		const { year, month } = event.detail;
		currentYear = year;
		currentMonth = month;
		loadCalendarData(year, month);
	}

	/**
	 * 处理日期点击
	 */
	async function handleDayClick(event: CustomEvent<{ date: string; data?: CalendarData }>) {
		const { date, data } = event.detail;
		selectedDate = date;
		selectedDayData = data || null;
		
		// 加载该日期的训练日志
		selectedDayLogs = await loadWorkoutLogs(date);
		
		// 打开模态框
		isModalOpen = true;
	}

	/**
	 * 关闭模态框
	 */
	function handleModalClose() {
		isModalOpen = false;
		selectedDate = '';
		selectedDayData = null;
		selectedDayLogs = [];
	}

	/**
	 * 创建新的训练日志
	 */
	function handleCreateLog(event: CustomEvent<{ date: string }>) {
		const { date } = event.detail;
		console.log('创建新训练日志:', date);
		// TODO: 导航到训练记录页面
		// 这里可以使用 goto('/log?date=' + date) 或其他路由方法
		alert(`将导航到训练记录页面，日期: ${date}`);
	}

	/**
	 * 编辑现有训练日志
	 */
	function handleEditLog(event: CustomEvent<{ logId: string }>) {
		const { logId } = event.detail;
		console.log('编辑训练日志:', logId);
		// TODO: 导航到训练记录编辑页面
		alert(`将导航到训练记录编辑页面，ID: ${logId}`);
	}

	/**
	 * 关闭连续训练通知
	 */
	function handleStreakClose() {
		showStreakNotification = false;
	}

	// 组件挂载时加载数据
	onMount(() => {
		loadCalendarData(currentYear, currentMonth);
	});
</script>

<svelte:head>
	<title>训练日历 - 健身追踪应用</title>
	<meta name="description" content="查看您的训练日历，追踪训练进度和连续训练天数" />
</svelte:head>

<div class="calendar-page">
	<!-- 页面头部 -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">训练日历</h1>
			<p class="page-subtitle">
				追踪您的训练进度，养成健康的运动习惯
			</p>
		</div>
		
		{#if streakDays > 0}
			<div class="streak-badge">
				🔥 连续训练 {streakDays} 天
			</div>
		{/if}
	</div>

	<!-- 错误提示 -->
	{#if error}
		<div class="error-banner">
			<div class="error-content">
				<span class="error-icon">⚠️</span>
				<span class="error-message">{error}</span>
				<button 
					class="retry-btn"
					on:click={() => loadCalendarData(currentYear, currentMonth)}
				>
					重试
				</button>
			</div>
		</div>
	{/if}

	<!-- 加载状态 -->
	{#if isLoading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p class="loading-text">正在加载日历数据...</p>
		</div>
	{:else}
		<!-- 日历组件 -->
		<div class="calendar-wrapper">
			<CalendarView
				{calendarData}
				{currentYear}
				{currentMonth}
				on:dayClick={handleDayClick}
				on:monthChange={handleMonthChange}
			/>
		</div>
	{/if}

	<!-- 使用提示 -->
	<div class="tips-section">
		<h2 class="tips-title">使用提示</h2>
		<div class="tips-grid">
			<div class="tip-card">
				<div class="tip-icon">📅</div>
				<h3 class="tip-title">点击日期</h3>
				<p class="tip-description">点击任意日期查看详细的训练记录和状态</p>
			</div>
			<div class="tip-card">
				<div class="tip-icon">🎯</div>
				<h3 class="tip-title">训练强度</h3>
				<p class="tip-description">颜色深浅表示训练强度，越深表示训练越充实</p>
			</div>
			<div class="tip-card">
				<div class="tip-icon">🔥</div>
				<h3 class="tip-title">保持连续</h3>
				<p class="tip-description">坚持连续训练，培养健康的运动习惯</p>
			</div>
			<div class="tip-card">
				<div class="tip-icon">📊</div>
				<h3 class="tip-title">数据统计</h3>
				<p class="tip-description">查看月度训练统计，了解自己的运动表现</p>
			</div>
		</div>
	</div>
</div>

<!-- 日期详情模态框 -->
<DayDetailModal
	bind:isOpen={isModalOpen}
	{selectedDate}
	calendarData={selectedDayData}
	workoutLogs={selectedDayLogs}
	on:close={handleModalClose}
	on:createLog={handleCreateLog}
	on:editLog={handleEditLog}
/>

<!-- 连续训练通知 -->
{#if showStreakNotification}
	<StreakNotification
		{streakDays}
		on:close={handleStreakClose}
	/>
{/if}

<style>
	.calendar-page {
		min-height: 100vh;
		background: linear-gradient(to bottom right, #f9fafb, #eef2ff);
		padding: 2rem 0;
	}

	.page-header {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		margin-bottom: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.header-content {
		flex: 1;
	}

	.page-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: #111827;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.page-subtitle {
		font-size: 1.125rem;
		color: #4b5563;
		max-width: 32rem;
	}

	.streak-badge {
		background: linear-gradient(to right, #fb923c, #ef4444);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 9999px;
		font-weight: 700;
		font-size: 1.125rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		animation: pulse 2s infinite;
	}

	.error-banner {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		margin-bottom: 1.5rem;
	}

	.error-content {
		background-color: #fef2f2;
		border-left: 4px solid #f87171;
		padding: 1rem;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.error-icon {
		font-size: 1.25rem;
	}

	.error-message {
		flex: 1;
		color: #b91c1c;
		font-weight: 500;
	}

	.retry-btn {
		padding: 0.5rem 1rem;
		background-color: #dc2626;
		color: white;
		border-radius: 0.5rem;
		transition: background-color 0.2s;
		font-weight: 500;
		border: none;
		cursor: pointer;
	}

	.retry-btn:hover {
		background-color: #b91c1c;
	}

	.loading-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		text-align: center;
		padding-top: 3rem;
		padding-bottom: 3rem;
	}

	.loading-spinner {
		width: 3rem;
		height: 3rem;
		border: 4px solid #c7d2fe;
		border-top: 4px solid #4f46e5;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.loading-text {
		color: #4b5563;
		font-size: 1.125rem;
	}

	.calendar-wrapper {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		margin-bottom: 3rem;
	}

	.tips-section {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.tips-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #111827;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.tips-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}

	@media (min-width: 768px) {
		.tips-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.tips-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.tip-card {
		background-color: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.2s;
		border: 1px solid #f3f4f6;
		text-align: center;
	}

	.tip-card:hover {
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.tip-icon {
		font-size: 2.25rem;
		margin-bottom: 1rem;
	}

	.tip-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.tip-description {
		color: #4b5563;
		font-size: 0.875rem;
		line-height: 1.625;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.page-header {
			flex-direction: column;
			gap: 1rem;
		}

		.page-title {
			font-size: 1.5rem;
		}

		.page-subtitle {
			font-size: 1rem;
		}

		.streak-badge {
			font-size: 1rem;
			padding: 0.5rem 1rem;
		}

		.tips-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.calendar-page {
			padding: 1rem 0;
		}
	}

	@media (max-width: 480px) {
		.page-header,
		.error-banner,
		.loading-container,
		.calendar-wrapper,
		.tips-section {
			padding-left: 1rem;
			padding-right: 1rem;
		}
		
		.tip-card {
			padding: 1rem;
		}
	}
</style> 