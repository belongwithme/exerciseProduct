// 训练日历模拟数据
export type CalendarData = {
	date: string;
	log_count: number;
	status_summary?: string | null;
	mood_summary?: string | null;
	total_duration_minutes?: number;
};

export type WorkoutLog = {
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

/**
 * 生成指定日期的模拟日历数据
 */
export function generateMockCalendarData(year: number, month: number): CalendarData[] {
	const data: CalendarData[] = [];
	const currentDate = new Date();
	const daysInMonth = new Date(year, month, 0).getDate();
	
	const statuses = ['状态良好', '精力充沛', '疲劳', '低效率', '一般'];
	const moods = ['充满活力', '平静', '有动力', '轻松愉快', '专注', '满足', '兴奋'];
	
	// 为当月的每一天生成数据（70%概率有训练）
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(year, month - 1, day);
		const dateString = date.toISOString().split('T')[0];
		
		// 过滤掉未来的日期
		if (date > currentDate) continue;
		
		// 70%概率有训练记录
		if (Math.random() < 0.7) {
			const logCount = Math.floor(Math.random() * 3) + 1; // 1-3次训练
			const duration = Math.floor(Math.random() * 120) + 30; // 30-150分钟
			
			data.push({
				date: dateString,
				log_count: logCount,
				status_summary: statuses[Math.floor(Math.random() * statuses.length)],
				mood_summary: moods[Math.floor(Math.random() * moods.length)],
				total_duration_minutes: duration
			});
		}
	}
	
	return data;
}

/**
 * 生成指定日期的模拟训练日志
 */
export function generateMockWorkoutLogs(date: string, logCount: number = 1): WorkoutLog[] {
	const exercises = [
		'深蹲', '硬拉', '卧推', '引体向上', '推肩', '弯举',
		'臀桥', '平板支撑', '俯卧撑', '仰卧起坐', '箭步蹲', '划船'
	];
	
	const statuses = ['状态良好', '精力充沛', '疲劳', '低效率', '一般'];
	const moods = ['充满活力', '平静', '有动力', '轻松愉快', '专注', '满足', '兴奋'];
	
	const logs: WorkoutLog[] = [];
	
	for (let i = 0; i < logCount; i++) {
		// 每个训练日志包含3-6个动作
		const exerciseCount = Math.floor(Math.random() * 4) + 3;
		const selectedExercises = [...exercises]
			.sort(() => Math.random() - 0.5)
			.slice(0, exerciseCount);
		
		const sets: WorkoutLog['logged_sets'] = [];
		
		selectedExercises.forEach(exercise => {
			// 每个动作3-5组
			const setCount = Math.floor(Math.random() * 3) + 3;
			for (let setNum = 1; setNum <= setCount; setNum++) {
				sets!.push({
					exercise_name: exercise,
					set_number: setNum,
					reps: Math.floor(Math.random() * 8) + 8, // 8-15次
					weight_kg: Math.floor(Math.random() * 50) + 20 // 20-70kg
				});
			}
		});
		
		logs.push({
			id: `mock-log-${date}-${i}`,
			date: date,
			duration_minutes: Math.floor(Math.random() * 90) + 45, // 45-135分钟
			status: statuses[Math.floor(Math.random() * statuses.length)],
			mood: moods[Math.floor(Math.random() * moods.length)],
			logged_sets: sets
		});
	}
	
	return logs;
}

/**
 * 获取模拟的连续训练天数
 */
export function getMockStreakDays(): number {
	// 随机生成0-21天的连续训练记录
	return Math.floor(Math.random() * 22);
}

/**
 * 获取模拟的最后训练日期
 */
export function getMockLastWorkoutDate(): string | null {
	const today = new Date();
	const daysAgo = Math.floor(Math.random() * 7); // 0-6天前
	
	if (daysAgo === 0) {
		return today.toISOString().split('T')[0]; // 今天训练了
	}
	
	const lastDate = new Date(today);
	lastDate.setDate(today.getDate() - daysAgo);
	return lastDate.toISOString().split('T')[0];
} 