<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Activity, Clock } from 'lucide-svelte';

	// 类型定义
	type CalendarData = {
		date: string;
		log_count: number;
		status_summary?: string | null;
		mood_summary?: string | null;
		total_duration_minutes?: number;
	};

	type CalendarDay = {
		date: number;
		fullDate: string;
		isCurrentMonth: boolean;
		isToday: boolean;
		data?: CalendarData;
	};

	// Props
	export let calendarData: CalendarData[] = [];
	export let currentYear: number = new Date().getFullYear();
	export let currentMonth: number = new Date().getMonth() + 1; // 1-12

	// 事件派发器
	const dispatch = createEventDispatcher<{
		dayClick: { date: string; data?: CalendarData };
		monthChange: { year: number; month: number };
	}>();

	// 组件状态
	let calendarDays: CalendarDay[] = [];
	let monthName = '';
	let isLoading = false;

	// 月份名称映射
	const monthNames = [
		'一月', '二月', '三月', '四月', '五月', '六月',
		'七月', '八月', '九月', '十月', '十一月', '十二月'
	];

	// 星期名称
	const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

	/**
	 * 生成日历数据
	 */
	function generateCalendarDays() {
		const year = currentYear;
		const month = currentMonth - 1; // JavaScript月份从0开始
		
		// 获取当月第一天和最后一天
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		
		// 获取当月第一天是星期几
		const firstDayOfWeek = firstDay.getDay();
		
		// 获取上个月的天数，用于填充前面的空白
		const prevMonth = new Date(year, month, 0);
		const prevMonthDays = prevMonth.getDate();
		
		const days: CalendarDay[] = [];
		const today = new Date();
		const todayString = today.toISOString().split('T')[0];
		
		// 填充上个月的天数
		for (let i = firstDayOfWeek - 1; i >= 0; i--) {
			const date = prevMonthDays - i;
			const fullDate = new Date(year, month - 1, date).toISOString().split('T')[0];
			days.push({
				date,
				fullDate,
				isCurrentMonth: false,
				isToday: false,
				data: calendarData.find(d => d.date === fullDate)
			});
		}
		
		// 填充当月的天数
		const currentMonthDays = lastDay.getDate();
		for (let date = 1; date <= currentMonthDays; date++) {
			const fullDate = new Date(year, month, date).toISOString().split('T')[0];
			days.push({
				date,
				fullDate,
				isCurrentMonth: true,
				isToday: fullDate === todayString,
				data: calendarData.find(d => d.date === fullDate)
			});
		}
		
		// 填充下个月的天数，确保总共42个格子（6行7列）
		const remainingDays = 42 - days.length;
		for (let date = 1; date <= remainingDays; date++) {
			const fullDate = new Date(year, month + 1, date).toISOString().split('T')[0];
			days.push({
				date,
				fullDate,
				isCurrentMonth: false,
				isToday: false,
				data: calendarData.find(d => d.date === fullDate)
			});
		}
		
		calendarDays = days;
		monthName = monthNames[month];
	}

	/**
	 * 切换到上个月
	 */
	function goToPrevMonth() {
		if (currentMonth === 1) {
			currentMonth = 12;
			currentYear -= 1;
		} else {
			currentMonth -= 1;
		}
		dispatch('monthChange', { year: currentYear, month: currentMonth });
	}

	/**
	 * 切换到下个月
	 */
	function goToNextMonth() {
		if (currentMonth === 12) {
			currentMonth = 1;
			currentYear += 1;
		} else {
			currentMonth += 1;
		}
		dispatch('monthChange', { year: currentYear, month: currentMonth });
	}

	/**
	 * 回到今天
	 */
	function goToToday() {
		const today = new Date();
		currentYear = today.getFullYear();
		currentMonth = today.getMonth() + 1;
		dispatch('monthChange', { year: currentYear, month: currentMonth });
	}

	/**
	 * 处理日期点击
	 */
	function handleDayClick(day: CalendarDay) {
		if (!day.isCurrentMonth) return;
		dispatch('dayClick', { date: day.fullDate, data: day.data });
	}

	/**
	 * 获取日期的热力图强度
	 */
	function getIntensityLevel(data?: CalendarData): number {
		if (!data || data.log_count === 0) return 0;
		
		const duration = data.total_duration_minutes || 0;
		const logCount = data.log_count;
		
		// 根据训练时长和次数计算强度
		const intensity = duration / 60 + logCount * 0.5;
		
		if (intensity >= 3) return 4; // 高强度
		if (intensity >= 2) return 3; // 中高强度
		if (intensity >= 1) return 2; // 中强度
		return 1; // 低强度
	}

	/**
	 * 获取状态对应的表情符号
	 */
	function getStatusEmoji(status?: string | null): string {
		if (!status) return '';
		
		switch (status) {
			case '状态良好': return '🟢';
			case '精力充沛': return '⚡';
			case '疲劳': return '🟡';
			case '低效率': return '🔴';
			case '一般': return '🔵';
			default: return '⚪';
		}
	}

	/**
	 * 获取日期显示的工具提示
	 */
	function getTooltip(day: CalendarDay): string {
		if (!day.data || day.data.log_count === 0) {
			return `${day.fullDate} - 无训练记录`;
		}
		
		const { log_count, total_duration_minutes, status_summary, mood_summary } = day.data;
		let tooltip = `${day.fullDate}\n`;
		tooltip += `训练次数: ${log_count}次\n`;
		
		if (total_duration_minutes) {
			tooltip += `训练时长: ${Math.round(total_duration_minutes / 60 * 10) / 10}小时\n`;
		}
		
		if (status_summary) {
			tooltip += `状态: ${status_summary}\n`;
		}
		
		if (mood_summary) {
			tooltip += `心情: ${mood_summary}`;
		}
		
		return tooltip.trim();
	}

	/**
	 * 计算月度统计
	 */
	function getMonthlyStats() {
		const totalWorkouts = calendarData.reduce((sum, day) => sum + day.log_count, 0);
		const totalDuration = calendarData.reduce((sum, day) => sum + (day.total_duration_minutes || 0), 0);
		const activeDays = calendarData.filter(day => day.log_count > 0).length;
		
		return {
			totalWorkouts,
			totalHours: Math.round(totalDuration / 60 * 10) / 10,
			activeDays
		};
	}

	// 监听props变化，重新生成日历
	$: if (currentYear && currentMonth && calendarData) {
		generateCalendarDays();
	}

	$: monthlyStats = getMonthlyStats();

	onMount(() => {
		generateCalendarDays();
	});
</script>

<div class="calendar-container">
	<!-- 日历头部 -->
	<div class="calendar-header">
		<div class="header-left">
			<h1 class="calendar-title">
				<CalendarIcon class="w-7 h-7 text-indigo-600" />
				<div class="title-text">
					<span class="year">{currentYear}年</span>
					<span class="month">{monthName}</span>
				</div>
			</h1>
			
			<!-- 月度统计 -->
			<div class="monthly-stats">
				<div class="stat-item">
					<Activity class="w-4 h-4 text-blue-500" />
					<span>{monthlyStats.totalWorkouts}次训练</span>
				</div>
				<div class="stat-item">
					<Clock class="w-4 h-4 text-green-500" />
					<span>{monthlyStats.totalHours}小时</span>
				</div>
				<div class="stat-item">
					<CalendarIcon class="w-4 h-4 text-purple-500" />
					<span>{monthlyStats.activeDays}活跃天</span>
				</div>
			</div>
		</div>
		
		<div class="header-controls">
			<div class="nav-buttons">
				<button 
					class="nav-btn"
					on:click={goToPrevMonth}
					aria-label="上个月"
				>
					<ChevronLeft class="w-5 h-5" />
				</button>
				
				<button 
					class="today-btn"
					on:click={goToToday}
				>
					今天
				</button>
				
				<button 
					class="nav-btn"
					on:click={goToNextMonth}
					aria-label="下个月"
				>
					<ChevronRight class="w-5 h-5" />
				</button>
			</div>
		</div>
	</div>

	<!-- 星期标题 -->
	<div class="weekdays-header">
		{#each weekDays as weekDay, index}
			<div class="weekday-cell" class:weekend={index === 0 || index === 6}>
				{weekDay}
			</div>
		{/each}
	</div>

	<!-- 日历网格 -->
	<div class="calendar-grid">
		{#each calendarDays as day, index}
			{@const intensityLevel = getIntensityLevel(day.data)}
			{@const isWeekend = index % 7 === 0 || index % 7 === 6}
			<button
				class="calendar-day"
				class:current-month={day.isCurrentMonth}
				class:other-month={!day.isCurrentMonth}
				class:today={day.isToday}
				class:weekend={isWeekend && day.isCurrentMonth}
				class:has-workout={day.data && day.data.log_count > 0}
				class:intensity-1={intensityLevel === 1}
				class:intensity-2={intensityLevel === 2}
				class:intensity-3={intensityLevel === 3}
				class:intensity-4={intensityLevel === 4}
				on:click={() => handleDayClick(day)}
				title={getTooltip(day)}
				disabled={!day.isCurrentMonth}
			>
				<!-- 日期数字 -->
				<span class="day-number">{day.date}</span>
				
				<!-- 训练指示器 -->
				{#if day.data && day.data.log_count > 0}
					<div class="workout-indicators">
						<!-- 状态表情 -->
						{#if day.data.status_summary}
							<span class="status-emoji">
								{getStatusEmoji(day.data.status_summary)}
							</span>
						{/if}
						
						<!-- 训练次数点 -->
						<div class="workout-dots">
							{#each Array(Math.min(day.data.log_count, 4)) as _, i}
								<div class="workout-dot"></div>
							{/each}
							{#if day.data.log_count > 4}
								<span class="more-indicator">+</span>
							{/if}
						</div>
						
						<!-- 时长标签 -->
						{#if day.data.total_duration_minutes && day.data.total_duration_minutes >= 60}
							<div class="duration-badge">
								{Math.round(day.data.total_duration_minutes / 60)}h
							</div>
						{/if}
					</div>
				{/if}
				
				<!-- 今天的特殊标记 -->
				{#if day.isToday}
					<div class="today-marker"></div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- 图例说明 -->
	<div class="calendar-legend">
		<div class="legend-section">
			<h4>训练强度</h4>
			<div class="intensity-legend">
				<div class="legend-item">
					<div class="legend-box intensity-1"></div>
					<span>轻度</span>
				</div>
				<div class="legend-item">
					<div class="legend-box intensity-2"></div>
					<span>中度</span>
				</div>
				<div class="legend-item">
					<div class="legend-box intensity-3"></div>
					<span>高度</span>
				</div>
				<div class="legend-item">
					<div class="legend-box intensity-4"></div>
					<span>极高</span>
				</div>
			</div>
		</div>
		
		<div class="legend-section">
			<h4>状态说明</h4>
			<div class="status-legend">
				<span class="status-item">🟢 状态良好</span>
				<span class="status-item">⚡ 精力充沛</span>
				<span class="status-item">🟡 疲劳</span>
				<span class="status-item">🔴 低效率</span>
				<span class="status-item">🔵 一般</span>
			</div>
		</div>
	</div>
</div>

<style>
	.calendar-container {
		background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
		border-radius: 1rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		border: 1px solid #f3f4f6;
		padding: 1.5rem;
		width: 100%;
		max-width: 72rem;
		margin: 0 auto;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.calendar-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.title-text {
		display: flex;
		flex-direction: column;
	}

	.year {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}

	.month {
		font-size: 1.875rem;
		font-weight: 700;
		background: linear-gradient(to right, #4f46e5, #9333ea);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.monthly-stats {
		display: flex;
		gap: 1.5rem;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #4b5563;
		background-color: #f9fafb;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
	}

	.header-controls {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1rem;
	}

	.nav-buttons {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.nav-btn {
		padding: 0.75rem;
		border-radius: 0.75rem;
		transition: all 0.2s;
		color: #4b5563;
		border: 1px solid #e5e7eb;
		background: white;
		cursor: pointer;
	}

	.nav-btn:hover {
		background-color: #eef2ff;
		color: #4f46e5;
		border-color: #c7d2fe;
	}

	.today-btn {
		padding: 0.75rem 1rem;
		background: linear-gradient(to right, #4f46e5, #9333ea);
		color: white;
		border-radius: 0.75rem;
		transition: all 0.2s;
		font-weight: 500;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: none;
		cursor: pointer;
	}

	.today-btn:hover {
		background: linear-gradient(to right, #4338ca, #7c3aed);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.weekdays-header {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
		margin-bottom: 1rem;
	}

	.weekday-cell {
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
		padding: 0.75rem 0;
		border-radius: 0.5rem;
	}

	.weekday-cell.weekend {
		color: #ef4444;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
		margin-bottom: 2rem;
	}

	.calendar-day {
		position: relative;
		width: 100%;
		height: 5rem;
		border-radius: 0.75rem;
		border: 1px solid #e5e7eb;
		padding: 0.5rem;
		transition: all 0.2s;
		text-align: left;
		overflow: hidden;
		background: white;
		cursor: pointer;
	}

	.calendar-day:hover {
		transform: scale(1.05);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		z-index: 10;
	}

	.calendar-day.current-month {
		background-color: white;
	}

	.calendar-day.current-month:hover {
		background-color: #f9fafb;
	}

	.calendar-day.other-month {
		background-color: #f9fafb;
		color: #9ca3af;
		cursor: not-allowed;
		opacity: 0.5;
	}

	.calendar-day.weekend {
		border-color: #fecaca;
	}

	.calendar-day.today {
		border: 2px solid #6366f1;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		background-color: #eef2ff;
	}

	.calendar-day.has-workout {
		border-color: #bbf7d0;
		background-color: #f0fdf4;
	}

	.calendar-day.intensity-1 {
		background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
		border-color: #86efac;
	}

	.calendar-day.intensity-2 {
		background: linear-gradient(135deg, #bef264 0%, #a3e635 100%);
		border-color: #84cc16;
	}

	.calendar-day.intensity-3 {
		background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
		border-color: #22c55e;
		color: white;
	}

	.calendar-day.intensity-4 {
		background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
		border-color: #16a34a;
		color: white;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.day-number {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.calendar-day.intensity-3 .day-number,
	.calendar-day.intensity-4 .day-number {
		color: white;
	}

	.workout-indicators {
		position: absolute;
		left: 0.25rem;
		right: 0.25rem;
		bottom: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.status-emoji {
		font-size: 0.75rem;
	}

	.workout-dots {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.workout-dot {
		width: 0.375rem;
		height: 0.375rem;
		background-color: #3b82f6;
		border-radius: 50%;
	}

	.calendar-day.intensity-3 .workout-dot,
	.calendar-day.intensity-4 .workout-dot {
		background-color: white;
	}

	.more-indicator {
		font-size: 0.75rem;
		font-weight: 700;
		color: #2563eb;
		margin-left: 0.25rem;
	}

	.calendar-day.intensity-3 .more-indicator,
	.calendar-day.intensity-4 .more-indicator {
		color: white;
	}

	.duration-badge {
		font-size: 0.75rem;
		background-color: #dbeafe;
		color: #1d4ed8;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-weight: 500;
	}

	.calendar-day.intensity-3 .duration-badge,
	.calendar-day.intensity-4 .duration-badge {
		background-color: rgba(255, 255, 255, 0.2);
		color: white;
	}

	.today-marker {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 0.5rem;
		height: 0.5rem;
		background-color: #6366f1;
		border-radius: 50%;
		animation: pulse 2s infinite;
	}

	.calendar-legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
		padding-top: 1.5rem;
		border-top: 1px solid #e5e7eb;
		gap: 1rem;
	}

	.legend-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.legend-section h4 {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	.intensity-legend {
		display: flex;
		gap: 0.75rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.legend-box {
		width: 1rem;
		height: 1rem;
		border-radius: 0.25rem;
		border: 1px solid;
	}

	.legend-box.intensity-1 {
		background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
		border-color: #86efac;
	}

	.legend-box.intensity-2 {
		background: linear-gradient(135deg, #bef264 0%, #a3e635 100%);
		border-color: #84cc16;
	}

	.legend-box.intensity-3 {
		background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
		border-color: #22c55e;
	}

	.legend-box.intensity-4 {
		background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
		border-color: #16a34a;
	}

	.status-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.875rem;
	}

	.status-item {
		color: #4b5563;
	}

	/* 动画定义 */
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.calendar-container {
			padding: 1rem;
		}

		.calendar-header {
			flex-direction: column;
			gap: 1rem;
		}

		.monthly-stats {
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.calendar-day {
			height: 4rem;
			font-size: 0.75rem;
		}

		.calendar-legend {
			flex-direction: column;
			gap: 1rem;
		}

		.intensity-legend {
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.status-legend {
			flex-direction: column;
			gap: 0.25rem;
		}
	}

	@media (max-width: 480px) {
		.calendar-day {
			height: 3.5rem;
		}

		.day-number {
			font-size: 0.75rem;
		}

		.workout-dot {
			width: 0.25rem;
			height: 0.25rem;
		}
	}
</style> 