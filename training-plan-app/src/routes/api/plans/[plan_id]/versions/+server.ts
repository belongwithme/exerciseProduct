import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * @description: 获取指定训练计划的所有历史版本列表。
 * @route: GET /api/plans/[plan_id]/versions
 * @param {Request} request - SvelteKit 请求对象.
 * @returns {Response} - 返回包含版本列表的 JSON 响应.
 */
export const GET: RequestHandler = async ({ locals: { supabase }, params }) => {
	const { plan_id } = params;

	// 参数校验：确保 plan_id 存在
	if (!plan_id) {
		throw error(400, '必须提供训练计划ID (Plan ID is required)');
	}

	// 安全校验：在查询版本历史前，首先确认用户有权限访问该主计划。
	// 这是为了防止通过此接口泄露不属于当前用户的计划的版本信息。
	// RLS策略会确保 .select 只返回该用户有权访问的计划。
	const { data: planData, error: planError } = await supabase
		.from('workout_plans')
		.select('id')
		.eq('id', plan_id)
		.single();

	// 如果查询主计划时出错或找不到对应的计划（可能因为ID不存在或RLS策略拦截），则返回404。
	if (planError || !planData) {
		throw error(404, '找不到指定的训练计划，或当前用户无权访问。');
	}

	// 核心逻辑：查询与该 plan_id 关联的所有版本记录
	const { data, error: versionsError } = await supabase
		.from('workout_plan_versions')
		.select('id, version_number, created_at') // 根据需求，只选择必要的字段
		.eq('plan_id', plan_id)
		.order('version_number', { ascending: false }); // 按版本号降序排列，最新版在前

	// 数据库查询错误处理
	if (versionsError) {
		console.error('Error fetching workout plan versions:', versionsError);
		throw error(500, `获取训练计划版本历史时发生错误: ${versionsError.message}`);
	}

	// 成功，返回版本历史数据
	return json(data);
}; 