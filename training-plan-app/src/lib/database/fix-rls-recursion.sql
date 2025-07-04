-- 修复 RLS 无限递归问题
-- 删除导致递归的管理员策略

-- 1. 删除有问题的管理员策略
DROP POLICY IF EXISTS "Admins can view all data" ON public.profiles;

-- 2. 如果需要管理员功能，可以创建一个更安全的策略
-- 例如：基于用户元数据或特定的管理员表
-- CREATE POLICY "Admins can view all data" ON public.profiles
--     FOR ALL USING (
--         auth.jwt() ->> 'role' = 'admin'
--     );

-- 3. 确保基本的用户策略正确
-- 重新创建用户基本策略（如果需要）
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 重新创建正确的策略
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. 添加 DELETE 策略（如果需要用户能删除自己的档案）
CREATE POLICY "Users can delete own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = id); 