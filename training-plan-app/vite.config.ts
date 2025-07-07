import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// 加载环境变量
	const env = loadEnv(mode, process.cwd(), '');
	
	return {
		plugins: [sveltekit()],
		define: {
			// 确保环境变量在客户端和服务端都可用
			'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(env.PUBLIC_SUPABASE_URL),
			'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.PUBLIC_SUPABASE_ANON_KEY)
		}
	};
});
