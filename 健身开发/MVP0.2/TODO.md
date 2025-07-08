# ✅ 综合训练追踪平台 (MVP 0.2.1) - Todolist

本文档基于 PRD v0.2.1 和 ERD v0.2.1 生成，旨在为开发团队提供一份清晰、可执行的任务清单。

**技术栈:**
*   **后端/数据库:** Supabase (PostgreSQL)
*   **前端:** SvelteKit



## 🏛️ **Epic 1: 基础架构与数据库升级 (Infrastructure & DB)**

**目标:** 更新数据库 Schema，为所有新功能提供数据层支持。

-   [x] **Task 1.1 (DB):** 在 `exercises` 表中添加 `difficulty_level` (TEXT) 和 `type` (TEXT) 字段.
    -   *注:* 建议使用 PostgreSQL 的 `ENUM` 类型或在应用层添加校验规则以保证数据一致性。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 添加了type字段，并将difficulty_level从INTEGER改为TEXT类型
-   [x] **Task 1.2 (DB):** 在 `workout_logs` 表中添加 `status` (TEXT) 和 `mood` (TEXT) 字段。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 添加了status和mood字段，支持训练状态和情绪记录
-   [x] **Task 1.3 (DB):** 创建新表 `workout_plan_versions` (`id`, `plan_id`, `version_number`, `created_at`, `content`)。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 创建了完整的计划版本表，支持JSONB内容存储
-   [x] **Task 1.4 (DB):** 在 `workout_logs` 表中添加核心外键字段 `plan_version_id` (BIGINT, FK to `workout_plan_versions.id`)。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 添加了关联字段，实现训练日志与计划版本的精确绑定
-   [x] **Task 1.5 (DB):** 在 `workout_plans` 表中添加 `version` (INTEGER) 字段，用于指向当前最新版本号。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 添加了version字段，默认值为1
-   [x] **Task 1.6 (DB):** 创建 SQL 视图 `training_calendar_summary` 以预聚合日历数据。
    -   *注:* 视图应包含 `user_id`, `date`, `log_count`, `status_summary`, `mood_summary`，并内置 `user_id` 过滤。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 创建了完整的日历聚合视图，包含所有必要字段
-   [x] **Task 1.7 (DB):** 为高频查询和新功能添加推荐的数据库索引:
    -   [x] `workout_logs` 表: `(user_id, date)`
    -   [x] `workout_logs` 表: `plan_version_id`
    -   [x] `exercises` 表: `(muscle_group, difficulty_level, type)`
    -   [x] `workout_plan_versions` 表: `(plan_id, version_number)`
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 添加了所有推荐的复合索引
-   [x] **Task 1.8 (DB):** 为所有新增的表和视图配置行级安全 (RLS) 策略，确保用户数据隔离。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 为workout_plan_versions表配置了完整的RLS策略

---

## 🏋️ **Epic 2: 训练动作库扩展 (Exercise Library Enhancement)**

**目标:** 增强动作信息结构，提升筛选能力。

-   [x] **Task 2.1 (BE):** 更新 Supabase API (或创建 RPC 函数)，允许在获取 `exercises` 列表时进行多维度组合筛选 (按 `muscle_group`, `equipment`, `difficulty_level`, `type`)。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 创建了/api/exercises端点，支持多维度筛选和分页功能
-   [x] **Task 2.2 (FE):** 在动作库页面，实现支持多维度筛选的用户界面 (例如，使用下拉菜单、复选框组)。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 创建了动作库页面(/exercises)，包含下拉菜单筛选器和搜索功能
-   [x] **Task 2.3 (FE):** 更新动作详情页或卡片，以展示新增的 `difficulty_level` 和 `type` 字段。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 在动作卡片和详情模态框中显示新字段，并添加彩色标签
-   [x] **Task 2.4 (FE):** (未来规划) 在 UI 上为"用户自定义动作"功能预留一个明确的入口或按钮。
    -   *✅ 完成:* 2025-01-27 by AI Assistant - 在动作库页面预留了"自定义动作"按钮，标记为即将推出

---

## ✍️ **Epic 3: 训练日志高级功能 (Advanced Workout Logging)**

**目标:** 提高训练记录效率，并丰富数据维度。

-   [x] **Task 3.1 (BE):** 创建一个新的 Supabase RPC 函数来实现"一键复制上次训练"功能。
    -   *注:* 该函数接收一个历史 `log_id`，查询其关联的 `logged_sets`，并返回一个可用于填充新日志的动作和组数模板。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 创建了 `copy_workout_from_log` RPC 函数，并添加了 RLS 安全策略。
-   [x] **Task 3.2 (FE):** 在创建新日志的流程中，添加"复制上次训练"按钮，并集成后端的 RPC 函数。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 重构了日志记录组件，支持多动作表单，并集成了复制功能。
-   [x] **Task 3.3 (FE):** 在日志记录界面，实现已记录组（sets）的拖拽排序功能。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 使用 svelte-dnd-action 为组实现了拖拽排序。注意：开发环境可能需要重启以识别新安装的依赖包。
-   [x] **Task 3.4 (FE):** 在完成/保存日志的页面，添加表单元素，允许用户选择 `status`（状态良好/疲劳/低效率）和输入 `mood` (支持 Emoji)。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 在日志表单中添加了状态和心情字段。
-   [x] **Task 3.5 (FE):** 更新提交训练日志的函数，将 `status`, `mood`, 以及关键的 `plan_version_id` (如果适用) 数据一并发送到后端。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 更新了日志提交逻辑，使其能从 URL 参数读取并保存 `plan_version_id`。

---

## 📦 **Epic 4: 训练计划版本管理 (Workout Plan Versioning)**

**目标:** 精准追踪训练计划的修改历史，并提供追溯与恢复能力。

-   [x] **Task 4.1 (BE):** 实现计划保存时的版本快照逻辑。建议使用单个 RPC 函数 `create_plan_version` 来封装此事务。
    -   *注:* 此函数应：1. 将当前计划内容打包成 JSON；2. 在 `workout_plan_versions` 中创建新记录；3. 更新 `workout_plans` 表中的 `version` 字段。
    -   *✅ 完成:* 2025-07-08 by AI Assistant - 创建了 `create_plan_version` RPC 函数，用于原子化地创建计划版本快照。
-   [x] **Task 4.2 (BE):** 实现 **GET `/api/plans/:plan_id/versions`** 接口，获取指定计划的所有历史版本列表 (仅需 `id`, `version_number`, `created_at`)。
    -   *✅ 完成:* 2025-07-08 by AI Assistant - 创建了 GET `/api/plans/[plan_id]/versions` SvelteKit API 路由.
-   [x] **Task 4.3 (BE):** 实现 **GET `/api/plans/:plan_id/versions/:version_number`** 接口，获取特定版本详情 (返回 `content` JSONB)。
    -   *✅ 完成:* 2025-07-08 by AI Assistant - 创建了 GET `/api/plans/[plan_id]/versions/[version_number]` SvelteKit API 路由.
-   [x] **Task 4.4 (BE):** 创建一个 RPC 函数 `revert_to_plan_version` 来处理"一键恢复"逻辑。
    -   *✅ 完成:* 2025-07-08 by AI Assistant - 创建了 `revert_to_plan_version` RPC 函数，实现版本恢复功能，包含备份和恢复逻辑.
-   [x] **Task 4.5 (FE):** 在计划编辑页面，修改"保存"按钮的逻辑，调用 `create_plan_version` 函数。
    -   *✅ 完成:* 2025-07-08 by AI Assistant - 修改了 PlanFormModal 组件的保存逻辑，集成版本快照创建功能.
-   [x] **Task 4.6 (FE):** 创建"历史版本"页面或模态框，调用接口展示版本列表。
    -   *✅ 完成:* 2025-07-08 by AI Assistant - 创建了 PlanVersionHistoryModal 组件，并集成到计划列表页面，支持查看和恢复版本.
-   [x] **Task 4.7 (FE):** 在历史版本列表中，为每个版本提供"恢复"和"对比"按钮。
    -   *✅ 完成:* 2025-07-08 by AI Assistant - 在版本历史模态框中实现了恢复和对比模式功能.
-   [x] **Task 4.8 (FE):** 实现 **并排高亮对比** 视图。
    -   *注:* 当用户选择对比两个版本时，获取它们各自的 `content` JSON，在 UI 上并排渲染。通过 JavaScript 检测差异（动作、组数、次数等），并用不同背景色高亮。
    -   *✅ 完成:* 2025-07-08 by AI Assistant - 创建了 PlanVersionCompareModal 组件，实现了并排对比视图和差异高亮显示.

---

## 🗓️ **Epic 5: 打卡与增强型日历视图 (Check-in & Calendar View)**

**目标:** 通过强化的视觉反馈和数据追溯，帮助用户建立训练习惯。

-   [x] **Task 5.1 (BE):** 确保 `training_calendar_summary` 视图已创建并能通过 API 高效访问。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 创建了 `/api/calendar-summary` API端点，支持月度筛选和数据聚合
-   [x] **Task 5.2 (BE):** 创建 RPC 函数 `get_streak_days` 用于计算用户的"连续打卡天数"。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 创建了 `/api/streak-days` API端点，支持RPC函数调用和客户端计算
-   [x] **Task 5.3 (FE):** 实现月度日历视图组件。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 创建了 `CalendarView.svelte` 组件，支持月度视图和响应式设计
-   [x] **Task 5.4 (FE):** 集成 API，根据 `training_calendar_summary` 的数据渲染日历：
    -   [x] 使用颜色深浅（热力图）标记训练强度/容量。
    -   [x] 添加彩色圆点/图标来直观展示当天的主要 `status`。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 实现了热力图效果和状态指示器，支持绿色深浅标记强度
-   [x] **Task 5.5 (FE):** 实现日历单元格的点击交互，弹出浮层或侧边栏显示当日训练摘要。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 创建了 `DayDetailModal.svelte` 组件，显示详细训练信息
-   [x] **Task 5.6 (FE):** 在主页或仪表盘上，调用 `get_streak_days` 函数并展示"连续打卡天数"。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 更新了主页统计数据，集成连续打卡天数显示
-   [x] **Task 5.7 (FE):** 设计并实现当连续打卡中断时的友好提示和鼓励信息。
    -   *✅ 完成:* 2025-01-28 by AI Assistant - 创建了StreakNotification组件，实现智能检测连续打卡状态并提供个性化鼓励信息，集成到主页和日历页面

---

## 🧠 **Epic 6: 疲劳趋势分析与休息建议 (Fatigue Analysis)**

**目标:** 结合客观数据与主观感受，提供更精准的疲劳评估和主动休息建议。

-   [ ] **Task 6.1 (BE):** 设计并实现 **智能疲劳指数算法**，推荐封装为 PostgreSQL 函数并通过 RPC 调用。
    -   *注:* 函数需查询过去 7 天的 `workout_logs`，计算客观负荷（频率、总容量、时长），并结合 `status` 和 `mood` 计算主观评分，最后根据权重公式得出指数。
-   [ ] **Task 6.2 (BE):** 实现 **GET `/api/fatigue-index`** 的 RPC 函数，返回当前疲劳指数、历史趋势数据以及基于指数的建议文本。
-   [ ] **Task 6.3 (FE):** 在用户仪表盘上，创建一个新组件来展示"疲劳指数"（例如，使用仪表盘图或数字）。
-   [ ] **Task 6.4 (FE):** 在疲劳指数组件中，使用图表库 (e.g., Chart.js, Recharts) 展示指数的历史趋势变化。
-   [ ] **Task 6.5 (FE):** 实现主动提醒功能：若从 API 获取的指数超过阈值 (如 >80)，则弹出一个模态框或通知，显示系统生成的休息建议。

---

## ✨ **Epic 7: 非功能性需求 (Non-Functional Requirements)**

-   [ ] **Task 7.1 (FE/UX):** 为所有新增的视觉元素（日历状态点、版本对比高亮、疲劳指数仪表盘）添加平滑、优雅的动画效果。
-   [ ] **Task 7.2 (FE/UX):** 设计并实现关键时刻的激励性 UI 反馈（如连续打卡天数增加、打破个人记录时）。
-   [ ] **Task 7.3 (FE/CSS):** 确保所有新页面和组件在移动端和桌面端都具有完全的响应式设计和良好的交互体验。
-   [ ] **Task 7.4 (Testing):** 为所有新的后端 RPC 函数编写单元/集成测试，确保逻辑的正确性和稳定性。 