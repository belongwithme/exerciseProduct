import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

/**
 * @description GET /api/last-workout - 获取用户最后一次训练的日期
 * @returns {Response} - 返回包含最后训练日期的JSON响应
 */
export const GET: RequestHandler = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;

	try {
		// 获取用户最后一次训练的日期
		const { data: lastWorkout, error } = await supabase
			.from('workout_logs')
			.select('date')
			.eq('user_id', user.id)
			.order('date', { ascending: false })
			.limit(1)
			.single();

		if (error && error.code !== 'PGRST116') { // PGRST116 是"没有找到行"的错误代码
			console.error('Error fetching last workout date:', error);
			return json({ error: 'Failed to fetch last workout date' }, { status: 500 });
		}

		return json({
			success: true,
			last_workout_date: lastWorkout?.date || null,
			has_workouts: !!lastWorkout
		});

	} catch (error) {
		console.error('Last workout API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}; 