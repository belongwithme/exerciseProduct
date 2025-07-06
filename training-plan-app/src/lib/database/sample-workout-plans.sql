-- 示例训练计划数据
-- 这个文件包含了多阶段训练计划的示例数据
-- 注意：这些数据使用的是示例 user_id，实际使用时需要替换为真实的用户ID

-- 假设我们有一个用户ID (实际使用时需要替换)
-- 你可以通过 Supabase 控制台或应用程序获取真实的用户ID

-- 第一阶段：基础重建
INSERT INTO public.workout_plans (user_id, name, description, plan_type, difficulty_level, duration_weeks, sessions_per_week, is_public) VALUES
('00000000-0000-0000-0000-000000000000', '第一阶段：基础重建', 
'建立基础力量和稳定性，为后续训练做准备。重点关注基础动作模式的掌握和身体控制能力的提升。', 
'strength', 2, 4, 3, false);

-- 第二阶段：力量发展  
INSERT INTO public.workout_plans (user_id, name, description, plan_type, difficulty_level, duration_weeks, sessions_per_week, is_public) VALUES
('00000000-0000-0000-0000-000000000000', '第二阶段：力量发展', 
'在基础稳定的前提下，重点发展最大力量。通过渐进式负荷增加，提升整体力量水平。', 
'strength', 3, 6, 4, false);

-- 第三阶段：爆发力提升
INSERT INTO public.workout_plans (user_id, name, description, plan_type, difficulty_level, duration_weeks, sessions_per_week, is_public) VALUES
('00000000-0000-0000-0000-000000000000', '第三阶段：爆发力提升', 
'将力量转化为爆发力，重点训练快速力量输出。结合弹跳训练，提升垂直跳跃能力。', 
'plyometric', 4, 8, 4, false);

-- 为第一阶段添加训练动作
-- 获取第一阶段计划的ID (这里使用子查询)
INSERT INTO public.plan_exercises (plan_id, exercise_id, target_sets, target_reps, notes, order_index) VALUES
-- 深蹲
((SELECT id FROM public.workout_plans WHERE name = '第一阶段：基础重建' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '深蹲' LIMIT 1), 
 3, '8-12', '重点关注动作质量，不要追求重量', 1),

-- 俯卧撑
((SELECT id FROM public.workout_plans WHERE name = '第一阶段：基础重建' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '俯卧撑' LIMIT 1), 
 3, '10-15', '如果标准俯卧撑困难，可以从跪姿开始', 2),

-- 平板支撑
((SELECT id FROM public.workout_plans WHERE name = '第一阶段：基础重建' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '平板支撑' LIMIT 1), 
 3, '30-60秒', '保持身体一条直线，避免塌腰', 3),

-- 保加利亚分腿蹲
((SELECT id FROM public.workout_plans WHERE name = '第一阶段：基础重建' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '保加利亚分腿蹲' LIMIT 1), 
 3, '6-10', '每侧腿，重点训练单腿稳定性', 4);

-- 为第二阶段添加训练动作
INSERT INTO public.plan_exercises (plan_id, exercise_id, target_sets, target_reps, notes, order_index) VALUES
-- 深蹲 (增加负重)
((SELECT id FROM public.workout_plans WHERE name = '第二阶段：力量发展' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '深蹲' LIMIT 1), 
 4, '5-8', '增加负重，重点发展最大力量', 1),

-- 卧推
((SELECT id FROM public.workout_plans WHERE name = '第二阶段：力量发展' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '卧推' LIMIT 1), 
 4, '5-8', '渐进式增加重量，注意安全', 2),

-- 引体向上
((SELECT id FROM public.workout_plans WHERE name = '第二阶段：力量发展' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '引体向上' LIMIT 1), 
 3, '3-8', '如需要可使用弹力带辅助', 3),

-- 杠铃划船
((SELECT id FROM public.workout_plans WHERE name = '第二阶段：力量发展' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '杠铃划船' LIMIT 1), 
 4, '6-10', '保持背部挺直，专注于肩胛骨收缩', 4),

-- 肩上推举
((SELECT id FROM public.workout_plans WHERE name = '第二阶段：力量发展' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '肩上推举' LIMIT 1), 
 3, '6-10', '核心保持稳定，避免弓背', 5);

-- 为第三阶段添加训练动作
INSERT INTO public.plan_exercises (plan_id, exercise_id, target_sets, target_reps, notes, order_index) VALUES
-- 深蹲跳
((SELECT id FROM public.workout_plans WHERE name = '第三阶段：爆发力提升' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '深蹲跳' LIMIT 1), 
 4, '5-8', '专注于向上的爆发力，轻柔落地', 1),

-- 箱式跳跃
((SELECT id FROM public.workout_plans WHERE name = '第三阶段：爆发力提升' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '箱式跳跃' LIMIT 1), 
 3, '3-5', '选择适合的箱子高度，确保安全', 2),

-- 波比跳
((SELECT id FROM public.workout_plans WHERE name = '第三阶段：爆发力提升' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '波比跳' LIMIT 1), 
 3, '8-12', '高强度动作，注意休息间隔', 3),

-- 立定跳远
((SELECT id FROM public.workout_plans WHERE name = '第三阶段：爆发力提升' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '立定跳远' LIMIT 1), 
 3, '3-5', '充分摆臂，专注于水平爆发力', 4),

-- 单腿深蹲
((SELECT id FROM public.workout_plans WHERE name = '第三阶段：爆发力提升' LIMIT 1), 
 (SELECT id FROM public.exercises WHERE name = '单腿深蹲' LIMIT 1), 
 2, '3-5', '每侧腿，高难度动作，循序渐进', 5);

-- 插入完成后的提示
-- 注意：运行此脚本前，请确保：
-- 1. 已经有用户注册并登录
-- 2. 将上面的 '00000000-0000-0000-0000-000000000000' 替换为真实的用户ID
-- 3. 确保 exercises 表中已经有对应的动作数据

-- 查询用户ID的方法：
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com'; 