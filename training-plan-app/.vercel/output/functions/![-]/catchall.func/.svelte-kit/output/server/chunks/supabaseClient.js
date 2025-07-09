import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://oazkzcvavggreoctcqre.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hemt6Y3ZhdmdncmVvY3RjcXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MTU1NDAsImV4cCI6MjA2NzE5MTU0MH0.O8upPx3gKq0wZGLhFqeTiy7ekJjdOQ5UWlazcSAJ3Hk";
console.log("Supabase 环境变量检查:");
console.log("PUBLIC_SUPABASE_URL:", "已设置");
console.log("PUBLIC_SUPABASE_ANON_KEY:", "已设置");
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
console.log("Supabase 客户端初始化成功");
export {
  supabase as s
};
