/**
 * 演示数据文件
 * 
 * 提供分析页面和其他功能的模拟数据
 */

import type { Profile, JumpAnalysis, StrengthAssessment } from '$lib/utils/analysis';

// 演示用户资料
export const demoProfile: Profile = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  full_name: '张三',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  height_cm: 180,
  weight_kg: 75,
  standing_reach_cm: 235,
  max_touch_height_cm: 295,
  bench_press_kg: 80,
  squat_kg: 120,
  deadlift_kg: 140
};

// 演示弹跳分析结果
export const demoJumpAnalysis: JumpAnalysis = {
  current_jump: 60,
  improvement_needed: 20,
  relative_strength: 1.6,
  speed_strength: 78,
  jump_efficiency: 85,
  recommendations: [
    '增加深蹲训练，提升下肢力量',
    '加强爆发力训练，如跳跃训练',
    '提升弹跳技巧，优化起跳动作',
    '增强核心稳定性，改善身体控制'
  ]
};

// 演示力量评估结果
export const demoStrengthAssessment: StrengthAssessment = {
  overall_score: 75,
  upper_body_score: 70,
  lower_body_score: 80,
  core_score: 72,
  balance_score: 68,
  recommendations: [
    '上肢力量相对较弱，建议增加推拉训练',
    '下肢力量基础较好，可以增加爆发力训练',
    '核心力量需要持续加强',
    '平衡能力有待提升，建议增加单腿训练'
  ]
};

// 演示训练记录
export const demoWorkoutLogs = [
  {
    id: 1,
    date: '2024-01-15',
    duration: 90,
    exercises_count: 8,
    total_sets: 24,
    notes: '弹跳训练：深蹲、跳跃练习、核心训练',
    type: 'strength'
  },
  {
    id: 2,
    date: '2024-01-13',
    duration: 60,
    exercises_count: 6,
    total_sets: 18,
    notes: '有氧训练：跑步、拉伸',
    type: 'cardio'
  },
  {
    id: 3,
    date: '2024-01-11',
    duration: 75,
    exercises_count: 7,
    total_sets: 21,
    notes: '力量训练：卧推、深蹲、硬拉',
    type: 'strength'
  }
];

// 演示训练统计
export const demoTrainingStats = {
  totalWorkouts: 15,
  totalDuration: 1125, // 总分钟数
  averageDuration: 75,
  currentStreak: 5,
  longestStreak: 12,
  weeklyGoal: 4,
  monthlyProgress: 0.75
}; 