/**
 * Supabase客户端配置
 * 
 * 初始化Supabase客户端，用于与Supabase后端服务进行交互。
 * 从环境变量中读取Supabase URL和公开API Key。
 */

import { createClient } from '@supabase/supabase-js';

// 从 Vite 的 import.meta.env 中获取环境变量
const PUBLIC_SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// 调试信息
console.log('Supabase 环境变量检查:');
console.log('PUBLIC_SUPABASE_URL:', PUBLIC_SUPABASE_URL ? '已设置' : '未设置');
console.log('PUBLIC_SUPABASE_ANON_KEY:', PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置');

// 检查环境变量是否已配置
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  const errorMessage = 'Supabase URL and Anon Key are required. Make sure your .env file is configured correctly with PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// 创建Supabase客户端实例
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('Supabase 客户端初始化成功');

// 导出客户端，以便在应用程序的其他部分使用
// 例如：
// import { supabase } from 'src/lib/utils/supabaseClient';
// const { data, error } = await supabase.from('your_table').select('*'); 