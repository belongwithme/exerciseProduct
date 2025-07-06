/**
 * 进度追踪工具函数
 * 
 * 这个文件包含了用于计算和分析训练进度的各种算法
 */

import type { 
  Profile, 
  WorkoutLog, 
  LoggedSet, 
  JumpProgressData, 
  TrainingProgressData,
  ProgressStats 
} from '../types';

/**
 * 计算弹跳高度进展数据
 * @param profile 用户档案
 * @param workoutLogs 训练日志数组
 * @returns 弹跳高度进展数据数组
 */
export function calculateJumpProgress(
  profile: Profile, 
  workoutLogs: WorkoutLog[]
): JumpProgressData[] {
  const {
    standing_reach_cm = 0,
    max_touch_height_cm = 0,
    target_touch_height_cm = 0
  } = profile;

  // 基础弹跳高度
  const baseJumpHeight = max_touch_height_cm - standing_reach_cm;
  const targetJumpHeight = target_touch_height_cm - standing_reach_cm;

  // 按日期排序训练日志
  const sortedLogs = workoutLogs
    .filter(log => log.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const progressData: JumpProgressData[] = [];

  // 计算每次训练后的预估弹跳高度提升
  let currentJumpHeight = baseJumpHeight;
  const improvementRate = 0.5; // 每次训练平均提升0.5cm（可调整）

  sortedLogs.forEach((log, index) => {
    // 根据训练强度和持续时间计算提升量
    const durationFactor = Math.min((log.duration_minutes || 60) / 60, 1.5);
    const improvement = improvementRate * durationFactor;
    
    currentJumpHeight += improvement;
    
    // 确保不超过目标高度太多
    const maxReasonableHeight = targetJumpHeight * 1.2;
    currentJumpHeight = Math.min(currentJumpHeight, maxReasonableHeight);

    progressData.push({
      date: log.date,
      jump_height: Math.round(currentJumpHeight * 10) / 10, // 保留一位小数
      max_touch_height: Math.round((currentJumpHeight + standing_reach_cm) * 10) / 10,
      target_height: targetJumpHeight
    });
  });

  return progressData;
}

/**
 * 计算训练进度数据
 * @param profile 用户档案
 * @param workoutLogs 训练日志数组
 * @param planDuration 计划总天数（可选）
 * @returns 训练进度数据
 */
export function calculateTrainingProgress(
  profile: Profile,
  workoutLogs: WorkoutLog[],
  planDuration: number = 90 // 默认90天计划
): TrainingProgressData {
  const {
    max_touch_height_cm = 0,
    target_touch_height_cm = 0
  } = profile;

  // 计算基础数据
  const totalDays = planDuration;
  const daysTrained = workoutLogs.length;
  const completionRate = totalDays > 0 ? daysTrained / totalDays : 0;

  // 计算当前进度百分比（基于弹跳高度和训练天数）
  const heightProgress = target_touch_height_cm > max_touch_height_cm 
    ? Math.min(((max_touch_height_cm - (profile.standing_reach_cm || 0)) / 
               (target_touch_height_cm - (profile.standing_reach_cm || 0))) * 100, 100)
    : 100;

  const timeProgress = (daysTrained / totalDays) * 100;
  const currentProgress = Math.round((heightProgress * 0.7 + timeProgress * 0.3) * 10) / 10;

  // 计算连续训练天数
  const streakDays = calculateStreakDays(workoutLogs);

  return {
    current_progress: Math.min(currentProgress, 100),
    target_progress: 100,
    days_trained: daysTrained,
    total_days: totalDays,
    completion_rate: Math.round(completionRate * 100) / 100,
    streak_days: streakDays
  };
}

/**
 * 计算连续训练天数
 * @param workoutLogs 训练日志数组
 * @returns 连续训练天数
 */
export function calculateStreakDays(workoutLogs: WorkoutLog[]): number {
  if (workoutLogs.length === 0) return 0;

  // 按日期排序（最新的在前）
  const sortedLogs = workoutLogs
    .filter(log => log.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  let currentDate = new Date();
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= streak + 1) {
      streak++;
      currentDate = logDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * 计算周统计数据
 * @param workoutLogs 训练日志数组
 * @param loggedSets 已记录组数据
 * @returns 周统计数据数组
 */
export function calculateWeeklyStats(
  workoutLogs: WorkoutLog[],
  loggedSets: LoggedSet[]
): Array<{
  week: number;
  workouts_completed: number;
  total_duration: number;
  average_jump_height: number;
}> {
  const weeklyStats: Map<number, {
    workouts: number;
    duration: number;
    jumpHeights: number[];
  }> = new Map();

  // 处理训练日志
  workoutLogs.forEach(log => {
    const logDate = new Date(log.date);
    const weekNumber = getWeekNumber(logDate);
    
    if (!weeklyStats.has(weekNumber)) {
      weeklyStats.set(weekNumber, {
        workouts: 0,
        duration: 0,
        jumpHeights: []
      });
    }

    const stats = weeklyStats.get(weekNumber)!;
    stats.workouts++;
    stats.duration += log.duration_minutes || 0;
    
    // 这里可以根据训练强度估算弹跳高度提升
    // 简化处理：每次训练假设有0.5cm的提升
    stats.jumpHeights.push(0.5);
  });

  // 转换为数组格式
  return Array.from(weeklyStats.entries()).map(([week, stats]) => ({
    week,
    workouts_completed: stats.workouts,
    total_duration: stats.duration,
    average_jump_height: stats.jumpHeights.length > 0 
      ? stats.jumpHeights.reduce((a, b) => a + b, 0) / stats.jumpHeights.length
      : 0
  })).sort((a, b) => a.week - b.week);
}

/**
 * 获取日期的周数
 * @param date 日期
 * @returns 周数
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * 计算月度对比数据
 * @param workoutLogs 训练日志数组
 * @returns 月度对比数据
 */
export function calculateMonthlyComparison(workoutLogs: WorkoutLog[]): {
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
} {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // 过滤当月和上月的训练日志
  const currentMonthLogs = workoutLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  });

  const previousMonthLogs = workoutLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === previousMonth && logDate.getFullYear() === previousYear;
  });

  // 计算平均弹跳高度（简化计算）
  const calculateAvgJump = (logs: WorkoutLog[]) => {
    if (logs.length === 0) return 0;
    // 简化：假设每次训练有0.5cm提升，累计计算
    return logs.length * 0.5;
  };

  const currentMonthData = {
    workouts: currentMonthLogs.length,
    avg_jump: calculateAvgJump(currentMonthLogs),
    improvement: currentMonthLogs.length * 0.5
  };

  const previousMonthData = {
    workouts: previousMonthLogs.length,
    avg_jump: calculateAvgJump(previousMonthLogs),
    improvement: previousMonthLogs.length * 0.5
  };

  return {
    current_month: currentMonthData,
    previous_month: previousMonthData
  };
}

/**
 * 生成完整的进度统计数据
 * @param profile 用户档案
 * @param workoutLogs 训练日志数组
 * @param loggedSets 已记录组数据
 * @returns 完整的进度统计数据
 */
export function generateProgressStats(
  profile: Profile,
  workoutLogs: WorkoutLog[],
  loggedSets: LoggedSet[] = []
): ProgressStats {
  return {
    jump_progress: calculateJumpProgress(profile, workoutLogs),
    training_progress: calculateTrainingProgress(profile, workoutLogs),
    weekly_stats: calculateWeeklyStats(workoutLogs, loggedSets),
    monthly_comparison: calculateMonthlyComparison(workoutLogs)
  };
}

/**
 * 计算进度趋势
 * @param progressData 进度数据数组
 * @returns 趋势方向
 */
export function calculateProgressTrend(progressData: JumpProgressData[]): 'up' | 'down' | 'stable' {
  if (progressData.length < 2) return 'stable';
  
  const recentData = progressData.slice(-5); // 取最近5次数据
  const firstValue = recentData[0].jump_height;
  const lastValue = recentData[recentData.length - 1].jump_height;
  
  const difference = lastValue - firstValue;
  const threshold = 0.5; // 0.5cm的变化阈值
  
  if (difference > threshold) return 'up';
  if (difference < -threshold) return 'down';
  return 'stable';
}

/**
 * 获取进度等级描述
 * @param progress 进度百分比
 * @returns 等级描述
 */
export function getProgressLevel(progress: number): {
  level: string;
  color: string;
  description: string;
} {
  if (progress >= 90) {
    return { level: '优秀', color: 'text-green-600', description: '即将达成目标' };
  } else if (progress >= 70) {
    return { level: '良好', color: 'text-blue-600', description: '进展顺利' };
  } else if (progress >= 50) {
    return { level: '中等', color: 'text-yellow-600', description: '稳步提升' };
  } else if (progress >= 30) {
    return { level: '起步', color: 'text-orange-600', description: '需要坚持' };
  } else {
    return { level: '初始', color: 'text-red-600', description: '刚刚开始' };
  }
} 