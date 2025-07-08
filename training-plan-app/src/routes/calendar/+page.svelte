<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/auth';
	import CalendarView from '$lib/components/Calendar/CalendarView.svelte';
	import DayDetailModal from '$lib/components/Calendar/DayDetailModal.svelte';
	import StreakNotification from '$lib/components/Calendar/StreakNotification.svelte';
	import { Calendar as CalendarIcon, TrendingUp, Flame } from 'lucide-svelte';

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
	let currentYear = new Date().getFullYear();
	let currentMonth = new Date().getMonth() + 1;
	let calendarData: CalendarData[] = [];
	let streakDays = 0;
	let isLoading = true;
	let errorMessage = '';

	// 模态框状态
	let showDayDetail = false;
	let selectedDate = '';
	let selectedDayData: CalendarData | null = null;
	let selectedDayLogs: WorkoutLog[] = [];

	// 连续打卡通知状态
	let lastWorkoutDate: string | null = null;
	let showStreakNotification = true;

	/**
	 * 加载日历数据
	 */
	async function loadCalendarData() {
		if (!$user) {
			goto('/auth');
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			// 并行获取日历数据、连续打卡天数和最后训练日期
			const [calendarResponse, streakResponse, lastWorkoutResponse] = await Promise.all([
				fetch(`/api/calendar-summary?year=${currentYear}&month=${currentMonth}`),
				fetch('/api/streak-days'),
				fetch('/api/last-workout')
			]);

			// 处理日历数据
			if (calendarResponse.ok) {
				const result = await calendarResponse.json();
				calendarData = result.data || [];
			} else {
				const error = await calendarResponse.json();
				console.error('获取日历数据失败:', error);
				errorMessage = error.error || '获取日历数据失败';
			}

			// 处理连续打卡天数
			if (streakResponse.ok) {
				const result = await streakResponse.json();
				streakDays = result.streak_days || 0;
			} else {
				console.error('获取连续打卡天数失败');
				// 连续天数获取失败不影响页面显示
				streakDays = 0;
			}

			// 处理最后训练日期
			if (lastWorkoutResponse.ok) {
				const result = await lastWorkoutResponse.json();
				lastWorkoutDate = result.last_workout_date;
			} else {
				console.error('获取最后训练日期失败');
				lastWorkoutDate = null;
			}

		} catch (error) {
			console.error('加载日历数据时发生错误:', error);
			errorMessage = '网络错误，请稍后重试';
		} finally {
			isLoading = false;
		}
	}

	/**
	 * 处理月份切换
	 */
	function handleMonthChange(event: CustomEvent<{ year: number; month: number }>) {
		currentYear = event.detail.year;
		currentMonth = event.detail.month;
		loadCalendarData();
	}

	/**
	 * 处理日期点击
	 */
	async function handleDayClick(event: CustomEvent<{ date: string; data?: CalendarData }>) {
		selectedDate = event.detail.date;
		selectedDayData = event.detail.data || null;
		
		// 获取当天的详细训练日志
		await loadDayLogs(selectedDate);
		
		showDayDetail = true;
	}

	/**
	 * 加载特定日期的训练日志
	 */
	async function loadDayLogs(date: string) {
		try {
			const response = await fetch(`/api/logs?date=${date}`);
			if (response.ok) {
				const logs = await response.json();
				selectedDayLogs = logs || [];
			} else {
				console.error('获取当日训练日志失败');
				selectedDayLogs = [];
			}
		} catch (error) {
			console.error('加载当日训练日志时发生错误:', error);
			selectedDayLogs = [];
		}
	}

	/**
	 * 关闭日期详情模态框
	 */
	function handleCloseModal() {
		showDayDetail = false;
		selectedDate = '';
		selectedDayData = null;
		selectedDayLogs = [];
	}

	/**
	 * 创建新训练日志
	 */
	function handleCreateLog(event: CustomEvent<{ date: string }>) {
		const date = event.detail.date;
		goto(`/log?date=${date}`);
	}

	/**
	 * 编辑训练日志
	 */
	function handleEditLog(event: CustomEvent<{ logId: string }>) {
		const logId = event.detail.logId;
		goto(`/log?edit=${logId}`);
	}

	/**
	 * 计算月度统计数据
	 */
	function getMonthlyStats() {
		const totalWorkouts = calendarData.reduce((sum, day) => sum + day.log_count, 0);
		const totalDuration = calendarData.reduce((sum, day) => sum + (day.total_duration_minutes || 0), 0);
		const activeDays = calendarData.filter(day => day.log_count > 0).length;
		
		return {
			totalWorkouts,
			totalDuration: Math.round(totalDuration / 60 * 10) / 10, // 转换为小时并保留一位小数
			activeDays,
			averagePerDay: activeDays > 0 ? Math.round(totalWorkouts / activeDays * 10) / 10 : 0
		};
	}

	/**
	 * 处理连续打卡通知事件
	 */
	function handleStreakNotificationStartWorkout() {
		// 跳转到训练记录页面
		goto('/log');
	}

	function handleStreakNotificationViewProgress() {
		// 跳转到进度页面
		goto('/progress');
	}

	function handleStreakNotificationShareAchievement(event: CustomEvent<{ streakDays: number }>) {
		// 可以实现分享功能，这里先显示一个提示
		alert(`您已经连续训练${event.detail.streakDays}天！太棒了！`);
	}

	function handleStreakNotificationSetReminder() {
		// 可以实现设置提醒功能，这里先显示一个提示
		alert('提醒功能即将推出，请手动设置手机提醒。');
	}

	function handleStreakNotificationClose() {
		showStreakNotification = false;
		// 可以在本地存储中记录用户关闭了通知，避免频繁显示
		localStorage.setItem('streak_notification_closed', Date.now().toString());
	}

	// 监听用户状态
	$: if ($user === null) {
		goto('/auth');
	}

	// 组件挂载时加载数据
	onMount(() => {
		if ($user) {
			loadCalendarData();
		}
	});

	// 计算月度统计
	$: monthlyStats = getMonthlyStats();
</script>

<!-- 页面头部 -->
<svelte:head>
	<title>训练日历 - 训练计划系统</title>
	<meta name="description" content="查看训练打卡日历，追踪训练习惯和进度" />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- 页面标题 -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
				<CalendarIcon class="w-8 h-8 mr-3 text-blue-600" />
				训练日历
			</h1>
			<p class="text-gray-600">追踪您的训练打卡记录，养成良好的训练习惯</p>
		</div>

		<!-- 连续打卡通知 -->
		<StreakNotification 
			{streakDays}
			{lastWorkoutDate}
			showNotification={showStreakNotification}
			on:startWorkout={handleStreakNotificationStartWorkout}
			on:viewProgress={handleStreakNotificationViewProgress}
			on:shareAchievement={handleStreakNotificationShareAchievement}
			on:setReminder={handleStreakNotificationSetReminder}
			on:close={handleStreakNotificationClose}
		/>

		<!-- 统计卡片 -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<!-- 连续打卡天数 -->
			<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">连续打卡</p>
						<p class="text-2xl font-bold text-orange-600">{streakDays}</p>
						<p class="text-xs text-gray-500">天</p>
					</div>
					<Flame class="w-8 h-8 text-orange-500" />
				</div>
			</div>

			<!-- 本月训练次数 -->
			<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">本月训练</p>
						<p class="text-2xl font-bold text-blue-600">{monthlyStats.totalWorkouts}</p>
						<p class="text-xs text-gray-500">次</p>
					</div>
					<TrendingUp class="w-8 h-8 text-blue-500" />
				</div>
			</div>

			<!-- 本月训练时长 -->
			<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">训练时长</p>
						<p class="text-2xl font-bold text-green-600">{monthlyStats.totalDuration}</p>
						<p class="text-xs text-gray-500">小时</p>
					</div>
					<CalendarIcon class="w-8 h-8 text-green-500" />
				</div>
			</div>

			<!-- 活跃天数 -->
			<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">活跃天数</p>
						<p class="text-2xl font-bold text-purple-600">{monthlyStats.activeDays}</p>
						<p class="text-xs text-gray-500">天</p>
					</div>
					<div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
						<span class="text-purple-600 font-bold">📅</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 错误消息 -->
		{#if errorMessage}
			<div class="mb-6">
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<div class="flex">
						<div class="text-red-400">⚠️</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">数据加载失败</h3>
							<p class="text-sm text-red-700 mt-1">{errorMessage}</p>
							<button 
								class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
								on:click={loadCalendarData}
							>
								重新加载
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- 日历组件 -->
		{#if isLoading}
			<div class="flex justify-center items-center py-20">
				<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
				<span class="ml-4 text-xl text-gray-600">正在加载日历数据...</span>
			</div>
		{:else}
			<CalendarView 
				{calendarData}
				{currentYear}
				{currentMonth}
				on:monthChange={handleMonthChange}
				on:dayClick={handleDayClick}
			/>
		{/if}

		<!-- 使用说明 -->
		<div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-blue-800 mb-3">📖 使用说明</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
				<div>
					<p class="mb-2"><strong>颜色说明：</strong></p>
					<ul class="space-y-1">
						<li>• 绿色深浅代表训练强度</li>
						<li>• 圆点表示状态（🟢良好 🟡疲劳 🔴低效）</li>
						<li>• 小点数量表示训练次数</li>
					</ul>
				</div>
				<div>
					<p class="mb-2"><strong>操作说明：</strong></p>
					<ul class="space-y-1">
						<li>• 点击日期查看详细记录</li>
						<li>• 点击"今天"快速回到当前月</li>
						<li>• 连续训练可获得打卡天数</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 返回首页按钮 -->
		<div class="mt-8 text-center">
			<button
				class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
				on:click={() => goto('/')}
			>
				← 返回首页
			</button>
		</div>
	</div>
</div>

<!-- 日期详情模态框 -->
<DayDetailModal
	isOpen={showDayDetail}
	{selectedDate}
	calendarData={selectedDayData}
	workoutLogs={selectedDayLogs}
	on:close={handleCloseModal}
	on:createLog={handleCreateLog}
	on:editLog={handleEditLog}
/> 