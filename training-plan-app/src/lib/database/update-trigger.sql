-- 数据库触发器更新脚本
-- 用于更新用户注册时的数据处理逻辑
-- 创建日期: 2025-01-27

-- 删除现有的触发器函数（如果存在）
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 重新创建支持完整用户数据的触发器函数
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

-- 重新创建触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 添加调试信息
DO $$
BEGIN
    RAISE NOTICE '触发器函数已更新，现在支持完整的用户数据字段';
END $$; 