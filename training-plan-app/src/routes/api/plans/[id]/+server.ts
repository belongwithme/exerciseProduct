import { json, type RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/utils/supabaseClient';

/**
 * @description GET /api/plans/[id] - 获取指定ID的训练计划详情
 * @returns {Response} - 返回包含单个训练计划的JSON响应
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;
	const { id: planId } = params;

	if (!planId) {
		return json({ error: 'Plan ID is required' }, { status: 400 });
	}

	const { data: plan, error } = await supabase
		.from('workout_plans')
		.select(
			`
            id,
            name,
            description,
            plan_exercises (
                exercise_id,
                target_sets,
                target_reps,
                target_weight_kg,
                rest_seconds,
                exercise_order,
                week_number,
                day_of_week,
                notes,
                exercises (
                    name,
                    muscle_group,
                    equipment,
                    description,
                    instructions
                )
            )
        `
		)
		.eq('id', planId)
		.eq('user_id', user.id)
		.single();

	if (error) {
		console.error(`Error fetching workout plan ${planId}:`, error);
		if (error.code === 'PGRST116') {
			return json({ error: 'Plan not found' }, { status: 404 });
		}
		return json({ error: 'Failed to fetch workout plan' }, { status: 500 });
	}

	if (!plan) {
		return json({ error: 'Plan not found' }, { status: 404 });
	}

	return json(plan);
};

/**
 * @description DELETE /api/plans/[id] - 删除指定的训练计划
 * @returns {Response} - 返回成功或失败的响应
 */
export const DELETE: RequestHandler = async ({ params, locals: { getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;
	const { id: planId } = params;

	if (!planId) {
		return json({ error: 'Plan ID is required' }, { status: 400 });
	}

	// 为确保安全，先验证该计划是否属于当前用户
	const { data: plan, error: fetchError } = await supabase
		.from('workout_plans')
		.select('id')
		.eq('id', planId)
		.eq('user_id', user.id)
		.single();

	if (fetchError || !plan) {
		return json({ error: 'Plan not found or you do not have permission to delete it' }, { status: 404 });
	}

	// 执行删除操作
	const { error: deleteError } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', planId);

	if (deleteError) {
		console.error(`Error deleting workout plan ${planId}:`, deleteError);
		return json({ error: 'Failed to delete workout plan' }, { status: 500 });
	}

	return new Response(null, { status: 204 }); // 204 No Content
};

/**
 * @description PUT /api/plans/[id] - 更新指定的训练计划
 * @returns {Response} - 返回更新后的训练计划
 */
export const PUT: RequestHandler = async ({ request, params, locals: { getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { user } = session;
	const { id: planId } = params;
	const { name, description, exercises } = await request.json();

	if (!planId) {
		return json({ error: 'Plan ID is required' }, { status: 400 });
	}

	if (!name || !Array.isArray(exercises)) {
		return json({ error: 'Invalid input: name and exercises array are required.' }, { status: 400 });
	}

    // 验证计划是否存在且属于该用户
    const { data: existingPlan, error: checkError } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('id', planId)
        .eq('user_id', user.id)
        .single();

    if (checkError || !existingPlan) {
        return json({ error: 'Plan not found or access denied.' }, { status: 404 });
    }

    // 1. 更新训练计划基本信息
    const { error: updateError } = await supabase
        .from('workout_plans')
        .update({
            name,
            description,
            updated_at: new Date().toISOString()
        })
        .eq('id', planId);

    if (updateError) {
        console.error(`Error updating workout plan ${planId}:`, updateError);
        return json({ error: 'Failed to update workout plan' }, { status: 500 });
    }

    // 2. 删除旧的训练动作
    const { error: deleteError } = await supabase
        .from('plan_exercises')
        .delete()
        .eq('plan_id', planId);

    if (deleteError) {
        console.error(`Error deleting old exercises for plan ${planId}:`, deleteError);
        return json({ error: 'Failed to update exercises' }, { status: 500 });
    }

    // 3. 插入新的训练动作
    if (exercises.length > 0) {
        const exercisesToInsert = exercises.map(ex => ({
            plan_id: planId,
            exercise_id: ex.exercise_id,
            target_sets: ex.target_sets || 3,
            target_reps: ex.target_reps || 12,
            target_weight_kg: ex.target_weight_kg || null,
            rest_seconds: ex.rest_seconds || null,
            exercise_order: ex.exercise_order || 1,
            week_number: ex.week_number || null,
            day_of_week: ex.day_of_week || 1,
            notes: ex.notes || null
        }));

        const { error: insertError } = await supabase
            .from('plan_exercises')
            .insert(exercisesToInsert);

        if (insertError) {
            console.error(`Error inserting new exercises for plan ${planId}:`, insertError);
            return json({ error: 'Failed to add exercises' }, { status: 500 });
        }
    }

    // 4. 返回更新后的完整计划数据
    const { data: updatedPlan, error: fetchError } = await supabase
        .from('workout_plans')
		.select(
			`
            id,
            name,
            description,
            plan_exercises (
                exercise_id,
                target_sets,
                target_reps,
                target_weight_kg,
                rest_seconds,
                exercise_order,
                week_number,
                day_of_week,
                notes,
                exercises (
                    name,
                    muscle_group,
                    equipment,
                    description,
                    instructions
                )
            )
        `
		)
		.eq('id', planId)
		.single();

    if (fetchError) {
        return json({ error: 'Plan updated, but failed to fetch final data.' }, { status: 500 });
    }

	return json(updatedPlan);
}; 