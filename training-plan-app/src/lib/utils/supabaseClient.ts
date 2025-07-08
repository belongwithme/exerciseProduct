/**
 * Supabase客户端配置
 * 
 * 初始化Supabase客户端，用于与Supabase后端服务进行交互。
 * 从环境变量中读取Supabase URL和公开API Key。
 */

import { createClient } from '@supabase/supabase-js';

// **从 process.env 读取环境变量**
// 注意：这些变量由 vite.config.js 中的 'define' 选项在构建时注入，
// 因此在客户端和服务器端均可安全使用。
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

// 调试信息
console.log('Supabase 环境变量检查:');
console.log('PUBLIC_SUPABASE_URL:', supabaseUrl ? '已设置' : '未设置');
console.log('PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '已设置' : '未设置');

// 检查环境变量是否已配置
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Supabase URL and Anon Key are required. Check your .env file and ensure the SvelteKit server is running.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// 创建Supabase客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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