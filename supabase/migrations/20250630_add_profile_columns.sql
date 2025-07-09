-- =================================================================
-- 增强 `profiles` 表，添加能力分析和个人资料所需的字段
-- 执行日期: 2025-06-30
-- =================================================================

-- 1. 添加基本身体数据字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height_cm DECIMAL(5, 2);
COMMENT ON COLUMN public.profiles.height_cm IS '身高(厘米)';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5, 2);
COMMENT ON COLUMN public.profiles.weight_kg IS '体重(公斤)';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
COMMENT ON COLUMN public.profiles.birth_date IS '出生日期';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));
COMMENT ON COLUMN public.profiles.gender IS '性别';

-- 2. 添加训练背景和目标字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced'));
COMMENT ON COLUMN public.profiles.experience_level IS '训练经验水平';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals TEXT;
COMMENT ON COLUMN public.profiles.goals IS '训练目标';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
COMMENT ON COLUMN public.profiles.bio IS '个人简介';

-- 3. 添加弹跳相关数据字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS standing_reach_cm DECIMAL(5, 2);
COMMENT ON COLUMN public.profiles.standing_reach_cm IS '站立摸高(厘米)';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_touch_height_cm DECIMAL(5, 2);
COMMENT ON COLUMN public.profiles.max_touch_height_cm IS '最大摸高(厘米)';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_touch_height_cm DECIMAL(5, 2);
COMMENT ON COLUMN public.profiles.target_touch_height_cm IS '目标摸高(厘米)';

-- 4. 添加力量数据字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bench_press_kg DECIMAL(5, 2);
COMMENT ON COLUMN public.profiles.bench_press_kg IS '卧推重量(公斤)';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS squat_kg DECIMAL(5, 2);
COMMENT ON COLUMN public.profiles.squat_kg IS '深蹲重量(公斤)';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deadlift_kg DECIMAL(5, 2);
COMMENT ON COLUMN public.profiles.deadlift_kg IS '硬拉重量(公斤)';

-- 5. 确保 `updated_at` 字段存在并自动更新
-- (Supabase 默认的 profiles 表通常已经包含这个，这里作为保险)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 6. 最后，为 profiles 表设置行级安全 (RLS) 策略
-- 这是至关重要的一步，确保用户只能操作自己的数据

-- 开启 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略以避免冲突
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;


-- SELECT 策略：用户可以读取自己的个人资料
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- UPDATE 策略：用户可以更新自己的个人资料
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- INSERT 策略: 用户可以为自己创建个人资料
-- (通常在用户注册时由 Supabase 自动处理，但最好有明确的策略)
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- =================================================================
-- 脚本结束
-- ================================================================= 