import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

/**
 * @description DELETE /api/logs/[id] - 删除一个指定的训练日志及其所有相关的组记录
 * @param {object} params - 包含要删除的日志ID
 * @returns {Response} - 返回一个成功或失败的响应
 */
export const DELETE: RequestHandler = async ({ params, locals: { getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const { user } = session;
	const { id: logId } = params;

	if (!logId) {
		return json({ error: 'Log ID is required' }, { status: 400 });
	}

    // 首先，验证要删除的日志是否属于当前用户
    const { data: log, error: fetchError } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('id', logId)
        .eq('user_id', user.id)
        .single();

    if (fetchError || !log) {
        console.error('Error fetching log or log not found for user:', fetchError);
        return json({ error: 'Log not found or you do not have permission to delete it' }, { status: 404 });
    }

	// 1. 删除所有与该日志关联的 logged_sets 记录
    // 这是为了确保数据完整性，以防数据库未设置 ON DELETE CASCADE
	const { error: setsError } = await supabase
        .from('logged_sets')
        .delete()
        .eq('log_id', logId);

	if (setsError) {
		console.error('Error deleting logged sets:', setsError);
		return json({ error: 'Failed to delete associated sets' }, { status: 500 });
	}

	// 2. 删除 workout_logs 记录
	const { error: logError } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', logId);

	if (logError) {
		console.error('Error deleting workout log:', logError);
		return json({ error: 'Failed to delete workout log' }, { status: 500 });
	}

	return json({ message: 'Log deleted successfully' }, { status: 200 });
}; 