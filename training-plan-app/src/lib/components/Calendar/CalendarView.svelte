<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-svelte';

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
	function getHeatmapIntensity(data?: CalendarData): string {
		if (!data || data.log_count === 0) return '';
		
		const duration = data.total_duration_minutes || 0;
		const logCount = data.log_count;
		
		// 根据训练时长和次数计算强度
		const intensity = Math.min(duration / 60 + logCount * 0.5, 4);
		
		if (intensity >= 3) return 'heat-4'; // 高强度
		if (intensity >= 2) return 'heat-3'; // 中高强度
		if (intensity >= 1) return 'heat-2'; // 中强度
		return 'heat-1'; // 低强度
	}

	/**
	 * 获取状态对应的表情符号
	 */
	function getStatusEmoji(status?: string | null): string {
		if (!status) return '';
		
		switch (status) {
			case '状态良好': return '🟢';
			case '精力充沛': return '🟢';
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

	// 监听props变化，重新生成日历
	$: if (currentYear && currentMonth && calendarData) {
		generateCalendarDays();
	}

	onMount(() => {
		generateCalendarDays();
	});
</script>

<div class="calendar-container">
	<!-- 日历头部 -->
	<div class="calendar-header">
		<div class="flex items-center space-x-4">
			<button 
				class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800"
				on:click={goToPrevMonth}
				aria-label="上个月"
			>
				<ChevronLeft class="w-5 h-5" />
			</button>
			
			<h2 class="calendar-title">
				<CalendarIcon class="w-6 h-6 mr-2" />
				{currentYear}年 {monthName}
			</h2>
			
			<button 
				class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800"
				on:click={goToNextMonth}
				aria-label="下个月"
			>
				<ChevronRight class="w-5 h-5" />
			</button>
		</div>
		
		<button 
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
			on:click={goToToday}
		>
			今天
		</button>
	</div>

	<!-- 星期标题 -->
	<div class="weekdays-header">
		{#each weekDays as weekDay}
			<div class="weekday-cell">{weekDay}</div>
		{/each}
	</div>

	<!-- 日历网格 -->
	<div class="calendar-grid">
		{#each calendarDays as day}
			<button
				class="calendar-day relative w-full h-16 rounded-lg border border-gray-200 p-1 transition-all duration-200 text-left hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 {day.isCurrentMonth ? 'current-month' : 'other-month'} 
					{day.isToday ? 'today' : ''} 
					{getHeatmapIntensity(day.data)}"
				on:click={() => handleDayClick(day)}
				title={getTooltip(day)}
				disabled={!day.isCurrentMonth}
			>
				<!-- 日期数字 -->
				<span class="day-number">{day.date}</span>
				
				<!-- 状态指示器 -->
				{#if day.data && day.data.log_count > 0}
					<div class="status-indicators">
						<!-- 状态表情 -->
						{#if day.data.status_summary}
							<span class="status-emoji">
								{getStatusEmoji(day.data.status_summary)}
							</span>
						{/if}
						
						<!-- 训练次数小点 -->
						<div class="log-count-dots">
							{#each Array(Math.min(day.data.log_count, 3)) as _, i}
								<div class="log-dot"></div>
							{/each}
							{#if day.data.log_count > 3}
								<span class="log-count-plus">+</span>
							{/if}
						</div>
					</div>
				{/if}
			</button>
		{/each}
	</div>

	<!-- 图例 -->
	<div class="calendar-legend">
		<div class="legend-section">
			<span class="legend-title">训练强度:</span>
			<div class="heatmap-legend">
				<div class="legend-item">
					<div class="legend-box heat-1"></div>
					<span>轻度</span>
				</div>
				<div class="legend-item">
					<div class="legend-box heat-2"></div>
					<span>中度</span>
				</div>
				<div class="legend-item">
					<div class="legend-box heat-3"></div>
					<span>高度</span>
				</div>
				<div class="legend-item">
					<div class="legend-box heat-4"></div>
					<span>极高</span>
				</div>
			</div>
		</div>
		
		<div class="legend-section">
			<span class="legend-title">状态:</span>
			<div class="status-legend">
				<span>🟢 良好</span>
				<span>🟡 疲劳</span>
				<span>🔴 低效</span>
				<span>🔵 一般</span>
			</div>
		</div>
	</div>
</div>

<style>
	.calendar-container {
		@apply bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full max-w-4xl mx-auto;
	}

	.calendar-header {
		@apply flex justify-between items-center mb-6;
	}

	.calendar-title {
		@apply text-xl font-bold text-gray-800 flex items-center;
	}

	.nav-button {
		/* @apply p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800; */
	}

	.today-button {
		/* @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium; */
	}

	.weekdays-header {
		@apply grid grid-cols-7 gap-1 mb-2;
	}

	.weekday-cell {
		@apply text-center text-sm font-semibold text-gray-600 py-2;
	}

	.calendar-grid {
		@apply grid grid-cols-7 gap-1 mb-6;
	}

	.calendar-day {
		/* @apply relative w-full h-16 rounded-lg border border-gray-200 p-1 transition-all duration-200 text-left hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1; */
	}

	.calendar-day.current-month {
		@apply bg-white;
	}
	.calendar-day.current-month:hover {
		@apply bg-gray-50;
	}

	.calendar-day.other-month {
		@apply bg-gray-50 text-gray-400 cursor-not-allowed;
	}

	.calendar-day.today {
		@apply border-blue-500 border-2;
	}

	.calendar-day.today .day-number {
		@apply text-blue-600 font-bold;
	}

	/* 热力图效果 */
	.calendar-day.heat-1 {
		@apply bg-green-100 border-green-200;
	}

	.calendar-day.heat-2 {
		@apply bg-green-200 border-green-300;
	}

	.calendar-day.heat-3 {
		@apply bg-green-400 border-green-500;
	}

	.calendar-day.heat-4 {
		@apply bg-green-600 border-green-700 text-white;
	}

	.calendar-day.heat-4 .day-number {
		@apply text-white;
	}

	.day-number {
		@apply text-sm font-medium text-gray-800;
	}

	.status-indicators {
		@apply absolute bottom-0 left-0 right-0 p-1 flex items-center justify-between;
	}

	.status-emoji {
		@apply text-xs;
	}

	.log-count-dots {
		@apply flex items-center space-x-1;
	}

	.log-dot {
		@apply w-1.5 h-1.5 bg-blue-500 rounded-full;
	}

	.calendar-day.heat-4 .log-dot {
		@apply bg-white;
	}

	.log-count-plus {
		@apply text-xs font-bold text-blue-600;
	}

	.calendar-day.heat-4 .log-count-plus {
		@apply text-white;
	}

	.calendar-legend {
		@apply flex flex-wrap justify-between items-center pt-4 border-t border-gray-200 text-sm;
	}

	.legend-section {
		@apply flex items-center space-x-3;
	}

	.legend-title {
		@apply font-medium text-gray-700;
	}

	.heatmap-legend {
		@apply flex items-center space-x-2;
	}

	.legend-item {
		@apply flex items-center space-x-1;
	}

	.legend-box {
		@apply w-3 h-3 rounded border;
	}

	.legend-box.heat-1 {
		@apply bg-green-100 border-green-200;
	}

	.legend-box.heat-2 {
		@apply bg-green-200 border-green-300;
	}

	.legend-box.heat-3 {
		@apply bg-green-400 border-green-500;
	}

	.legend-box.heat-4 {
		@apply bg-green-600 border-green-700;
	}

	.status-legend {
		@apply flex items-center space-x-3 text-xs;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.calendar-container {
			@apply p-4;
		}

		.calendar-header {
			@apply flex-col space-y-4;
		}

		.calendar-day {
			@apply h-12;
		}

		.day-number {
			@apply text-xs;
		}

		.status-emoji {
			@apply text-xs;
		}

		.log-dot {
			@apply w-1 h-1;
		}

		.calendar-legend {
			@apply flex-col space-y-2 items-start;
		}

		.legend-section {
			@apply flex-col items-start space-y-1 space-x-0;
		}

		.heatmap-legend,
		.status-legend {
			@apply flex-wrap;
		}
	}
</style> 