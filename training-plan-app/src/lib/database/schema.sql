-- 训练计划应用数据库结构
-- 创建日期: 2025-01-27
-- 版本: 1.0

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用户档案表 (profiles)
-- 扩展 auth.users 表的用户信息
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    
    -- 身体数据
    height_cm INTEGER CHECK (height_cm > 0 AND height_cm < 300),
    weight_kg DECIMAL(5,2) CHECK (weight_kg > 0 AND weight_kg < 500),
    age INTEGER CHECK (age > 0 AND age < 150),
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    
    -- 弹跳数据
    standing_reach_cm INTEGER CHECK (standing_reach_cm > 0),
    max_touch_height_cm INTEGER CHECK (max_touch_height_cm > 0),
    vertical_jump_cm INTEGER GENERATED ALWAYS AS (max_touch_height_cm - standing_reach_cm) STORED,
    
    -- 力量数据
    bench_press_kg DECIMAL(5,2) CHECK (bench_press_kg >= 0),
    squat_kg DECIMAL(5,2) CHECK (squat_kg >= 0),
    deadlift_kg DECIMAL(5,2) CHECK (deadlift_kg >= 0),
    
    -- 目标数据
    target_touch_height_cm INTEGER CHECK (target_touch_height_cm > 0),
    target_improvement_cm INTEGER GENERATED ALWAYS AS (target_touch_height_cm - max_touch_height_cm) STORED,
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 训练动作表 (exercises)
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    
    -- 分类信息
    muscle_group TEXT NOT NULL CHECK (muscle_group IN (
        'legs', 'chest', 'back', 'shoulders', 'arms', 'core', 'full_body', 'plyometric',
        -- 为兼容 exercemus 数据源，添加更多肌肉群
        'abs', 'biceps', 'calves', 'forearms', 'glutes', 'hamstrings', 'lats', 
        'pectorals', 'quads', 'traps', 'triceps', 'upper back', 'lower back', 'cardio'
    )),
    equipment TEXT CHECK (equipment IN (
        'none', 'barbell', 'dumbbell', 'kettlebell', 'resistance_band', 
        'pull_up_bar', 'box', 'medicine_ball', 'other',
        -- 为兼容 exercemus 数据源，添加更多器械类型
        'machine', 'cable', 'e-z curl bar', 'body weight', 'band', 'smith machine'
    )),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    
    -- 媒体资源
    video_url TEXT,
    image_url TEXT,
    
    -- 指导信息
    instructions TEXT,
    tips TEXT,
    
    -- 是否为系统预设动作
    is_system_exercise BOOLEAN DEFAULT FALSE,
    
    -- 创建者（如果是用户自定义动作）
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 训练计划表 (workout_plans)
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- 计划基本信息
    name TEXT NOT NULL,
    description TEXT,
    
    -- 计划类型和难度
    plan_type TEXT CHECK (plan_type IN (
        'strength', 'plyometric', 'mixed', 'beginner', 'intermediate', 'advanced'
    )),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    
    -- 计划参数
    duration_weeks INTEGER CHECK (duration_weeks > 0),
    sessions_per_week INTEGER CHECK (sessions_per_week BETWEEN 1 AND 7),
    
    -- 状态
    is_active BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 计划-动作关联表 (plan_exercises)
CREATE TABLE IF NOT EXISTS public.plan_exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    
    -- 训练参数
    target_sets INTEGER CHECK (target_sets > 0),
    target_reps INTEGER CHECK (target_reps > 0),
    target_weight_kg DECIMAL(5,2) CHECK (target_weight_kg >= 0),
    rest_seconds INTEGER CHECK (rest_seconds >= 0),
    
    -- 顺序和分组
    exercise_order INTEGER NOT NULL,
    week_number INTEGER CHECK (week_number > 0),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
    
    -- 备注
    notes TEXT,
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 确保同一计划中的动作顺序唯一
    UNIQUE(plan_id, week_number, day_of_week, exercise_order)
);

-- 5. 训练日志表 (workout_logs)
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    
    -- 训练基本信息
    date DATE NOT NULL,
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    
    -- 训练感受和评价
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    
    -- 备注
    notes TEXT,
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 已记录组表 (logged_sets)
CREATE TABLE IF NOT EXISTS public.logged_sets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    
    -- 组数据
    set_number INTEGER CHECK (set_number > 0),
    reps INTEGER CHECK (reps >= 0),
    weight_kg DECIMAL(5,2) CHECK (weight_kg >= 0),
    
    -- 时间和休息
    duration_seconds INTEGER CHECK (duration_seconds >= 0),
    rest_seconds INTEGER CHECK (rest_seconds >= 0),
    
    -- 完成状态
    completed BOOLEAN DEFAULT TRUE,
    
    -- 备注
    notes TEXT,
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 确保同一训练日志中的组数据唯一
    UNIQUE(log_id, exercise_id, set_number)
);

-- 7. 用户成就表 (user_achievements)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- 成就类型
    achievement_type TEXT NOT NULL CHECK (achievement_type IN (
        'first_workout', 'week_streak', 'month_streak', 'pr_bench', 'pr_squat', 
        'pr_deadlift', 'vertical_jump_improvement', 'plan_completion'
    )),
    
    -- 成就数据
    achievement_value DECIMAL(10,2),
    description TEXT,
    
    -- 时间戳
    achieved_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON public.exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_is_active ON public.workout_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_plan_exercises_plan_id ON public.plan_exercises(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_exercises_exercise_id ON public.plan_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON public.workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON public.workout_logs(date);
CREATE INDEX IF NOT EXISTS idx_logged_sets_log_id ON public.logged_sets(log_id);
CREATE INDEX IF NOT EXISTS idx_logged_sets_exercise_id ON public.logged_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要自动更新时间戳的表创建触发器
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER exercises_updated_at
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER workout_plans_updated_at
    BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER workout_logs_updated_at
    BEFORE UPDATE ON public.workout_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 为用户档案创建触发器，在用户注册时自动创建档案
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        username, 
        full_name, 
        avatar_url,
        height_cm,
        weight_kg,
        age,
        gender
    )
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        CASE 
            WHEN NEW.raw_user_meta_data->>'height_cm' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'height_cm')::INTEGER
            ELSE NULL
        END,
        CASE 
            WHEN NEW.raw_user_meta_data->>'weight_kg' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'weight_kg')::DECIMAL(5,2)
            ELSE NULL
        END,
        CASE 
            WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'age')::INTEGER
            ELSE NULL
        END,
        NEW.raw_user_meta_data->>'gender'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 在 auth.users 表上创建触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user(); 