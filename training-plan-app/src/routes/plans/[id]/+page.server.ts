import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session) {
		throw redirect(303, '/auth');
	}

	const { user } = session;
	const { id: planId } = params;

	if (!planId) {
		throw error(400, 'Plan ID is required');
	}

	// 获取计划详情
	const { data: plan, error: planError } = await supabase
		.from('workout_plans')
		.select(`
			id,
			name,
			description,
			created_at,
			updated_at,
			version,
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
				id,
				name,
				muscle_group,
				equipment,
				difficulty_level,
				description,
				instructions
			)
			)
		`)
		.eq('id', planId)
		.eq('user_id', user.id)
		.single();

	if (planError || !plan) {
		throw error(404, 'Plan not found');
	}

	// 获取计划统计信息
	const exerciseGroups = plan.plan_exercises.reduce((acc: Record<string, number>, ex: any) => {
		const muscleGroup = ex.exercises?.muscle_group || '其他';
		acc[muscleGroup] = (acc[muscleGroup] || 0) + 1;
		return acc;
	}, {});

	const totalVolume = plan.plan_exercises.reduce((acc: number, ex: any) => {
		return acc + (ex.target_sets * ex.target_reps);
	}, 0);

	const difficultyLevels = plan.plan_exercises.reduce((acc: Record<string, number>, ex: any) => {
		const difficulty = ex.exercises?.difficulty_level || '未知';
		acc[difficulty] = (acc[difficulty] || 0) + 1;
		return acc;
	}, {});

	// 获取计划版本历史
	const { data: versions, error: versionsError } = await supabase
		.from('plan_versions')
		.select('id, version_number, created_at, notes')
		.eq('plan_id', planId)
		.order('version_number', { ascending: false })
		.limit(5);

	return {
		plan,
		stats: {
			exerciseGroups,
			totalVolume,
			difficultyLevels,
			totalExercises: plan.plan_exercises.length
		},
		recentVersions: versions || []
	};
}; 