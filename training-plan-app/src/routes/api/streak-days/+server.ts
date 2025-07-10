import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

/**
 * @description GET /api/streak-days - 获取用户的连续打卡天数
 * @returns {Response} - 返回包含连续天数的JSON响应
 */
export const GET: RequestHandler = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;

	try {
		// 尝试调用RPC函数计算连续打卡天数
		const { data: streakData, error: rpcError } = await supabase
			.rpc('get_streak_days', { user_id: user.id });

		if (!rpcError && streakData !== null) {
			return json({
				success: true,
				streak_days: streakData,
				source: 'rpc_function'
			});
		}

		// 如果RPC函数不存在，使用JavaScript计算
		console.log('RPC函数不存在，使用客户端计算:', rpcError);
		
		const { data: logs, error: logsError } = await supabase
			.from('workout_logs')
			.select('date')
			.eq('user_id', user.id)
			.order('date', { ascending: false });

		if (logsError) {
			console.error('Error fetching workout logs for streak calculation:', logsError);
			return json({ error: 'Failed to calculate streak days' }, { status: 500 });
		}

		// 计算连续打卡天数
		const streakDays = calculateStreakDays(logs || []);

		return json({
			success: true,
			streak_days: streakDays,
			source: 'client_calculation'
		});

	} catch (error) {
		console.error('Streak days API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * 计算连续打卡天数
 * @param logs 按日期降序排列的训练日志
 * @returns 连续打卡天数
 */
function calculateStreakDays(logs: any[]): number {
	if (logs.length === 0) {
		return 0;
	}

	// 获取唯一的训练日期
	const uniqueDates = [...new Set(logs.map(log => log.date))].sort((a, b) => 
		new Date(b).getTime() - new Date(a).getTime()
	);

	if (uniqueDates.length === 0) {
		return 0;
	}

	// 检查今天是否有训练
	const today = new Date().toISOString().split('T')[0];
	const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
	
	let streakDays = 0;
	let currentDate = new Date();
	
	// 如果今天有训练，从今天开始计算
	// 如果今天没有但昨天有，从昨天开始计算
	if (uniqueDates[0] === today) {
		streakDays = 1;
		currentDate = new Date(today);
	} else if (uniqueDates[0] === yesterday) {
		streakDays = 1;
		currentDate = new Date(yesterday);
	} else {
		// 连续记录已中断
		return 0;
	}

	// 从第二个日期开始检查连续性
	for (let i = 1; i < uniqueDates.length; i++) {
		const expectedDate = new Date(currentDate);
		expectedDate.setDate(expectedDate.getDate() - 1);
		const expectedDateString = expectedDate.toISOString().split('T')[0];
		
		if (uniqueDates[i] === expectedDateString) {
			streakDays++;
			currentDate = expectedDate;
		} else {
			// 连续性中断
			break;
		}
	}

	return streakDays;
} 