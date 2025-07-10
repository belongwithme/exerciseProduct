-- Epic 6: 疲劳趋势分析与休息建议 (Fatigue Analysis)
-- Task 6.1 (BE): 设计并实现智能疲劳指数算法，封装为 PostgreSQL 函数并通过 RPC 调用
-- 
-- 算法构成: 疲劳指数 = f(客观训练负荷 * 权重A + 主观状态评分 * 权重B)
-- 客观训练负荷: 综合计算过去7天的训练频率、总容量（总重量 * 总次数）、平均训练时长等数据
-- 主观状态评分: 将用户在 workout_logs 中记录的 status 标签和 mood 转化为数值，进行加权计算

-- ============================================================================
-- 函数1: calculate_fatigue_index - 计算用户的疲劳指数
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_fatigue_index(target_user_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
SECURITY DEFINER
AS $$
DECLARE
  user_id_to_analyze uuid;
  -- 客观指标变量
  training_frequency int := 0;
  total_volume numeric := 0;
  avg_duration numeric := 0;
  total_sets int := 0;
  
  -- 主观指标变量
  avg_status_score numeric := 0;
  avg_mood_score numeric := 0;
  
  -- 算法权重配置
  objective_weight numeric := 0.6;  -- 客观负荷权重60%
  subjective_weight numeric := 0.4; -- 主观感受权重40%
  
  -- 最终结果
  fatigue_index numeric := 0;
  fatigue_level text := 'normal';
  recommendation text := '';
  
  -- 临时变量
  temp_record record;
BEGIN
  -- 确定要分析的用户ID
  user_id_to_analyze := COALESCE(target_user_id, auth.uid());
  
  -- 如果没有指定用户且无法获取当前用户，抛出错误
  IF user_id_to_analyze IS NULL THEN
    RAISE EXCEPTION 'Unable to determine user ID for fatigue analysis';
  END IF;
  
  -- 如果指定了用户ID且与当前用户不匹配，进行权限检查
  IF target_user_id IS NOT NULL AND target_user_id != auth.uid() THEN
    RAISE EXCEPTION 'You do not have permission to analyze fatigue for user %', target_user_id;
  END IF;
  
  -- ========================================================================
  -- 步骤1: 计算客观训练负荷指标（过去7天）
  -- ========================================================================
  
  -- 1.1 计算训练频率（过去7天的训练次数）
  SELECT COUNT(*) INTO training_frequency
  FROM workout_logs
  WHERE user_id = user_id_to_analyze 
    AND date >= CURRENT_DATE - INTERVAL '7 days'
    AND date <= CURRENT_DATE;
  
  -- 1.2 计算总训练容量（总重量 * 总次数）和总组数
  SELECT 
    COALESCE(SUM(ls.weight_kg * ls.reps), 0) as volume,
    COALESCE(COUNT(ls.id), 0) as sets_count
  INTO total_volume, total_sets
  FROM workout_logs wl
  JOIN logged_sets ls ON wl.id = ls.log_id
  WHERE wl.user_id = user_id_to_analyze 
    AND wl.date >= CURRENT_DATE - INTERVAL '7 days'
    AND wl.date <= CURRENT_DATE;
  
  -- 1.3 计算平均训练时长
  SELECT COALESCE(AVG(duration_minutes), 0) INTO avg_duration
  FROM workout_logs
  WHERE user_id = user_id_to_analyze 
    AND date >= CURRENT_DATE - INTERVAL '7 days'
    AND date <= CURRENT_DATE
    AND duration_minutes IS NOT NULL;
  
  -- ========================================================================
  -- 步骤2: 计算主观状态评分（过去7天）
  -- ========================================================================
  
  -- 2.1 计算平均状态评分
  -- 状态评分映射: '状态良好' = 1, '一般' = 0, '疲劳' = -1, '低效率' = -0.5
  SELECT COALESCE(AVG(
    CASE 
      WHEN status = '状态良好' THEN 1
      WHEN status = '一般' THEN 0
      WHEN status = '疲劳' THEN -1
      WHEN status = '低效率' THEN -0.5
      ELSE 0
    END
  ), 0) INTO avg_status_score
  FROM workout_logs
  WHERE user_id = user_id_to_analyze 
    AND date >= CURRENT_DATE - INTERVAL '7 days'
    AND date <= CURRENT_DATE
    AND status IS NOT NULL;
  
  -- 2.2 计算平均心情评分
  -- 心情评分映射: 包含积极emoji(😊,💪,🔥等) = 1, 中性 = 0, 消极emoji(😴,😰,😵等) = -1
  SELECT COALESCE(AVG(
    CASE 
      WHEN mood ~ '😊|💪|🔥|👍|✨|🎯|⚡|🚀|💯' THEN 1
      WHEN mood ~ '😴|😰|😵|😞|😢|😤|🤕|😩' THEN -1
      ELSE 0
    END
  ), 0) INTO avg_mood_score
  FROM workout_logs
  WHERE user_id = user_id_to_analyze 
    AND date >= CURRENT_DATE - INTERVAL '7 days'
    AND date <= CURRENT_DATE
    AND mood IS NOT NULL;
  
  -- ========================================================================
  -- 步骤3: 计算综合疲劳指数
  -- ========================================================================
  
  -- 3.1 标准化客观指标（0-100分）
  -- 训练频率: 7天内超过5次训练 = 高负荷
  -- 总容量: 相对于用户历史平均水平
  -- 平均时长: 超过90分钟 = 高负荷
  DECLARE
    objective_score numeric := 0;
    subjective_score numeric := 0;
    frequency_score numeric := 0;
    volume_score numeric := 0;
    duration_score numeric := 0;
  BEGIN
    -- 频率评分 (0-40分)
    frequency_score := LEAST(training_frequency * 8, 40);
    
    -- 容量评分 (0-40分) - 基于总容量的对数缩放
    volume_score := LEAST(LN(total_volume + 1) * 2, 40);
    
    -- 时长评分 (0-20分)
    duration_score := LEAST(avg_duration * 0.22, 20);
    
    -- 客观总分
    objective_score := frequency_score + volume_score + duration_score;
    
    -- 主观评分转换为0-100分 (负分表示疲劳)
    subjective_score := (2 - avg_status_score - avg_mood_score) * 25;
    subjective_score := GREATEST(0, LEAST(100, subjective_score));
    
    -- 综合疲劳指数计算
    fatigue_index := objective_score * objective_weight + subjective_score * subjective_weight;
    fatigue_index := GREATEST(0, LEAST(100, fatigue_index));
  END;
  
  -- ========================================================================
  -- 步骤4: 确定疲劳等级和建议
  -- ========================================================================
  
  IF fatigue_index <= 30 THEN
    fatigue_level := 'low';
    recommendation := '您的训练负荷较低，身体状态良好。可以适当增加训练强度或频率。';
  ELSIF fatigue_index <= 60 THEN
    fatigue_level := 'moderate';
    recommendation := '您的训练负荷适中，请保持当前的训练节奏，注意充分休息。';
  ELSIF fatigue_index <= 80 THEN
    fatigue_level := 'high';
    recommendation := '您的训练负荷较高，建议适当减少训练强度，增加休息时间。';
  ELSE
    fatigue_level := 'critical';
    recommendation := '您的疲劳指数过高，强烈建议安排休息日或进行低强度恢复性训练。';
  END IF;
  
  -- ========================================================================
  -- 步骤5: 返回完整的分析结果
  -- ========================================================================
  
  RETURN jsonb_build_object(
    'fatigue_index', ROUND(fatigue_index, 1),
    'fatigue_level', fatigue_level,
    'recommendation', recommendation,
    'analysis_period', '7 days',
    'objective_metrics', jsonb_build_object(
      'training_frequency', training_frequency,
      'total_volume', ROUND(total_volume, 1),
      'avg_duration_minutes', ROUND(avg_duration, 1),
      'total_sets', total_sets
    ),
    'subjective_metrics', jsonb_build_object(
      'avg_status_score', ROUND(avg_status_score, 2),
      'avg_mood_score', ROUND(avg_mood_score, 2)
    ),
    'algorithm_weights', jsonb_build_object(
      'objective_weight', objective_weight,
      'subjective_weight', subjective_weight
    ),
    'calculated_at', NOW()
  );
END;
$$;

-- ============================================================================
-- 函数2: get_fatigue_trend - 获取疲劳指数的历史趋势数据
-- ============================================================================

CREATE OR REPLACE FUNCTION get_fatigue_trend(
  target_user_id uuid DEFAULT NULL,
  days_back int DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
SECURITY DEFINER
AS $$
DECLARE
  user_id_to_analyze uuid;
  trend_data jsonb := '[]'::jsonb;
  current_date_iter date;
  end_date date;
  temp_index numeric;
  temp_result jsonb;
BEGIN
  -- 确定要分析的用户ID
  user_id_to_analyze := COALESCE(target_user_id, auth.uid());
  
  -- 权限检查
  IF user_id_to_analyze IS NULL THEN
    RAISE EXCEPTION 'Unable to determine user ID for trend analysis';
  END IF;
  
  IF target_user_id IS NOT NULL AND target_user_id != auth.uid() THEN
    RAISE EXCEPTION 'You do not have permission to analyze trends for user %', target_user_id;
  END IF;
  
  -- 设置日期范围
  end_date := CURRENT_DATE;
  current_date_iter := end_date - INTERVAL '1 day' * days_back;
  
  -- 循环计算每周的疲劳指数（每7天计算一次）
  WHILE current_date_iter <= end_date LOOP
    -- 为当前日期计算疲劳指数（基于该日期前7天的数据）
    SELECT calculate_fatigue_index_for_date(user_id_to_analyze, current_date_iter) INTO temp_result;
    
    -- 将结果添加到趋势数据中
    trend_data := trend_data || jsonb_build_object(
      'date', current_date_iter,
      'fatigue_index', temp_result->'fatigue_index',
      'fatigue_level', temp_result->'fatigue_level'
    );
    
    -- 移动到下一个计算点（每3天计算一次以提高精度）
    current_date_iter := current_date_iter + INTERVAL '3 days';
  END LOOP;
  
  RETURN jsonb_build_object(
    'user_id', user_id_to_analyze,
    'period_days', days_back,
    'trend_data', trend_data,
    'generated_at', NOW()
  );
END;
$$;

-- ============================================================================
-- 辅助函数: calculate_fatigue_index_for_date - 计算特定日期的疲劳指数
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_fatigue_index_for_date(
  target_user_id uuid,
  analysis_date date
)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public
SECURITY DEFINER
AS $$
DECLARE
  -- 客观指标变量
  training_frequency int := 0;
  total_volume numeric := 0;
  avg_duration numeric := 0;
  
  -- 主观指标变量
  avg_status_score numeric := 0;
  avg_mood_score numeric := 0;
  
  -- 算法权重配置
  objective_weight numeric := 0.6;
  subjective_weight numeric := 0.4;
  
  -- 最终结果
  fatigue_index numeric := 0;
  fatigue_level text := 'normal';
BEGIN
  -- 计算指定日期前7天的数据
  
  -- 训练频率
  SELECT COUNT(*) INTO training_frequency
  FROM workout_logs
  WHERE user_id = target_user_id 
    AND date >= analysis_date - INTERVAL '7 days'
    AND date <= analysis_date;
  
  -- 总训练容量
  SELECT COALESCE(SUM(ls.weight_kg * ls.reps), 0) INTO total_volume
  FROM workout_logs wl
  JOIN logged_sets ls ON wl.id = ls.log_id
  WHERE wl.user_id = target_user_id 
    AND wl.date >= analysis_date - INTERVAL '7 days'
    AND wl.date <= analysis_date;
  
  -- 平均训练时长
  SELECT COALESCE(AVG(duration_minutes), 0) INTO avg_duration
  FROM workout_logs
  WHERE user_id = target_user_id 
    AND date >= analysis_date - INTERVAL '7 days'
    AND date <= analysis_date
    AND duration_minutes IS NOT NULL;
  
  -- 平均状态评分
  SELECT COALESCE(AVG(
    CASE 
      WHEN status = '状态良好' THEN 1
      WHEN status = '一般' THEN 0
      WHEN status = '疲劳' THEN -1
      WHEN status = '低效率' THEN -0.5
      ELSE 0
    END
  ), 0) INTO avg_status_score
  FROM workout_logs
  WHERE user_id = target_user_id 
    AND date >= analysis_date - INTERVAL '7 days'
    AND date <= analysis_date
    AND status IS NOT NULL;
  
  -- 平均心情评分
  SELECT COALESCE(AVG(
    CASE 
      WHEN mood ~ '😊|💪|🔥|👍|✨|🎯|⚡|🚀|💯' THEN 1
      WHEN mood ~ '😴|😰|😵|😞|😢|😤|🤕|😩' THEN -1
      ELSE 0
    END
  ), 0) INTO avg_mood_score
  FROM workout_logs
  WHERE user_id = target_user_id 
    AND date >= analysis_date - INTERVAL '7 days'
    AND date <= analysis_date
    AND mood IS NOT NULL;
  
  -- 计算疲劳指数
  DECLARE
    objective_score numeric := 0;
    subjective_score numeric := 0;
  BEGIN
    objective_score := LEAST(training_frequency * 8, 40) + 
                      LEAST(LN(total_volume + 1) * 2, 40) + 
                      LEAST(avg_duration * 0.22, 20);
    
    subjective_score := (2 - avg_status_score - avg_mood_score) * 25;
    subjective_score := GREATEST(0, LEAST(100, subjective_score));
    
    fatigue_index := objective_score * objective_weight + subjective_score * subjective_weight;
    fatigue_index := GREATEST(0, LEAST(100, fatigue_index));
  END;
  
  -- 确定疲劳等级
  IF fatigue_index <= 30 THEN
    fatigue_level := 'low';
  ELSIF fatigue_index <= 60 THEN
    fatigue_level := 'moderate';
  ELSIF fatigue_index <= 80 THEN
    fatigue_level := 'high';
  ELSE
    fatigue_level := 'critical';
  END IF;
  
  RETURN jsonb_build_object(
    'fatigue_index', ROUND(fatigue_index, 1),
    'fatigue_level', fatigue_level,
    'analysis_date', analysis_date
  );
END;
$$; 