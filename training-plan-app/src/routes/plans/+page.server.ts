import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/auth');
	}

	const { data: plans, error } = await supabase
		.from('workout_plans')
		.select(
			`
      id,
      name,
      description,
      plan_exercises (
        target_sets,
        target_reps,
        notes,
        exercises (
          name,
          description,
          muscle_group,
          equipment,
          video_url
        )
      )
    `
		)
		.eq('user_id', session.user.id);

	if (error) {
		console.error('Error fetching workout plans:', error);
		return { plans: [] };
	}

	return { plans };
}; 