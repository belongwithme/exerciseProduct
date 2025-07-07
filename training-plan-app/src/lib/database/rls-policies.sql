-- 行级安全策略 (RLS Policies)
-- 确保用户只能访问自己的数据
-- 创建日期: 2025-01-27

-- 启用所有表的 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logged_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 1. Profiles 表策略
-- 用户只能查看和修改自己的档案
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Exercises 表策略
-- 允许所有认证用户查看所有动作
DROP POLICY IF EXISTS "Anyone can view system exercises" ON public.exercises;
DROP POLICY IF EXISTS "Users can view own exercises" ON public.exercises;

CREATE POLICY "Authenticated users can view all exercises" ON public.exercises
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create exercises" ON public.exercises
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own exercises" ON public.exercises
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete own exercises" ON public.exercises
    FOR DELETE USING (created_by = auth.uid());

-- 3. Workout Plans 表策略
-- 用户只能访问自己的训练计划
-- 可以查看公开的训练计划
CREATE POLICY "Users can view own workout plans" ON public.workout_plans
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public workout plans" ON public.workout_plans
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create workout plans" ON public.workout_plans
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workout plans" ON public.workout_plans
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own workout plans" ON public.workout_plans
    FOR DELETE USING (user_id = auth.uid());

-- 4. Plan Exercises 表策略
-- 用户只能访问自己训练计划中的动作
CREATE POLICY "Users can view own plan exercises" ON public.plan_exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view public plan exercises" ON public.plan_exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND is_public = true
        )
    );

CREATE POLICY "Users can create plan exercises" ON public.plan_exercises
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own plan exercises" ON public.plan_exercises
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own plan exercises" ON public.plan_exercises
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans 
            WHERE id = plan_id AND user_id = auth.uid()
        )
    );

-- 5. Workout Logs 表策略
-- 用户只能访问自己的训练日志
CREATE POLICY "Users can view own workout logs" ON public.workout_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create workout logs" ON public.workout_logs
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workout logs" ON public.workout_logs
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own workout logs" ON public.workout_logs
    FOR DELETE USING (user_id = auth.uid());

-- 6. Logged Sets 表策略
-- 用户只能访问自己训练日志中的组数据
CREATE POLICY "Users can view own logged sets" ON public.logged_sets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workout_logs 
            WHERE id = log_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create logged sets" ON public.logged_sets
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_logs 
            WHERE id = log_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own logged sets" ON public.logged_sets
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.workout_logs 
            WHERE id = log_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own logged sets" ON public.logged_sets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.workout_logs 
            WHERE id = log_id AND user_id = auth.uid()
        )
    );

-- 7. User Achievements 表策略
-- 用户只能访问自己的成就
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- 管理员策略（可选）
-- 如果需要管理员访问所有数据，可以创建以下策略
-- 注意：下面的策略会导致无限递归，已被注释掉
-- CREATE POLICY "Admins can view all data" ON public.profiles
--     FOR ALL USING (
--         EXISTS (
--             SELECT 1 FROM public.profiles 
--             WHERE id = auth.uid() AND username = 'admin'
--         )
--     );

-- 更安全的管理员策略示例（基于JWT声明）：
CREATE POLICY "Admins can view all data" ON public.profiles
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    ); 