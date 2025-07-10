// Epic 6: 疲劳趋势分析与休息建议 (Fatigue Analysis)
// Task 6.2 (BE): 实现 GET /api/fatigue-index 的 RPC 函数，返回当前疲劳指数、历史趋势数据以及基于指数的建议文本

import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * GET /api/fatigue-index
 * 获取用户的疲劳指数分析结果
 * 
 * 查询参数:
 * - include_trend: 是否包含历史趋势数据 (true/false)
 * - trend_days: 趋势分析的天数 (默认30天)
 */
export const GET: RequestHandler = async ({ url, locals: { supabase, getSession } }) => {
  console.log('🔍 API调用开始 - /api/fatigue-index');
  
  try {
    // 获取查询参数
    const includeTrend = url.searchParams.get('include_trend') === 'true';
    const trendDays = parseInt(url.searchParams.get('trend_days') || '30', 10);

    // 验证用户是否已认证 - 使用 locals 中的 getSession
    console.log('🔐 开始验证用户会话...');
    const session = await getSession();
    
    console.log('🔍 会话调试信息:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      email: session?.user?.email,
      expiresAt: session?.expires_at
    });
    
    if (!session) {
      console.log('❌ 没有有效会话，返回401');
      return json({ error: 'Unauthorized - No session found' }, { status: 401 });
    }
    
    if (!session.user) {
      console.log('❌ 会话中没有用户信息，返回401');
      return json({ error: 'Unauthorized - No user in session' }, { status: 401 });
    }
    
    const user = session.user;
    console.log('✅ 用户认证成功:', user.email);

    // 调用主要的疲劳指数计算函数 - 使用 locals 中的 supabase
    console.log('📊 开始调用疲劳指数计算函数...');
    const { data: fatigueData, error: fatigueError } = await supabase
      .rpc('calculate_fatigue_index', { target_user_id: user.id });

    if (fatigueError) {
      console.error('❌ 疲劳指数计算错误:', fatigueError);
      return json({ 
        error: 'Failed to calculate fatigue index',
        details: fatigueError.message 
      }, { status: 500 });
    }

    console.log('✅ 疲劳指数计算成功');

    // 构建响应对象
    const response: any = {
      current_analysis: fatigueData,
      user_id: user.id,
      timestamp: new Date().toISOString()
    };

    // 如果需要包含趋势数据，调用趋势分析函数
    if (includeTrend) {
      console.log('📈 获取趋势数据...');
      const { data: trendData, error: trendError } = await supabase
        .rpc('get_fatigue_trend', { 
          target_user_id: user.id, 
          days_back: trendDays 
        });

      if (trendError) {
        console.error('⚠️ 趋势数据获取失败:', trendError);
        // 趋势数据获取失败不影响主要功能，只记录错误
        response.trend_error = trendError.message;
      } else {
        console.log('✅ 趋势数据获取成功');
        response.trend_analysis = trendData;
      }
    }

    console.log('🎉 API调用成功完成');
    return json(response);

  } catch (error) {
    console.error('💥 API调用异常:', error);
    return json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

/**
 * POST /api/fatigue-index
 * 强制重新计算疲劳指数（用于测试或数据更新后的刷新）
 */
export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
  try {
    // 验证用户是否已认证
    const session = await getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = session.user;
    
    // 调用疲劳指数计算函数
    const { data: fatigueData, error: fatigueError } = await supabase
      .rpc('calculate_fatigue_index', { 
        target_user_id: user.id 
      });

    if (fatigueError) {
      console.error('Error recalculating fatigue index:', fatigueError);
      return json({ 
        error: 'Failed to recalculate fatigue index',
        details: fatigueError.message 
      }, { status: 500 });
    }

    return json({
      message: 'Fatigue index recalculated successfully',
      analysis: fatigueData,
      recalculated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Unexpected error in fatigue-index recalculation:', error);
    return json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}; 