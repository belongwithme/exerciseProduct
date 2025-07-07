/**
 * 进度追踪演示数据
 * 
 * 这个文件包含了用于演示进度追踪功能的模拟数据
 */

import type { WorkoutLog, LoggedSet, JumpProgressData, TrainingProgressData } from '../types';

/**
 * 演示训练日志数据
 */
export const demoWorkoutLogs: WorkoutLog[] = [
  {
    id: '1',
    user_id: 'demo-user',
    plan_id: 'demo-plan-1',
    date: '2025-01-20',
    duration_minutes: 45,
    notes: '第一次训练，感觉不错'
  },
  {
    id: '2',
    user_id: 'demo-user',
    plan_id: 'demo-plan-1',
    date: '2025-01-22',
    duration_minutes: 50,
    notes: '深蹲感觉更有力了'
  },
  {
    id: '3',
    user_id: 'demo-user',
    plan_id: 'demo-plan-1',
    date: '2025-01-24',
    duration_minutes: 55,
    notes: '弹跳练习，感觉有进步'
  },
  {
    id: '4',
    user_id: 'demo-user',
    plan_id: 'demo-plan-1',
    date: '2025-01-26',
    duration_minutes: 48,
    notes: '力量训练，增加了重量'
  },
  {
    id: '5',
    user_id: 'demo-user',
    plan_id: 'demo-plan-1',
    date: '2025-01-28',
    duration_minutes: 52,
    notes: '爆发力训练，感觉很棒'
  },
  {
    id: '6',
    user_id: 'demo-user',
    plan_id: 'demo-plan-2',
    date: '2025-01-30',
    duration_minutes: 60,
    notes: '进入第二阶段，强度增加'
  },
  {
    id: '7',
    user_id: 'demo-user',
    plan_id: 'demo-plan-2',
    date: '2025-02-01',
    duration_minutes: 58,
    notes: '负重训练，感觉很有挑战'
  },
  {
    id: '8',
    user_id: 'demo-user',
    plan_id: 'demo-plan-2',
    date: '2025-02-03',
    duration_minutes: 55,
    notes: '弹跳高度明显提升'
  }
];

/**
 * 演示已记录组数据
 */
export const demoLoggedSets: LoggedSet[] = [
  // 第一次训练的组数据
  {
    id: '1-1',
    log_id: '1',
    exercise_id: 'squat',
    set_number: 1,
    reps: 12,
    weight_kg: 40,
    notes: '感觉轻松'
  },
  {
    id: '1-2',
    log_id: '1',
    exercise_id: 'squat',
    set_number: 2,
    reps: 10,
    weight_kg: 40,
    notes: '有点累了'
  },
  {
    id: '1-3',
    log_id: '1',
    exercise_id: 'squat',
    set_number: 3,
    reps: 8,
    weight_kg: 40,
    notes: '最后一组，坚持完成'
  },
  // 最新训练的组数据
  {
    id: '8-1',
    log_id: '8',
    exercise_id: 'squat',
    set_number: 1,
    reps: 10,
    weight_kg: 60,
    notes: '重量增加了'
  },
  {
    id: '8-2',
    log_id: '8',
    exercise_id: 'squat',
    set_number: 2,
    reps: 8,
    weight_kg: 60,
    notes: '感觉很有力量'
  },
  {
    id: '8-3',
    log_id: '8',
    exercise_id: 'squat',
    set_number: 3,
    reps: 6,
    weight_kg: 60,
    notes: '达到极限了'
  }
];

/**
 * 演示弹跳高度进展数据
 */
export const demoJumpProgressData: JumpProgressData[] = [
  {
    date: '2025-01-20',
    jump_height: 50.0,
    max_touch_height: 285.0,
    target_height: 70.0
  },
  {
    date: '2025-01-22',
    jump_height: 50.5,
    max_touch_height: 285.5,
    target_height: 70.0
  },
  {
    date: '2025-01-24',
    jump_height: 51.2,
    max_touch_height: 286.2,
    target_height: 70.0
  },
  {
    date: '2025-01-26',
    jump_height: 51.8,
    max_touch_height: 286.8,
    target_height: 70.0
  },
  {
    date: '2025-01-28',
    jump_height: 52.5,
    max_touch_height: 287.5,
    target_height: 70.0
  },
  {
    date: '2025-01-30',
    jump_height: 53.1,
    max_touch_height: 288.1,
    target_height: 70.0
  },
  {
    date: '2025-02-01',
    jump_height: 53.8,
    max_touch_height: 288.8,
    target_height: 70.0
  },
  {
    date: '2025-02-03',
    jump_height: 54.5,
    max_touch_height: 289.5,
    target_height: 70.0
  }
];

/**
 * 演示训练进度数据
 */
export const demoTrainingProgressData: TrainingProgressData = {
  current_progress: 35.2,
  target_progress: 100,
  days_trained: 8,
  total_days: 90,
  completion_rate: 0.089,
  streak_days: 5
};

/**
 * 生成指定天数的随机训练日志
 * @param days 天数
 * @param startDate 开始日期
 * @returns 训练日志数组
 */
export function generateRandomWorkoutLogs(days: number, startDate: Date = new Date()): WorkoutLog[] {
  const logs: WorkoutLog[] = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    // 不是每天都训练，大约70%的概率
    if (Math.random() > 0.3) {
      logs.push({
        id: `generated-${i}`,
        user_id: 'demo-user',
        plan_id: `demo-plan-${Math.floor(i / 10) + 1}`,
        date: currentDate.toISOString().split('T')[0],
        duration_minutes: Math.floor(Math.random() * 30) + 40, // 40-70分钟
        notes: `第${i + 1}次训练`
      });
    }
    
    // 向前推进一天
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return logs;
}

/**
 * 生成随机弹跳进展数据
 * @param workoutLogs 训练日志
 * @param baseHeight 基础弹跳高度
 * @param targetHeight 目标弹跳高度
 * @returns 弹跳进展数据数组
 */
export function generateRandomJumpProgress(
  workoutLogs: WorkoutLog[], 
  baseHeight: number = 45, 
  targetHeight: number = 70
): JumpProgressData[] {
  const progressData: JumpProgressData[] = [];
  let currentHeight = baseHeight;
  
  workoutLogs.forEach((log, index) => {
    // 每次训练随机提升0.2-0.8cm
    const improvement = Math.random() * 0.6 + 0.2;
    currentHeight += improvement;
    
    // 添加一些随机波动
    const fluctuation = (Math.random() - 0.5) * 0.4;
    const finalHeight = currentHeight + fluctuation;
    
    progressData.push({
      date: log.date,
      jump_height: Math.round(finalHeight * 10) / 10,
      max_touch_height: Math.round((finalHeight + 235) * 10) / 10, // 假设站立摸高235cm
      target_height: targetHeight
    });
  });
  
  return progressData;
}

/**
 * 生成随机训练进度数据
 * @param workoutLogs 训练日志
 * @param totalDays 计划总天数
 * @returns 训练进度数据
 */
export function generateRandomTrainingProgress(
  workoutLogs: WorkoutLog[], 
  totalDays: number = 90
): TrainingProgressData {
  const daysTrained = workoutLogs.length;
  const completionRate = daysTrained / totalDays;
  
  // 计算当前进度（基于时间和质量）
  const timeProgress = (daysTrained / totalDays) * 100;
  const qualityBonus = Math.random() * 10; // 质量加成
  const currentProgress = Math.min(timeProgress + qualityBonus, 100);
  
  // 计算连续训练天数
  const sortedLogs = workoutLogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streakDays = 0;
  let currentDate = new Date();
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= streakDays + 2) { // 允许间隔一天
      streakDays++;
      currentDate = logDate;
    } else {
      break;
    }
  }
  
  return {
    current_progress: Math.round(currentProgress * 10) / 10,
    target_progress: 100,
    days_trained: daysTrained,
    total_days: totalDays,
    completion_rate: Math.round(completionRate * 100) / 100,
    streak_days: Math.min(streakDays, daysTrained)
  };
} 