import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/utils/supabaseClient';

/**
 * @description GET /api/plans - 获取当前用户的所有训练计划及其包含的动作
 * @returns {Response} - 返回一个包含训练计划数组的JSON响应
 */
export const GET: RequestHandler = async ({ locals: { safeGetSession } }) => {
    // 获取当前用户会话
	const { session } = await safeGetSession();
	if (!session?.user) {
        // 如果用户未登录，返回401 Unauthorized
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;

	// 从数据库中查询与当前用户关联的所有训练计划
	// 使用.select()查询，并嵌入关联的plan_exercises数据
	const { data: plans, error } = await supabase
		.from('workout_plans')
		.select(`
            id,
            name,
            description,
            plan_exercises (
                exercise_id,
                target_sets,
                target_reps,
                notes,
                exercises (
                    name,
                    muscle_group,
                    equipment
                )
            )
        `)
		.eq('user_id', user.id);

	if (error) {
        // 如果查询过程中发生错误，记录错误并返回500 Internal Server Error
		console.error('Error fetching workout plans:', error);
		return json({ error: 'Failed to fetch workout plans' }, { status: 500 });
	}

    // 成功获取数据，返回200 OK及训练计划数据
	return json(plans);
};

/**
 * @description POST /api/plans - 为当前用户创建一个新的训练计划
 * @param {Request} request - 包含训练计划详情和动作列表的请求
 * @returns {Response} - 返回新创建的训练计划
 */
export const POST: RequestHandler = async ({ request, locals: { safeGetSession } }) => {
    // 获取当前用户会话
	const { session } = await safeGetSession();
	if (!session?.user) {
        // 如果用户未登录，返回401 Unauthorized
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;

	const { name, description, exercises } = await request.json();

    // 验证输入数据
	if (!name || !Array.isArray(exercises) || exercises.length === 0) {
		return json({ error: 'Invalid input: name and at least one exercise are required.' }, { status: 400 });
	}

	// 1. 在 workout_plans 表中插入新的训练计划
	const { data: planData, error: planError } = await supabase
		.from('workout_plans')
		.insert({
			user_id: user.id,
			name,
			description,
		})
		.select()
		.single();

	if (planError) {
		console.error('Error creating workout plan:', planError);
		return json({ error: 'Failed to create workout plan' }, { status: 500 });
	}

	const planId = planData.id;

	// 2. 准备要插入 plan_exercises 表的动作数据
	const exercisesToInsert = exercises.map((ex, index) => ({
		plan_id: planId,
		exercise_id: ex.exercise_id,
		target_sets: ex.target_sets || 3,
		target_reps: ex.target_reps || 12,
		target_weight_kg: ex.target_weight_kg || null,
		rest_seconds: ex.rest_seconds || null,
		exercise_order: ex.exercise_order || index + 1,
		week_number: ex.week_number || null,
		day_of_week: ex.day_of_week || 1,
		notes: ex.notes || null
	}));

	// 3. 在 plan_exercises 表中插入与计划关联的动作
	const { error: exercisesError } = await supabase
        .from('plan_exercises')
        .insert(exercisesToInsert);

	if (exercisesError) {
        // 如果插入动作失败，最好在这里删除已创建的计划以保持数据一致性
        // 但为简化，我们暂时只记录错误
		console.error('Error adding exercises to plan:', exercisesError);
        // 注意：这里可以考虑删除刚刚创建的 plan，以避免产生孤立的计划数据
        await supabase.from('workout_plans').delete().eq('id', planId);
		return json({ error: 'Failed to add exercises to the plan' }, { status: 500 });
	}

    // 4. 返回成功创建的完整计划数据
    const { data: newPlan, error: newPlanError } = await supabase
        .from('workout_plans')
        .select(`
            id,
            name,
            description,
            plan_exercises (
                exercise_id,
                target_sets,
                target_reps,
                notes,
                exercises (
                    name
                )
            )
        `)
        .eq('id', planId)
        .single();
    
    if (newPlanError) {
        console.error('Error fetching newly created plan:', newPlanError);
        return json({ error: 'Plan created, but failed to fetch final data.' }, { status: 500 });
    }

	return json(newPlan, { status: 201 });
}; 