// @ts-nocheck
import type { LayoutServerLoad } from './$types'

export const load = async ({ locals: { supabase, safeGetSession } }: Parameters<LayoutServerLoad>[0]) => {
  const { session } = await safeGetSession()

  return {
    session,
  }
} 