// @ts-nocheck
import { createBrowserClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'

export const load = async ({ data, depends, fetch }: Parameters<LayoutLoad>[0]) => {
  /**
   * Declare a dependency so the layout can be invalidated, for example, on
   * session refresh.
   */
  depends('supabase:auth')

  const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch,
    },
  })

  // 使用服务器端的 session，如果不存在则从客户端获取
  let session = data?.session || null
  let user = null

  if (isBrowser()) {
    const {
      data: { session: clientSession },
    } = await supabase.auth.getSession()

    const {
      data: { user: clientUser },
    } = await supabase.auth.getUser()

    session = clientSession
    user = clientUser
  } else {
    // 在服务器端，只使用服务器端传递的 session
    user = session?.user || null
  }

  return { session, supabase, user }
} 