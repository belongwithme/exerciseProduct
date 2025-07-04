# 环境配置指南

## 错误说明

如果您看到以下错误：
```
Supabase URL and Anon Key are required. Make sure your .env file is configured correctly with PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.
```

这表示您需要配置Supabase环境变量。

## 解决步骤

### 1. 创建 .env 文件

在项目根目录（training-plan-app/）下创建 `.env` 文件：

```bash
# 在 training-plan-app 目录下
touch .env
```

### 2. 配置环境变量

在 `.env` 文件中添加以下内容：

```env
# Supabase 配置
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 获取 Supabase 配置信息

1. **登录 Supabase 控制台**：https://supabase.com/dashboard
2. **选择您的项目**（或创建新项目）
3. **进入 Settings > API**
4. **复制以下信息**：
   - **Project URL** → 用作 `PUBLIC_SUPABASE_URL`
   - **anon public** key → 用作 `PUBLIC_SUPABASE_ANON_KEY`

### 4. 示例配置

```env
# 示例（请替换为您的实际值）
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. 重启开发服务器

配置完成后，重启开发服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

## 注意事项

1. **安全性**：`.env` 文件已被添加到 `.gitignore`，不会被提交到版本控制
2. **公开变量**：以 `PUBLIC_` 开头的变量会被包含在客户端代码中
3. **生产环境**：在部署时，需要在部署平台设置这些环境变量

## 如果您还没有 Supabase 项目

### 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 创建新项目：
   - 输入项目名称
   - 设置数据库密码
   - 选择地区（建议选择离您最近的）
5. 等待项目创建完成（约2分钟）

### 设置数据库表

项目创建完成后，您需要执行数据库初始化脚本来创建必要的表结构：

1. **打开 Supabase SQL 编辑器**：
   - 在项目控制台中，点击左侧菜单的 "SQL Editor"
   - 选择 "New query"

2. **执行数据库初始化脚本**：
   - 复制 `src/lib/database/schema.sql` 文件的内容
   - 粘贴到 SQL 编辑器中
   - 点击 "Run" 按钮执行

3. **执行 RLS 安全策略**：
   - 复制 `src/lib/database/rls-policies.sql` 文件的内容
   - 粘贴到 SQL 编辑器中
   - 点击 "Run" 按钮执行

4. **可选：添加示例数据**：
   - 复制 `src/lib/database/seed-data.sql` 文件的内容
   - 粘贴到 SQL 编辑器中
   - 点击 "Run" 按钮执行

**注意**：这些步骤会创建完整的数据库结构，包括用户档案、训练计划、训练记录等表。

## 故障排除

### 常见问题

1. **环境变量未生效**：确保重启了开发服务器
2. **URL格式错误**：确保URL以 `https://` 开头
3. **密钥格式错误**：确保复制了完整的anon key

### 验证配置

可以在浏览器控制台中验证环境变量是否正确加载：

```javascript
console.log(import.meta.env.PUBLIC_SUPABASE_URL);
console.log(import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
```

如果显示 `undefined`，说明环境变量没有正确配置。

---

配置完成后，您就可以正常使用个人资料管理功能了！ 