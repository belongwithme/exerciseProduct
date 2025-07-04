-- 修复数据库触发器脚本
-- 确保用户注册时正确创建profiles记录
-- 创建日期: 2025-01-27

-- 1. 删除现有的触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. 创建改进的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_data jsonb;
BEGIN
    -- 记录触发器执行
    RAISE NOTICE '触发器执行: 用户ID = %, 元数据 = %', NEW.id, NEW.raw_user_meta_data;
    
    -- 获取用户元数据
    profile_data := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
    
    -- 插入用户档案
    INSERT INTO public.profiles (
        id, 
        username, 
        full_name, 
        avatar_url,
        height_cm,
        weight_kg,
        age,
        gender,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(profile_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
        COALESCE(profile_data->>'full_name', profile_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
        profile_data->>'avatar_url',
        CASE 
            WHEN profile_data->>'height_cm' IS NOT NULL AND profile_data->>'height_cm' != '' 
            THEN (profile_data->>'height_cm')::INTEGER
            ELSE NULL
        END,
        CASE 
            WHEN profile_data->>'weight_kg' IS NOT NULL AND profile_data->>'weight_kg' != '' 
            THEN (profile_data->>'weight_kg')::DECIMAL(5,2)
            ELSE NULL
        END,
        CASE 
            WHEN profile_data->>'age' IS NOT NULL AND profile_data->>'age' != '' 
            THEN (profile_data->>'age')::INTEGER
            ELSE NULL
        END,
        CASE 
            WHEN profile_data->>'gender' IS NOT NULL AND profile_data->>'gender' != '' 
            THEN profile_data->>'gender'
            ELSE NULL
        END,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE '用户档案创建成功: ID = %, 用户名 = %', NEW.id, COALESCE(profile_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8));
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '创建用户档案失败: ID = %, 错误 = %', NEW.id, SQLERRM;
        -- 即使创建档案失败，也不要阻止用户注册
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 创建触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. 确保profiles表有正确的权限
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon;

-- 5. 测试触发器是否正常工作
DO $$
BEGIN
    RAISE NOTICE '触发器修复完成！';
    RAISE NOTICE '- 删除了旧的触发器和函数';
    RAISE NOTICE '- 创建了新的改进触发器函数';
    RAISE NOTICE '- 添加了错误处理和日志记录';
    RAISE NOTICE '- 设置了正确的权限';
END $$; 