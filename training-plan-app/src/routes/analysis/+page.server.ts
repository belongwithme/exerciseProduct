// src/routes/analysis/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals: { getSession } }) => {
  const session = await getSession();

  // 只有在用户登录时才去获取疲劳数据
  if (session) {
    try {
      console.log('🔍 开始获取疲劳分析数据...');
      
      // 在服务端的 load 函数中 fetch 内部 API 路由
      const response = await fetch('/api/fatigue-index?include_trend=true&trend_days=30');
      
      console.log('📡 API响应状态:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API响应错误:', errorData);
        throw new Error(errorData.error || `Failed to fetch fatigue data: ${response.statusText}`);
      }

      const fatigueAnalysisData = await response.json();
      console.log('✅ 疲劳分析数据获取成功');
      
      return {
        fatigueAnalysisData
      };

    } catch (error) {
      console.error('❌ 加载疲劳分析数据失败:', error);
      
      // 根据不同的错误类型提供更具体的错误信息
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // 针对常见错误提供更友好的提示
        if (error.message.includes('calculate_fatigue_index')) {
          errorMessage = '疲劳分析功能尚未配置完成，请联系管理员部署数据库函数';
        } else if (error.message.includes('Unauthorized')) {
          errorMessage = '请先登录账户以查看疲劳分析';
        } else if (error.message.includes('fetch')) {
          errorMessage = '网络连接失败，请检查网络连接';
        }
      }
      
      // 返回一个错误状态，以便在页面上显示
      return {
        fatigueAnalysisData: {
          error: errorMessage
        }
      };
    }
  }

  // 如果用户未登录，返回null
  return {
    fatigueAnalysisData: null
  };
}; 