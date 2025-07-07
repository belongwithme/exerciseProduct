/**
 * 演示数据 - 用于展示能力分析功能
 */

import type { Profile, JumpAnalysis, StrengthAssessment } from '../types';

/**
 * 演示用户档案数据
 */
export const demoProfile: Profile = {
  id: 'demo-user-id',
  username: 'demo_user',
  full_name: '演示用户',
  age: 25,
  gender: '男',
  height_cm: 180,
  weight_kg: 75,
  standing_reach_cm: 235,
  max_touch_height_cm: 285,
  bench_press_kg: 80,
  squat_kg: 120,
  deadlift_kg: 140,
  target_touch_height_cm: 305,
  updated_at: new Date().toISOString()
};

/**
 * 演示弹跳分析数据
 */
export const demoJumpAnalysis: JumpAnalysis = {
  current_jump: 50, // 285 - 235
  target_jump: 70,  // 305 - 235
  improvement_needed: 20, // 70 - 50
  strength_score: 75,
  flexibility_score: 68,
  technique_score: 82
};

/**
 * 演示力量评估数据
 */
export const demoStrengthAssessment: StrengthAssessment = {
  upper_body: 72,  // 80/75 * 100 的调整值
  lower_body: 85,  // 120/75 * 60 的调整值
  core: 78,        // 140/75 * 70 的调整值
  overall_score: 78 // 平均值
};

/**
 * 生成随机演示数据
 */
export function generateRandomProfile(): Profile {
  const heights = [165, 170, 175, 180, 185, 190, 195];
  const weights = [60, 65, 70, 75, 80, 85, 90];
  const ages = [18, 20, 22, 25, 28, 30, 35];
  
  const height = heights[Math.floor(Math.random() * heights.length)];
  const weight = weights[Math.floor(Math.random() * weights.length)];
  const age = ages[Math.floor(Math.random() * ages.length)];
  
  // 基于身高计算合理的摸高数据
  const standingReach = height + Math.floor(Math.random() * 30) + 40; // 身高 + 40-70cm
  const maxTouch = standingReach + Math.floor(Math.random() * 60) + 20; // 站立摸高 + 20-80cm
  const targetTouch = maxTouch + Math.floor(Math.random() * 30) + 10; // 最大摸高 + 10-40cm
  
  // 基于体重计算合理的力量数据
  const benchPress = Math.floor(weight * (0.8 + Math.random() * 0.8)); // 0.8-1.6倍体重
  const squat = Math.floor(weight * (1.0 + Math.random() * 1.0)); // 1.0-2.0倍体重
  const deadlift = Math.floor(weight * (1.2 + Math.random() * 0.8)); // 1.2-2.0倍体重
  
  return {
    id: `demo-${Date.now()}`,
    username: `user_${Math.floor(Math.random() * 1000)}`,
    full_name: `演示用户${Math.floor(Math.random() * 100)}`,
    age,
    gender: Math.random() > 0.5 ? '男' : '女',
    height_cm: height,
    weight_kg: weight,
    standing_reach_cm: standingReach,
    max_touch_height_cm: maxTouch,
    bench_press_kg: benchPress,
    squat_kg: squat,
    deadlift_kg: deadlift,
    target_touch_height_cm: targetTouch,
    updated_at: new Date().toISOString()
  };
}

/**
 * 获取不同水平的演示档案
 */
export function getDemoProfiles() {
  return {
    beginner: {
      ...demoProfile,
      username: 'beginner_user',
      full_name: '初学者',
      height_cm: 175,
      weight_kg: 70,
      standing_reach_cm: 230,
      max_touch_height_cm: 255,
      bench_press_kg: 45,
      squat_kg: 60,
      deadlift_kg: 70,
      target_touch_height_cm: 285
    },
    intermediate: {
      ...demoProfile,
      username: 'intermediate_user',
      full_name: '中级训练者',
      height_cm: 180,
      weight_kg: 75,
      standing_reach_cm: 235,
      max_touch_height_cm: 280,
      bench_press_kg: 75,
      squat_kg: 100,
      deadlift_kg: 120,
      target_touch_height_cm: 305
    },
    advanced: {
      ...demoProfile,
      username: 'advanced_user',
      full_name: '高级训练者',
      height_cm: 185,
      weight_kg: 80,
      standing_reach_cm: 240,
      max_touch_height_cm: 310,
      bench_press_kg: 110,
      squat_kg: 150,
      deadlift_kg: 180,
      target_touch_height_cm: 330
    }
  };
} 