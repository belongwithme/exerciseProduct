import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name: string) => event.cookies.get(name),
        set: (name: string, value: string, options: CookieOptions) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        },
        remove: (name: string, options: CookieOptions) => {
          event.cookies.delete(name, { ...options, path: '/' });
        },
      },
    }
  );

  /**
   * a little helper that is written for convenience so that instead
   * of calling `const { data: { session } } = await event.locals.supabase.auth.getSession()`
   * you can just call `await event.locals.getSession()`
   */
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    },
  });
}; 