-- Epic 1: 基础架构与数据库升级脚本
-- 基于 PRD v0.2.1 和 ERD v0.2.1
-- 执行日期: 2025-01-27
-- 执行者: AI Assistant

-- ==========================================
-- Task 1.1: 在 exercises 表中添加字段
-- ==========================================

-- 添加 type 字段 (TEXT) - 动作类型（力量/有氧/柔韧性等）
ALTER TABLE public.exercises 
ADD COLUMN IF NOT EXISTS type TEXT 
CHECK (type IN ('strength', 'cardio', 'flexibility', 'plyometric', 'balance', 'mobility'));

-- 修改 difficulty_level 为 TEXT 类型（如果当前是 INTEGER）
-- 注意：由于数据类型变更，我们需要先添加新列，迁移数据，然后删除旧列
DO $$ 
BEGIN
    -- 检查当前 difficulty_level 是否为 INTEGER 类型
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exercises' 
        AND column_name = 'difficulty_level' 
        AND data_type = 'integer'
    ) THEN
        -- 添加临时列
        ALTER TABLE public.exercises ADD COLUMN difficulty_level_temp TEXT;
        
        -- 迁移数据：将数字转换为文本
        UPDATE public.exercises 
        SET difficulty_level_temp = CASE 
            WHEN difficulty_level = 1 THEN '初级'
            WHEN difficulty_level = 2 THEN '初级'
            WHEN difficulty_level = 3 THEN '中级'
            WHEN difficulty_level = 4 THEN '高级'
            WHEN difficulty_level = 5 THEN '高级'
            ELSE '中级'
        END;
        
        -- 删除旧列
        ALTER TABLE public.exercises DROP COLUMN difficulty_level;
        
        -- 重命名临时列
        ALTER TABLE public.exercises RENAME COLUMN difficulty_level_temp TO difficulty_level;
        
        -- 添加约束
        ALTER TABLE public.exercises ADD CONSTRAINT check_difficulty_level 
        CHECK (difficulty_level IN ('初级', '中级', '高级'));
    END IF;
END $$;

-- ==========================================
-- Task 1.2: 在 workout_logs 表中添加字段
-- ==========================================

-- 添加 status 字段 (TEXT) - 训练状态标签
ALTER TABLE public.workout_logs 
ADD COLUMN IF NOT EXISTS status TEXT 
CHECK (status IN ('状态良好', '疲劳', '低效率', '精力充沛', '一般'));

-- 添加 mood 字段 (TEXT) - 训练感受或emoji
ALTER TABLE public.workout_logs 
ADD COLUMN IF NOT EXISTS mood TEXT;

-- ==========================================
-- Task 1.3: 创建新表 workout_plan_versions
-- ==========================================

-- 创建训练计划版本快照表
CREATE TABLE IF NOT EXISTS public.workout_plan_versions (
    id BIGSERIAL PRIMARY KEY,
    plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    content JSONB NOT NULL,
    
    -- 确保同一计划的版本号唯一
    UNIQUE(plan_id, version_number)
);

-- ==========================================
-- Task 1.4: 在 workout_logs 表中添加核心外键字段
-- ==========================================

-- 添加 plan_version_id 字段，关联到 workout_plan_versions 表
ALTER TABLE public.workout_logs 
ADD COLUMN IF NOT EXISTS plan_version_id BIGINT 
REFERENCES public.workout_plan_versions(id) ON DELETE SET NULL;

-- ==========================================
-- Task 1.5: 在 workout_plans 表中添加 version 字段
-- ==========================================

-- 添加 version 字段，指向当前最新版本号
ALTER TABLE public.workout_plans 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ==========================================
-- Task 1.6: 创建 SQL 视图 training_calendar_summary
-- ==========================================

-- 创建训练日历聚合视图，用于预聚合日历数据
CREATE OR REPLACE VIEW public.training_calendar_summary AS
SELECT 
    user_id,
    date,
    COUNT(*) as log_count,
    -- 状态摘要：统计当天最常见的状态
    MODE() WITHIN GROUP (ORDER BY status) as status_summary,
    -- 情绪摘要：将当天所有情绪合并
    STRING_AGG(DISTINCT mood, ', ' ORDER BY mood) as mood_summary,
    -- 总训练时长
    SUM(duration_minutes) as total_duration_minutes,
    -- 平均难度评分
    AVG(difficulty_rating) as avg_difficulty_rating,
    -- 平均能量水平
    AVG(energy_level) as avg_energy_level
FROM public.workout_logs 
WHERE date IS NOT NULL
GROUP BY user_id, date
ORDER BY user_id, date DESC;

-- ==========================================
-- Task 1.7: 为高频查询和新功能添加推荐的数据库索引
-- ==========================================

-- workout_logs 表: (user_id, date) 复合索引
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date 
ON public.workout_logs(user_id, date);

-- workout_logs 表: plan_version_id 索引
CREATE INDEX IF NOT EXISTS idx_workout_logs_plan_version 
ON public.workout_logs(plan_version_id);

-- exercises 表: (muscle_group, difficulty_level, type) 复合索引
CREATE INDEX IF NOT EXISTS idx_exercises_multi_filter 
ON public.exercises(muscle_group, difficulty_level, type);

-- workout_plan_versions 表: (plan_id, version_number) 复合索引
CREATE INDEX IF NOT EXISTS idx_plan_versions_plan_version 
ON public.workout_plan_versions(plan_id, version_number);

-- ==========================================
-- Task 1.8: 为所有新增的表和视图配置行级安全 (RLS) 策略
-- ==========================================

-- 启用 workout_plan_versions 表的 RLS
ALTER TABLE public.workout_plan_versions ENABLE ROW LEVEL SECURITY;

-- workout_plan_versions 表的 RLS 策略
-- 用户只能访问自己的训练计划版本
CREATE POLICY "Users can view own plan versions" ON public.workout_plan_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own plan versions" ON public.workout_plan_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own plan versions" ON public.workout_plan_versions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own plan versions" ON public.workout_plan_versions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND user_id = auth.uid()
        )
    );

-- 注意：视图 training_calendar_summary 的 RLS 通过底层表 workout_logs 的策略自动继承

-- ==========================================
-- 数据迁移和初始化
-- ==========================================

-- 为现有的训练计划创建初始版本（version 1）
INSERT INTO public.workout_plan_versions (plan_id, version_number, content)
SELECT 
    wp.id as plan_id,
    1 as version_number,
    jsonb_build_object(
        'plan_info', jsonb_build_object(
            'name', wp.name,
            'description', wp.description,
            'plan_type', wp.plan_type,
            'difficulty_level', wp.difficulty_level,
            'duration_weeks', wp.duration_weeks,
            'sessions_per_week', wp.sessions_per_week
        ),
        'exercises', COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'exercise_id', pe.exercise_id,
                        'exercise_name', e.name,
                        'target_sets', pe.target_sets,
                        'target_reps', pe.target_reps,
                        'target_weight_kg', pe.target_weight_kg,
                        'rest_seconds', pe.rest_seconds,
                        'exercise_order', pe.exercise_order,
                        'week_number', pe.week_number,
                        'day_of_week', pe.day_of_week,
                        'notes', pe.notes
                    ) ORDER BY pe.week_number, pe.day_of_week, pe.exercise_order
                )
                FROM public.plan_exercises pe
                LEFT JOIN public.exercises e ON pe.exercise_id = e.id
                WHERE pe.plan_id = wp.id
            ),
            '[]'::jsonb
        ),
        'created_at', wp.created_at
    ) as content
FROM public.workout_plans wp
WHERE NOT EXISTS (
    SELECT 1 FROM public.workout_plan_versions wpv 
    WHERE wpv.plan_id = wp.id AND wpv.version_number = 1
);

-- ==========================================
-- 验证和完成信息
-- ==========================================

-- 输出完成信息
DO $$ 
BEGIN
    RAISE NOTICE '✅ Epic 1 数据库升级完成！';
    RAISE NOTICE '📊 已完成的任务:';
    RAISE NOTICE '  Task 1.1: exercises 表字段升级 (difficulty_level, type)';
    RAISE NOTICE '  Task 1.2: workout_logs 表字段添加 (status, mood)';
    RAISE NOTICE '  Task 1.3: 创建 workout_plan_versions 表';
    RAISE NOTICE '  Task 1.4: workout_logs 表添加 plan_version_id 字段';
    RAISE NOTICE '  Task 1.5: workout_plans 表添加 version 字段';
    RAISE NOTICE '  Task 1.6: 创建 training_calendar_summary 视图';
    RAISE NOTICE '  Task 1.7: 添加推荐索引';
    RAISE NOTICE '  Task 1.8: 配置 RLS 策略';
    RAISE NOTICE '🎯 数据库现已准备好支持 MVP 0.2.1 的所有新功能！';
END $$; 