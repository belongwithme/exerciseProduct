# 数据库初始化指南

本目录包含训练计划应用的完整数据库结构和初始化脚本。

## 📁 文件说明

- `schema.sql` - 数据库表结构定义
- `rls-policies.sql` - 行级安全策略
- `seed-data.sql` - 初始数据（系统预设训练动作）
- `epic1-upgrade.sql` - Epic 1 数据库升级脚本（MVP 0.2.1）
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

## 🔄 Epic 1 升级指南（MVP 0.2.1）

如果您已经有一个运行中的数据库（基于初始schema.sql），您需要执行Epic 1升级来支持新功能：

### 执行Epic 1升级脚本

1. **备份现有数据**（强烈推荐）
   - 在Supabase控制台的Settings > Database页面
   - 创建数据库备份或导出重要数据

2. **执行升级脚本**
   - 复制 `epic1-upgrade.sql` 文件的全部内容
   - 在SQL编辑器中粘贴并执行
   - 等待执行完成

3. **验证升级结果**
   - 检查以下表是否包含新字段：
     * `exercises` 表：新增 `type` 字段，`difficulty_level` 改为TEXT类型
     * `workout_logs` 表：新增 `status`, `mood`, `plan_version_id` 字段
     * `workout_plans` 表：新增 `version` 字段
   - 检查新表：
     * `workout_plan_versions` 表已创建
   - 检查新视图：
     * `training_calendar_summary` 视图已创建

### Epic 1 升级包含的功能

✅ **Task 1.1** - exercises表字段升级：
- 添加 `type` 字段（动作类型：力量/有氧/柔韧性等）
- 将 `difficulty_level` 从INTEGER改为TEXT（初级/中级/高级）

✅ **Task 1.2** - workout_logs表字段添加：
- 添加 `status` 字段（训练状态：状态良好/疲劳/低效率等）
- 添加 `mood` 字段（训练感受/情绪）

✅ **Task 1.3** - 创建workout_plan_versions表：
- 存储训练计划的版本快照
- 支持计划版本管理和历史追溯

✅ **Task 1.4** - workout_logs表添加关联字段：
- 添加 `plan_version_id` 字段，关联到特定计划版本

✅ **Task 1.5** - workout_plans表版本字段：
- 添加 `version` 字段，跟踪当前版本号

✅ **Task 1.6** - 创建日历聚合视图：
- `training_calendar_summary` 视图，优化日历查询性能

✅ **Task 1.7** - 性能优化索引：
- 为高频查询添加复合索引
- 优化多维度筛选性能

✅ **Task 1.8** - 行级安全策略：
- 为新表配置RLS策略
- 确保数据安全和用户隔离

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
- ✅ `exercises` - 训练动作表（已升级：包含type和difficulty_level字段）
- ✅ `workout_plans` - 训练计划表（已升级：包含version字段）
- ✅ `plan_exercises` - 计划-动作关联表
- ✅ `workout_logs` - 训练日志表（已升级：包含status, mood, plan_version_id字段）
- ✅ `logged_sets` - 已记录组表
- ✅ `user_achievements` - 用户成就表
- ✅ `workout_plan_versions` - 训练计划版本表（新增）

### 视图
- ✅ `training_calendar_summary` - 训练日历聚合视图（新增）

### 数据验证
1. 检查 `exercises` 表是否包含20个系统预设动作
2. 确保所有表都启用了RLS（Row Level Security）
3. 验证外键关系是否正确建立
4. 测试新字段和视图是否可正常访问

## 🔧 故障排除

### 常见问题

1. **权限错误**
   - 确保您是项目的所有者或管理员
   - 检查是否有足够的权限执行DDL语句

2. **表已存在错误**
   - Epic 1升级脚本使用 `IF NOT EXISTS` 和 `IF EXISTS` 检查，通常不会出现此问题
   - 如果遇到冲突，请检查是否已执行过升级脚本

3. **外键约束错误**
   - 确保按照正确的顺序执行SQL文件
   - 先创建被引用的表，再创建引用其他表的表

4. **RLS策略错误**
   - 确保在设置RLS策略之前表已经存在
   - 检查策略中引用的函数是否可用

5. **Epic 1升级失败**
   - 检查现有数据库是否基于标准的schema.sql创建
   - 确保有足够的权限执行ALTER TABLE语句
   - 如果数据迁移失败，请先备份数据

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
    ↓                                            ↓
workout_plan_versions (计划版本) ←─── plan_version_id
    ↓
workout_logs (训练日志)
    ↓
logged_sets (已记录组)

user_achievements (用户成就) ← profiles

training_calendar_summary (日历视图) ← workout_logs
```

## 🔒 安全特性

- **行级安全 (RLS)**: 确保用户只能访问自己的数据
- **类型检查**: 使用CHECK约束确保数据完整性
- **外键约束**: 维护数据关系的一致性
- **自动时间戳**: 自动记录创建和更新时间

## 📈 性能优化

- **索引**: 为常用查询字段创建了索引（Epic 1新增多个复合索引）
- **生成列**: 使用计算列减少查询复杂度
- **触发器**: 自动维护时间戳和用户档案
- **视图**: 预聚合日历数据，提升查询性能

## 🎯 版本历史

- **v1.0** - 初始数据库结构（MVP 0.1）
- **v1.1** - Epic 1升级（MVP 0.2.1）
  - 扩展exercises表结构
  - 增强workout_logs表功能
  - 新增计划版本管理
  - 添加日历聚合视图
  - 性能和安全优化

---

*如果在初始化过程中遇到问题，请检查Supabase控制台的日志，或联系技术支持。* 