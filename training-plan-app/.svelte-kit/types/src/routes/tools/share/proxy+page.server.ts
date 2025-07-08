// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ locals: { supabase, safeGetSession } }: Parameters<PageServerLoad>[0]) => {
	const { session } = await safeGetSession();

	if (!session) {
		throw redirect(303, '/auth');
	}

	// 获取完整的训练计划数据，包括关联的动作
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
				target_weight_kg,
				rest_seconds,
				exercise_order,
				week_number,
				day_of_week,
				notes,
				exercises (
					id,
					name,
					description,
					muscle_group,
					equipment
				)
			)
		`)
		.eq('user_id', session.user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching workout plans for sharing:', error);
		return { session, plans: [] };
	}

	return { session, plans };
}; 