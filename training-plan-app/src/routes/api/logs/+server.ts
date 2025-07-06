import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

/**
 * @description GET /api/logs - 获取当前用户的所有训练日志
 * @returns {Response} - 返回一个包含训练日志数组的JSON响应
 */
export const GET: RequestHandler = async ({ locals: { getSession } }) => {
    // 获取用户会话
	const session = await getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { user } = session;

	// 查询与当前用户关联的所有训练日志，并带上关联的 logged_sets
	const { data: logs, error } = await supabase
		.from('workout_logs')
		.select(`
            id,
            date,
            duration_minutes,
            workout_plans ( name ),
            logged_sets (
                set_number,
                reps,
                weight_kg,
                notes,
                exercises ( name )
            )
        `)
		.eq('user_id', user.id)
		.order('date', { ascending: false });

	if (error) {
		console.error('Error fetching workout logs:', error);
		return json({ error: 'Failed to fetch workout logs' }, { status: 500 });
	}

	return json(logs);
};

/**
 * @description POST /api/logs - 创建一个新的训练日志
 * @param {Request} request - 包含日志详情和已记录组的请求
 * @returns {Response} - 返回新创建的训练日志
 */
export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { user } = session;

	const { plan_id, date, duration_minutes, sets } = await request.json();

    // 验证输入
	if (!date || !Array.isArray(sets) || sets.length === 0) {
		return json({ error: 'Invalid input: date and at least one set are required.' }, { status: 400 });
	}

	// 1. 创建 workout_logs 记录
	const { data: logData, error: logError } = await supabase
		.from('workout_logs')
		.insert({
			user_id: user.id,
			plan_id,
			date,
			duration_minutes,
		})
		.select()
		.single();

	if (logError) {
		console.error('Error creating workout log:', logError);
		return json({ error: 'Failed to create workout log' }, { status: 500 });
	}

	const logId = logData.id;

	// 2. 准备要插入 logged_sets 的数据
	const setsToInsert = sets.map(s => ({
		log_id: logId,
		exercise_id: s.exercise_id,
		set_number: s.set_number,
		reps: s.reps,
		weight_kg: s.weight_kg,
		notes: s.notes,
	}));

	// 3. 插入 logged_sets
	const { error: setsError } = await supabase.from('logged_sets').insert(setsToInsert);

	if (setsError) {
		console.error('Error adding logged sets:', setsError);
        // 如果插入失败，删除已创建的日志以保持数据一致性
		await supabase.from('workout_logs').delete().eq('id', logId);
		return json({ error: 'Failed to add sets to the log' }, { status: 500 });
	}

    // 4. 返回成功创建的完整日志数据
    const { data: newLog, error: newLogError } = await supabase
        .from('workout_logs')
        .select(`
            id,
            date,
            duration_minutes,
            logged_sets (*)
        `)
        .eq('id', logId)
        .single();
    
    if (newLogError) {
        console.error('Error fetching newly created log:', newLogError);
        return json({ error: 'Log created, but failed to fetch final data.' }, { status: 500 });
    }

	return json(newLog, { status: 201 });
}; 