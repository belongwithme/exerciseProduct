import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// 使用 Vite 的 loadEnv 函数加载 .env.local 文件
	// 第三个参数 '' 表示加载所有变量，而不仅仅是带 VITE_ 前缀的
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [sveltekit()],
		// Chart.js SSR 配置
		ssr: {
			noExternal: ['chart.js']
		},
		// 使用 define 在构建时将环境变量的值直接替换到代码中
		// 这可以确保无论在服务端还是客户端，变量都可用
		define: {
			// 将 process.env.PUBLIC_... 这样的写法替换为实际的值
			'process.env.PUBLIC_SUPABASE_URL': JSON.stringify(env.PUBLIC_SUPABASE_URL),
			'process.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.PUBLIC_SUPABASE_ANON_KEY)
		}
	};
});
