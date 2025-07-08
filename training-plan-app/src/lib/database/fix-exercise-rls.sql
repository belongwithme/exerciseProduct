-- 为 `exercises` 表启用行级安全（如果尚未启用）
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧的、限制性的策略
DROP POLICY IF EXISTS "Allow authenticated users to read exercises" ON public.exercises;
DROP POLICY IF EXISTS "Allow public read access to exercises" ON public.exercises;

-- 创建新策略：允许任何已认证的用户读取所有训练动作
-- 这是一个通用的策略，因为动作库是共享资源
CREATE POLICY "Allow authenticated users to read exercises"
ON public.exercises
FOR SELECT
TO authenticated
USING (true); 