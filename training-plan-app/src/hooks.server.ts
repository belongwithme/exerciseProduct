import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

/**
 * SvelteKit 'handle' hook.
 * This runs on every server-side request.
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Create a Supabase client instance for this server request.
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * A convenience helper so we can just call `await getSession()` instead of
	 * `await event.locals.supabase.auth.getSession().then(({ data: { session } }) => session)`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// Resolve the request, allowing it to proceed to the route handler.
	return resolve(event, {
		/**
		 * Supabase needs the `content-range` header to be exposed to the browser.
		 * @see https://supabase.com/docs/guides/auth/server-side-rendering#sveltekit
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
}; 