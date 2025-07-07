/**
 * 训练计划应用 - 基础类型定义
 * 
 * 这个文件定义了应用中使用的核心数据类型
 * 基于ERD设计的数据结构
 */

// 用户档案类型
export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  age?: number;
  gender?: string;
  height_cm?: number; // 身高 (cm)
  weight_kg?: number; // 体重 (kg)
  standing_reach_cm?: number; // 站立摸高 (cm)
  max_touch_height_cm?: number; // 最大摸高 (cm)
  vertical_jump_cm?: number; // 垂直跳跃 (cm) - 计算字段
  bench_press_kg?: number; // 卧推 (kg)
  squat_kg?: number; // 深蹲 (kg)
  deadlift_kg?: number; // 硬拉 (kg)
  target_touch_height_cm?: number; // 目标摸高 (cm)
  target_improvement_cm?: number; // 目标提升 (cm) - 计算字段
  updated_at?: string;
}

// 训练动作类型
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_group: string; // 目标肌群
  equipment?: string; // 所需器材
  video_url?: string; // 示范视频链接
}

// 训练计划类型
export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// 计划-动作关联类型
export interface PlanExercise {
  plan_id: string;
  exercise_id: string;
  target_sets: number; // 目标组数
  target_reps: number; // 目标次数
  notes?: string; // 备注
}

// 训练日志类型
export interface WorkoutLog {
  id: string;
  user_id: string;
  plan_id?: string; // 可选，可以记录非计划训练
  date: string;
  duration_minutes?: number; // 训练时长（分钟）
  notes?: string;
}

// 已记录组类型
export interface LoggedSet {
  id: string;
  log_id: string;
  exercise_id: string;
  set_number: number; // 第几组
  reps: number; // 实际次数
  weight_kg?: number; // 重量（公斤）
  notes?: string;
}

// 弹跳能力分析结果类型
export interface JumpAnalysis {
  current_jump: number; // 当前弹跳高度
  target_jump: number; // 目标弹跳高度
  improvement_needed: number; // 需要提升的高度
  strength_score: number; // 力量评分
  flexibility_score: number; // 柔韧性评分
  technique_score: number; // 技术评分
}

// 力量结构评估类型
export interface StrengthAssessment {
  upper_body: number; // 上肢力量
  lower_body: number; // 下肢力量
  core: number; // 核心力量
  overall_score: number; // 综合评分
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页参数类型
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

// 训练统计类型
export interface TrainingStats {
  total_workouts: number;
  total_duration: number;
  average_duration: number;
  favorite_exercises: string[];
  progress_trend: 'up' | 'down' | 'stable';
}

// 弹跳高度进展数据类型
export interface JumpProgressData {
  date: string;
  jump_height: number; // 弹跳高度 (cm)
  max_touch_height: number; // 最大摸高 (cm)
  target_height: number; // 目标高度 (cm)
}

// 训练进度数据类型
export interface TrainingProgressData {
  current_progress: number; // 当前进度百分比 (0-100)
  target_progress: number; // 目标进度百分比 (通常是100)
  days_trained: number; // 已训练天数
  total_days: number; // 总计划天数
  completion_rate: number; // 完成率 (0-1)
  streak_days: number; // 连续训练天数
}

// 进度统计类型
export interface ProgressStats {
  jump_progress: JumpProgressData[];
  training_progress: TrainingProgressData;
  weekly_stats: {
    week: number;
    workouts_completed: number;
    total_duration: number;
    average_jump_height: number;
  }[];
  monthly_comparison: {
    current_month: {
      workouts: number;
      avg_jump: number;
      improvement: number;
    };
    previous_month: {
      workouts: number;
      avg_jump: number;
      improvement: number;
    };
  };
} 