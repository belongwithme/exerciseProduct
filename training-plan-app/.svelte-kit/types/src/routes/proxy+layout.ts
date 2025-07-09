// @ts-nocheck
import type { LayoutLoad } from './$types'

export const load = async ({ data }: Parameters<LayoutLoad>[0]) => {
  // 现在认证状态在客户端通过 auth store 管理
  // 保持兼容性，返回空的session
  return {
    session: null,
    supabase: null,
    user: null
  }
} 