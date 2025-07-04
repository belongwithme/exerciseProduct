# 数据库初始化指南

本目录包含训练计划应用的完整数据库结构和初始化脚本。

## 📁 文件说明

- `schema.sql` - 数据库表结构定义
- `rls-policies.sql` - 行级安全策略
- `seed-data.sql` - 初始数据（系统预设训练动作）
- `init-database.ts` - 自动化初始化脚本（暂未使用）
- `README.md` - 本说明文档

## 🚀 初始化步骤

### 方法一：通过Supabase Web界面（推荐）

1. **登录Supabase控制台**
   - 访问 [https://supabase.com](https://supabase.com)
   - 登录您的账户
   - 选择您的项目

2. **打开SQL编辑器**
   - 在左侧菜单中点击 "SQL Editor"
   - 点击 "New Query" 创建新查询

3. **执行数据库结构脚本**
   - 复制 `schema.sql` 文件的全部内容
   - 粘贴到SQL编辑器中
   - 点击 "Run" 执行
   - 等待执行完成，确保没有错误

4. **执行安全策略脚本**
   - 复制 `rls-policies.sql` 文件的全部内容
   - 粘贴到SQL编辑器中
   - 点击 "Run" 执行
   - 等待执行完成，确保没有错误

5. **执行初始数据脚本**
   - 复制 `seed-data.sql` 文件的全部内容
   - 粘贴到SQL编辑器中
   - 点击 "Run" 执行
   - 等待执行完成，确保没有错误

### 方法二：通过命令行（高级用户）

如果您有Supabase CLI，可以使用以下命令：

```bash
# 安装Supabase CLI
npm install -g supabase

# 登录Supabase
supabase login

# 链接到您的项目
supabase link --project-ref your-project-ref

# 执行SQL文件
supabase db reset
```

## 📋 验证初始化

执行完所有脚本后，您应该能在Supabase控制台的"Table Editor"中看到以下表：

### 核心表
- ✅ `profiles` - 用户档案表
- ✅ `exercises` - 训练动作表
- ✅ `workout_plans` - 训练计划表
- ✅ `plan_exercises` - 计划-动作关联表
- ✅ `workout_logs` - 训练日志表
- ✅ `logged_sets` - 已记录组表
- ✅ `user_achievements` - 用户成就表

### 数据验证
1. 检查 `exercises` 表是否包含20个系统预设动作
2. 确保所有表都启用了RLS（Row Level Security）
3. 验证外键关系是否正确建立

## 🔧 故障排除

### 常见问题

1. **权限错误**
   - 确保您是项目的所有者或管理员
   - 检查是否有足够的权限执行DDL语句

2. **表已存在错误**
   - 如果表已存在，可以先删除或使用 `DROP TABLE IF EXISTS` 语句
   - 或者跳过已存在的表的创建语句

3. **外键约束错误**
   - 确保按照正确的顺序执行SQL文件
   - 先创建被引用的表，再创建引用其他表的表

4. **RLS策略错误**
   - 确保在设置RLS策略之前表已经存在
   - 检查策略中引用的函数是否可用

### 重置数据库

如果需要重新初始化数据库：

```sql
-- 警告：这将删除所有数据！
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

然后重新执行初始化步骤。

## 📊 数据库结构概览

```
auth.users (Supabase内置)
    ↓
profiles (用户档案)
    ↓
workout_plans (训练计划) ← plan_exercises → exercises (训练动作)
    ↓
workout_logs (训练日志)
    ↓
logged_sets (已记录组)

user_achievements (用户成就) ← profiles
```

## 🔒 安全特性

- **行级安全 (RLS)**: 确保用户只能访问自己的数据
- **类型检查**: 使用CHECK约束确保数据完整性
- **外键约束**: 维护数据关系的一致性
- **自动时间戳**: 自动记录创建和更新时间

## 📈 性能优化

- **索引**: 为常用查询字段创建了索引
- **生成列**: 使用计算列减少查询复杂度
- **触发器**: 自动维护时间戳和用户档案

---

*如果在初始化过程中遇到问题，请检查Supabase控制台的日志，或联系技术支持。* 