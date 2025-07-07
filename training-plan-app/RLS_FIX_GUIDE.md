# RLS 无限递归问题修复指南

## 问题描述

当用户尝试保存个人资料时，出现以下错误：
```infinite recursion detected in policy for relation "profiles"
```

这是由于 RLS（行级安全策略）中的管理员策略导致的无限递归问题。

## 问题原因

在 `rls-policies.sql` 文件中，以下策略导致了无限递归：

```sql
CREATE POLICY "Admins can view all data" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND username = 'admin'
        )
    );
```

这个策略在 `profiles` 表上查询 `profiles` 表本身，形成了循环依赖。

## 修复步骤

### 步骤 1: 在 Supabase 控制台执行修复脚本

1. 登录 Supabase 控制台
2. 进入 SQL 编辑器
3. 复制并执行以下 SQL 脚本：

```sql
-- 修复 RLS 无限递归问题
-- 删除导致递归的管理员策略

-- 1. 删除有问题的管理员策略
DROP POLICY IF EXISTS "Admins can view all data" ON public.profiles;

-- 2. 重新创建正确的用户策略
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
```

### 步骤 2: 验证修复

1. 刷新浏览器页面
2. 尝试保存个人资料
3. 如果仍有问题，检查浏览器控制台的错误信息

### 步骤 3: 如果需要管理员功能

如果以后需要管理员功能，可以使用以下更安全的策略：

```sql
-- 基于 JWT 声明的管理员策略
CREATE POLICY "Admins can view all data" ON public.profiles
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin'
    );
```

或者创建专门的管理员表：

```sql
-- 创建管理员表
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 基于管理员表的策略
CREATE POLICY "Admins can view all data" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid()
        )
    );
```

## 预防措施

1. **避免在 RLS 策略中查询同一张表**：这是导致无限递归的主要原因
2. **使用 JWT 声明**：对于角色权限，优先使用 JWT 中的声明
3. **创建专门的权限表**：如果需要复杂的权限管理，创建独立的权限表
4. **测试策略**：在生产环境使用前，先在测试环境验证 RLS 策略

## 相关文件

- `src/lib/database/rls-policies.sql` - 原始 RLS 策略文件（已修复）
- `src/lib/database/fix-rls-recursion.sql` - 修复脚本
- 这个文档 - 问题说明和解决方案 