import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

/**
 * @description GET /api/calendar-summary - 获取用户训练日历的聚合数据
 * 支持查询参数：
 * - year: 年份 (默认当前年)
 * - month: 月份 (默认当前月)
 * - start_date: 开始日期 (YYYY-MM-DD)
 * - end_date: 结束日期 (YYYY-MM-DD)
 * @returns {Response} - 返回包含日历聚合数据的JSON响应
 */
export const GET: RequestHandler = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;
	
	// 解析查询参数
	const searchParams = url.searchParams;
	const year = searchParams.get('year');
	const month = searchParams.get('month');
	const startDate = searchParams.get('start_date');
	const endDate = searchParams.get('end_date');

	// 如果没有指定日期范围，使用年月或默认当月
	let dateFilter = '';
	if (startDate && endDate) {
		dateFilter = `date.gte.${startDate},date.lte.${endDate}`;
	} else if (year && month) {
		const paddedMonth = month.padStart(2, '0');
		const monthStart = `${year}-${paddedMonth}-01`;
		const nextMonth = parseInt(month) + 1;
		const nextYear = nextMonth > 12 ? parseInt(year) + 1 : parseInt(year);
		const nextMonthPadded = (nextMonth > 12 ? 1 : nextMonth).toString().padStart(2, '0');
		const monthEnd = `${nextYear}-${nextMonthPadded}-01`;
		dateFilter = `date.gte.${monthStart},date.lt.${monthEnd}`;
	} else {
		// 默认当前月
		const now = new Date();
		const currentYear = now.getFullYear();
		const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
		const monthStart = `${currentYear}-${currentMonth}-01`;
		const nextMonth = now.getMonth() + 2;
		const nextYear = nextMonth > 12 ? currentYear + 1 : currentYear;
		const nextMonthPadded = (nextMonth > 12 ? 1 : nextMonth).toString().padStart(2, '0');
		const monthEnd = `${nextYear}-${nextMonthPadded}-01`;
		dateFilter = `date.gte.${monthStart},date.lt.${monthEnd}`;
	}

	try {
		// 尝试从视图查询数据 (如果存在)
		const { data: calendarData, error: viewError } = await supabase
			.from('training_calendar_summary')
			.select('*')
			.eq('user_id', user.id)
			.filter('date', 'gte', dateFilter.split(',')[0].split('.')[1])
			.filter('date', 'lte', dateFilter.split(',')[1]?.split('.')[1] || dateFilter.split(',')[0].split('.')[1])
			.order('date', { ascending: true });

		if (!viewError && calendarData) {
			// 视图查询成功
			return json({
				success: true,
				data: calendarData,
				source: 'view'
			});
		}

		// 如果视图不存在或查询失败，直接从表查询并聚合
		console.log('视图查询失败，使用直接查询:', viewError);
		
		const { data: logs, error: logsError } = await supabase
			.from('workout_logs')
			.select('date, status, mood, duration_minutes')
			.eq('user_id', user.id)
			.filter('date', 'gte', dateFilter.split(',')[0].split('.')[1])
			.filter('date', dateFilter.split(',')[1] ? 'lte' : 'lt', 
					dateFilter.split(',')[1]?.split('.')[1] || dateFilter.split(',')[0].split('.')[1])
			.order('date', { ascending: true });

		if (logsError) {
			console.error('Error fetching workout logs for calendar:', logsError);
			return json({ error: 'Failed to fetch calendar data' }, { status: 500 });
		}

		// 手动聚合数据
		const aggregatedData = aggregateLogsByDate(logs || []);

		return json({
			success: true,
			data: aggregatedData,
			source: 'direct_query'
		});

	} catch (error) {
		console.error('Calendar summary API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * 手动聚合训练日志数据，按日期分组
 * @param logs 训练日志数组
 * @returns 聚合后的日历数据
 */
function aggregateLogsByDate(logs: any[]) {
	const grouped = logs.reduce((acc, log) => {
		const date = log.date;
		if (!acc[date]) {
			acc[date] = {
				date,
				log_count: 0,
				status_summary: '',
				mood_summary: '',
				total_duration_minutes: 0,
				statuses: [],
				moods: []
			};
		}
		
		acc[date].log_count += 1;
		if (log.duration_minutes) {
			acc[date].total_duration_minutes += log.duration_minutes;
		}
		if (log.status) {
			acc[date].statuses.push(log.status);
		}
		if (log.mood) {
			acc[date].moods.push(log.mood);
		}
		
		return acc;
	}, {});

	// 计算状态和情绪摘要
	return Object.values(grouped).map((dayData: any) => {
		// 计算最常见的状态
		const statusCounts = dayData.statuses.reduce((acc: any, status: string) => {
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		}, {});
		const mostCommonStatus = Object.keys(statusCounts).reduce((a, b) => 
			statusCounts[a] > statusCounts[b] ? a : b, '');

		// 合并所有情绪
		const uniqueMoods = [...new Set(dayData.moods)];

		return {
			user_id: null, // 视图字段，这里不需要
			date: dayData.date,
			log_count: dayData.log_count,
			status_summary: mostCommonStatus || null,
			mood_summary: uniqueMoods.join(', ') || null,
			total_duration_minutes: dayData.total_duration_minutes,
			avg_difficulty_rating: null, // 需要从workout_logs表获取
			avg_energy_level: null // 需要从workout_logs表获取
		};
	});
} 