/**
 * 能力分析工具模块
 * 
 * 提供弹跳能力分析和力量结构评估功能
 */

import type { UserProfile } from '$lib/stores/auth';

// 分析结果接口
export interface JumpAnalysis {
  current_jump: number;
  improvement_needed: number;
  relative_strength: number;
  speed_strength: number;
  jump_efficiency: number;
  recommendations: string[];
}

export interface StrengthAssessment {
  overall_score: number;
  upper_body_score: number;
  lower_body_score: number;
  core_score: number;
  balance_score: number;
  recommendations: string[];
}

export interface Profile extends UserProfile {
  height_cm?: number;
  weight_kg?: number;
  standing_reach_cm?: number;
  max_touch_height_cm?: number;
  bench_press_kg?: number;
  squat_kg?: number;
  deadlift_kg?: number;
}

/**
 * 分析弹跳能力
 */
export function analyzeJumpAbility(profile: Profile): JumpAnalysis {
  const heightCm = profile.height_cm || 170;
  const weightKg = profile.weight_kg || 70;
  const standingReachCm = profile.standing_reach_cm || heightCm * 1.3;
  const maxTouchCm = profile.max_touch_height_cm || standingReachCm + 20;
  
  // 计算当前弹跳高度
  const currentJump = Math.max(0, maxTouchCm - standingReachCm);
  
  // 基于身高和体重计算理论最大弹跳
  const theoreticalMax = calculateTheoreticalMaxJump(heightCm, weightKg);
  
  // 计算需要提升的高度
  const improvementNeeded = Math.max(0, theoreticalMax - currentJump);
  
  // 计算相对力量（基于体重的弹跳能力）
  const relativeStrength = Math.min(100, (currentJump / weightKg) * 100);
  
  // 计算速度力量（基于弹跳爆发力）
  const speedStrength = Math.min(100, (currentJump / 40) * 100);
  
  // 计算弹跳效率
  const jumpEfficiency = Math.min(100, (currentJump / theoreticalMax) * 100);
  
  // 生成建议
  const recommendations = generateJumpRecommendations({
    currentJump,
    relativeStrength,
    speedStrength,
    jumpEfficiency
  });
  
  return {
    current_jump: Math.round(currentJump),
    improvement_needed: Math.round(improvementNeeded),
    relative_strength: Math.round(relativeStrength),
    speed_strength: Math.round(speedStrength),
    jump_efficiency: Math.round(jumpEfficiency),
    recommendations
  };
}

/**
 * 评估力量结构
 */
export function assessStrengthStructure(profile: Profile): StrengthAssessment {
  const weightKg = profile.weight_kg || 70;
  const benchKg = profile.bench_press_kg || 0;
  const squatKg = profile.squat_kg || 0;
  const deadliftKg = profile.deadlift_kg || 0;
  
  // 计算各部位力量得分（基于体重倍数）
  const upperBodyScore = calculateUpperBodyScore(benchKg, weightKg);
  const lowerBodyScore = calculateLowerBodyScore(squatKg, weightKg);
  const coreScore = calculateCoreScore(deadliftKg, weightKg);
  
  // 计算平衡得分（各部位力量的均衡性）
  const balanceScore = calculateBalanceScore(upperBodyScore, lowerBodyScore, coreScore);
  
  // 计算综合得分
  const overallScore = Math.round((upperBodyScore + lowerBodyScore + coreScore + balanceScore) / 4);
  
  // 生成建议
  const recommendations = generateStrengthRecommendations({
    overallScore,
    upperBodyScore,
    lowerBodyScore,
    coreScore,
    balanceScore
  });
  
  return {
    overall_score: overallScore,
    upper_body_score: Math.round(upperBodyScore),
    lower_body_score: Math.round(lowerBodyScore),
    core_score: Math.round(coreScore),
    balance_score: Math.round(balanceScore),
    recommendations
  };
}

/**
 * 计算理论最大弹跳高度
 */
function calculateTheoreticalMaxJump(heightCm: number, weightKg: number): number {
  // 基于身高和体重的经验公式
  const heightFactor = heightCm * 0.25;
  const weightFactor = Math.max(0, 100 - weightKg) * 0.2;
  return heightFactor + weightFactor;
}

/**
 * 计算上肢力量得分
 */
function calculateUpperBodyScore(benchKg: number, weightKg: number): number {
  if (benchKg === 0) return 0;
  
  const ratio = benchKg / weightKg;
  let score = 0;
  
  if (ratio >= 1.5) score = 100;
  else if (ratio >= 1.2) score = 85;
  else if (ratio >= 1.0) score = 70;
  else if (ratio >= 0.8) score = 55;
  else if (ratio >= 0.6) score = 40;
  else score = 25;
  
  return score;
}

/**
 * 计算下肢力量得分
 */
function calculateLowerBodyScore(squatKg: number, weightKg: number): number {
  if (squatKg === 0) return 0;
  
  const ratio = squatKg / weightKg;
  let score = 0;
  
  if (ratio >= 2.0) score = 100;
  else if (ratio >= 1.75) score = 85;
  else if (ratio >= 1.5) score = 70;
  else if (ratio >= 1.25) score = 55;
  else if (ratio >= 1.0) score = 40;
  else score = 25;
  
  return score;
}

/**
 * 计算核心力量得分
 */
function calculateCoreScore(deadliftKg: number, weightKg: number): number {
  if (deadliftKg === 0) return 0;
  
  const ratio = deadliftKg / weightKg;
  let score = 0;
  
  if (ratio >= 2.5) score = 100;
  else if (ratio >= 2.0) score = 85;
  else if (ratio >= 1.75) score = 70;
  else if (ratio >= 1.5) score = 55;
  else if (ratio >= 1.25) score = 40;
  else score = 25;
  
  return score;
}

/**
 * 计算力量平衡得分
 */
function calculateBalanceScore(upper: number, lower: number, core: number): number {
  const scores = [upper, lower, core].filter(s => s > 0);
  if (scores.length === 0) return 0;
  
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const balance = min / max;
  
  return balance * 100;
}

/**
 * 生成弹跳训练建议
 */
function generateJumpRecommendations(data: {
  currentJump: number;
  relativeStrength: number;
  speedStrength: number;
  jumpEfficiency: number;
}): string[] {
  const recommendations: string[] = [];
  
  if (data.currentJump < 30) {
    recommendations.push('建议从基础弹跳训练开始，重点训练腿部力量');
  }
  
  if (data.relativeStrength < 50) {
    recommendations.push('需要提高相对力量，建议增加负重深蹲训练');
  }
  
  if (data.speedStrength < 50) {
    recommendations.push('速度力量不足，建议进行爆发力训练如纵跳、箱跳');
  }
  
  if (data.jumpEfficiency < 70) {
    recommendations.push('弹跳技术有待提高，建议练习正确的起跳姿势');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('您的弹跳能力表现良好，继续保持训练强度');
  }
  
  return recommendations;
}

/**
 * 生成力量训练建议
 */
function generateStrengthRecommendations(data: {
  overallScore: number;
  upperBodyScore: number;
  lowerBodyScore: number;
  coreScore: number;
  balanceScore: number;
}): string[] {
  const recommendations: string[] = [];
  
  if (data.upperBodyScore < 50) {
    recommendations.push('上肢力量偏弱，建议增加卧推、俯卧撑等训练');
  }
  
  if (data.lowerBodyScore < 50) {
    recommendations.push('下肢力量不足，建议重点训练深蹲、腿举等动作');
  }
  
  if (data.coreScore < 50) {
    recommendations.push('核心力量较弱，建议加强硬拉、平板支撑训练');
  }
  
  if (data.balanceScore < 70) {
    recommendations.push('力量发展不均衡，建议均衡训练各个部位');
  }
  
  if (data.overallScore >= 80) {
    recommendations.push('力量水平优秀，可以尝试更高强度的训练');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('力量结构合理，继续保持当前训练计划');
  }
  
  return recommendations;
} 