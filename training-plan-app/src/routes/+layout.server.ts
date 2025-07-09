import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
  // 现在认证状态在客户端通过 auth store 管理
  return {}
} 