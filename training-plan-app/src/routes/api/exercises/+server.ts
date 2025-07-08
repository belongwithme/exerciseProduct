import { json } from '@sveltejs/kit';

/**
 * @description GET /api/exercises - 获取训练动作列表，支持多维度筛选
 * @param {URLSearchParams} searchParams - 筛选参数
 *   - muscle_group: 肌群筛选 (可选)
 *   - equipment: 器械筛选 (可选) 
 *   - difficulty_level: 难度等级筛选 (可选)
 *   - type: 动作类型筛选 (可选)
 *   - limit: 返回结果数量限制 (可选，默认50)
 *   - offset: 分页偏移量 (可选，默认0)
 * @returns {Response} - 返回符合筛选条件的训练动作数组
 */
export const GET = async ({ url, locals: { supabase } }: any) => {
	// 获取查询参数
	const searchParams = url.searchParams;
	const muscle_group = searchParams.get('muscle_group');
	const equipment = searchParams.get('equipment');
	const difficulty_level = searchParams.get('difficulty_level');
	const type = searchParams.get('type');
	const limit = parseInt(searchParams.get('limit') || '50');
	const offset = parseInt(searchParams.get('offset') || '0');

	// 构建基础查询
	let query = supabase
		.from('exercises')
		.select(`
			id,
			name,
			description,
			muscle_group,
			equipment,
			difficulty_level,
			type,
			video_url,
			image_url,
			instructions,
			tips,
			is_system_exercise
		`, { count: 'exact' })
		.order('name', { ascending: true });

	// 添加筛选条件
	if (muscle_group) {
		query = query.eq('muscle_group', muscle_group);
	}

	if (equipment) {
		query = query.eq('equipment', equipment);
	}

	if (difficulty_level) {
		query = query.eq('difficulty_level', difficulty_level);
	}

	if (type) {
		query = query.eq('type', type);
	}

	// 添加分页
	query = query.range(offset, offset + limit - 1);

	// 执行查询
	const { data: exercises, error, count } = await query;

	if (error) {
		console.error('获取训练动作失败:', error);
		return json({ error: '获取训练动作失败' }, { status: 500 });
	}

	// 同时获取筛选选项（用于前端动态生成筛选器）
	const { data: filterOptions, error: filterError } = await supabase
		.from('exercises')
		.select('muscle_group, equipment, difficulty_level, type')
		.not('muscle_group', 'is', null)
		.not('equipment', 'is', null);

	let uniqueOptions = {};
	if (!filterError && filterOptions) {
		// 提取唯一的筛选选项
		uniqueOptions = {
			muscle_groups: [...new Set(filterOptions.map((ex: any) => ex.muscle_group).filter(Boolean))].sort(),
			equipment: [...new Set(filterOptions.map((ex: any) => ex.equipment).filter(Boolean))].sort(),
			difficulty_levels: [...new Set(filterOptions.map((ex: any) => ex.difficulty_level).filter(Boolean))].sort(),
			types: [...new Set(filterOptions.map((ex: any) => ex.type).filter(Boolean))].sort(),
		};
	}

	return json({
		exercises,
		total: count,
		limit,
		offset,
		filterOptions: uniqueOptions
	});
}; 