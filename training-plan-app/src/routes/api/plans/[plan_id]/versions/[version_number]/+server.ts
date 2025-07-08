import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * @description: 获取指定训练计划的特定版本详情内容（JSONB格式）。
 * @route: GET /api/plans/[plan_id]/versions/[version_number]
 * @param {Request} request - SvelteKit 请求对象.
 * @returns {Response} - 返回包含版本内容的 JSON 响应.
 */
export const GET: RequestHandler = async ({ locals: { supabase }, params }) => {
	const { plan_id, version_number } = params;

	// 参数校验：确保 plan_id 和 version_number 都存在
	if (!plan_id || !version_number) {
		throw error(400, '必须提供训练计划ID和版本号 (Plan ID and Version Number are required)');
	}

	// 转换版本号为数字，确保输入有效
	const versionNum = parseInt(version_number, 10);
	if (isNaN(versionNum)) {
		throw error(400, '版本号必须是有效的数字 (Version number must be a valid number)');
	}

	// 安全校验：在查询版本详情前，首先确认用户有权限访问该主计划。
	// 这是为了防止通过此接口获取不属于当前用户的计划的版本详情。
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

	// 核心逻辑：查询与该 plan_id 和 version_number 关联的特定版本记录
	const { data, error: versionError } = await supabase
		.from('workout_plan_versions')
		.select('content') // 只选择 content 字段，这是包含完整版本快照的 JSONB 数据
		.eq('plan_id', plan_id)
		.eq('version_number', versionNum)
		.single(); // 使用 single() 因为期望只有一条匹配记录

	// 版本查询错误处理
	if (versionError || !data) {
		console.error('Error fetching workout plan version:', versionError);
		throw error(404, `找不到计划 ${plan_id} 的版本 ${version_number}。`);
	}

	// 成功，直接返回版本的 content 内容
	// 注意：data.content 已经是 JSONB 对象，可以直接返回
	return json(data.content);
}; 