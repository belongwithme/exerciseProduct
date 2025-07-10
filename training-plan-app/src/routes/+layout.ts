// src/routes/+layout.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createBrowserClient, parse, serialize } from '@supabase/ssr'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends('supabase:auth')

  const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch,
    },
    cookies: {
      get: (key: string) => {
        if (typeof document === 'undefined') {
          return null
        }
        const cookies = parse(document.cookie)
        return cookies[key]
      },
      set: (key: string, value: string, options: any) => {
        if (typeof document === 'undefined') {
          return
        }
        document.cookie = serialize(key, value, options)
      },
      remove: (key: string, options: any) => {
        if (typeof document === 'undefined') {
          return
        }
        document.cookie = serialize(key, '', { ...options, maxAge: -1 })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return { supabase, session }
} 