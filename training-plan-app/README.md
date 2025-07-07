# 训练计划管理系统

一个专业的训练计划管理应用，专注于弹跳训练、力量分析和进度追踪。

## 🏋️‍♂️ 项目特色

- **弹跳训练专业化**：专门针对弹跳能力提升的训练计划
- **力量结构分析**：全面的力量评估和可视化展示
- **进度追踪**：详细的训练记录和进度可视化
- **个人资料管理**：身体数据管理和能力分析
- **响应式设计**：支持移动端和桌面端

## 🛠️ 技术栈

- **前端框架**：SvelteKit 1.20.4
- **样式框架**：Tailwind CSS 3.3.0
- **开发语言**：TypeScript 5.0.0
- **构建工具**：Vite 4.4.2
- **数据库**：Supabase（计划中）
- **部署平台**：Vercel（计划中）

## 📁 项目结构

```
training-plan-app/
├── src/
│   ├── lib/
│   │   ├── components/     # 可复用组件
│   │   ├── stores/         # 状态管理
│   │   ├── utils/          # 工具函数
│   │   └── types/          # TypeScript类型定义
│   ├── routes/             # 页面路由
│   ├── app.css             # 全局样式
│   ├── app.html            # HTML模板
│   └── ...
├── static/                 # 静态资源
├── package.json            # 项目依赖
├── tailwind.config.js      # Tailwind配置
├── tsconfig.json           # TypeScript配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.14.1
- npm >= 8.5.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📋 开发进度

### ✅ 已完成

- [x] 项目初始化
- [x] SvelteKit项目创建
- [x] Tailwind CSS配置
- [x] TypeScript支持
- [x] 项目结构设置
- [x] 基础类型定义
- [x] 工具函数库

### 🔄 进行中

- [ ] 数据库配置（Supabase）
- [ ] 用户认证系统
- [ ] 基础UI组件

### 📝 待开发

- [ ] 数据库结构建立
- [ ] 用户认证与资料管理
- [ ] 数据分析与可视化
- [ ] 训练计划与记录
- [ ] 工具箱功能
- [ ] API端点开发

## 🎯 核心功能

### 1. 用户管理
- 用户注册/登录
- 个人资料管理
- 身体数据录入

### 2. 训练计划
- 多阶段训练计划
- 自定义训练动作
- 训练计划分享

### 3. 数据分析
- 弹跳能力分析（甜甜圈图）
- 力量结构评估（雷达图）
- 训练进度追踪（折线图）

### 4. 训练记录
- 每日训练记录
- 训练数据统计
- 历史记录查看

### 5. 工具箱
- 弹跳计算器
- 训练计时器
- 数据导出功能

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目地址：[GitHub Repository](https://github.com/your-username/training-plan-app)
- 问题反馈：[Issues](https://github.com/your-username/training-plan-app/issues)

---

**注意**：本项目目前处于MVP开发阶段，功能正在逐步完善中。
