import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/auth');
	}

	// 只选择需要的字段，减轻数据传输负担
	const { data: plans, error } = await supabase
		.from('workout_plans')
		.select('id, name, description')
		.eq('user_id', session.user.id);

	if (error) {
		console.error('Error fetching workout plans for sharing:', error);
		// 即使出错，也要返回 session
		return { session, plans: [] };
	}

	return { session, plans };
}; 