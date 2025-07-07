/**
 * 训练能力分析工具函数
 * 
 * 这个文件包含了用于分析用户训练能力的各种算法和计算函数
 */

import type { Profile, JumpAnalysis, StrengthAssessment } from '../types';

/**
 * 计算弹跳能力分析
 * @param profile 用户档案数据
 * @returns 弹跳能力分析结果
 */
export function analyzeJumpAbility(profile: Profile): JumpAnalysis {
  const {
    height_cm = 0,
    weight_kg = 0,
    standing_reach_cm = 0,
    max_touch_height_cm = 0,
    target_touch_height_cm = 0,
    bench_press_kg = 0,
    squat_kg = 0,
    deadlift_kg = 0
  } = profile;

  // 计算当前弹跳高度
  const current_jump = max_touch_height_cm - standing_reach_cm;
  
  // 计算目标弹跳高度
  const target_jump = target_touch_height_cm - standing_reach_cm;
  
  // 计算需要提升的高度
  const improvement_needed = target_jump - current_jump;

  // 计算力量评分（基于体重比例）
  const benchRatio = weight_kg > 0 ? bench_press_kg / weight_kg : 0;
  const squatRatio = weight_kg > 0 ? squat_kg / weight_kg : 0;
  const deadliftRatio = weight_kg > 0 ? deadlift_kg / weight_kg : 0;
  
  // 力量评分计算（满分100）
  const strength_score = Math.min(100, Math.round(
    (benchRatio * 20) + (squatRatio * 30) + (deadliftRatio * 25)
  ));

  // 柔韧性评分（基于身高和摸高比例）
  const reachRatio = height_cm > 0 ? standing_reach_cm / height_cm : 0;
  const flexibility_score = Math.min(100, Math.round(reachRatio * 80));

  // 技术评分（基于实际弹跳与理论弹跳的比较）
  const expectedJump = calculateExpectedJump(height_cm, weight_kg, strength_score);
  const technique_score = expectedJump > 0 ? 
    Math.min(100, Math.round((current_jump / expectedJump) * 100)) : 0;

  return {
    current_jump,
    target_jump,
    improvement_needed,
    strength_score,
    flexibility_score,
    technique_score
  };
}

/**
 * 计算预期弹跳高度（基于身高体重和力量水平）
 * @param height 身高（cm）
 * @param weight 体重（kg）
 * @param strengthScore 力量评分
 * @returns 预期弹跳高度（cm）
 */
function calculateExpectedJump(height: number, weight: number, strengthScore: number): number {
  if (height <= 0 || weight <= 0) return 0;
  
  // 基础弹跳能力（基于身高）
  const baseJump = height * 0.15; // 身高的15%作为基础
  
  // 力量加成
  const strengthBonus = (strengthScore / 100) * 20; // 最多20cm加成
  
  // 体重影响（BMI过高会降低弹跳）
  const bmi = weight / Math.pow(height / 100, 2);
  const weightPenalty = bmi > 25 ? (bmi - 25) * 2 : 0;
  
  return Math.max(0, baseJump + strengthBonus - weightPenalty);
}

/**
 * 评估力量结构
 * @param profile 用户档案数据
 * @returns 力量结构评估结果
 */
export function assessStrengthStructure(profile: Profile): StrengthAssessment {
  const {
    weight_kg = 0,
    bench_press_kg = 0,
    squat_kg = 0,
    deadlift_kg = 0
  } = profile;

  if (weight_kg <= 0) {
    return {
      upper_body: 0,
      lower_body: 0,
      core: 0,
      overall_score: 0
    };
  }

  // 计算各部位力量比例（相对于体重）
  const benchRatio = bench_press_kg / weight_kg;
  const squatRatio = squat_kg / weight_kg;
  const deadliftRatio = deadlift_kg / weight_kg;

  // 上肢力量评分（卧推为主）
  const upper_body = Math.min(100, Math.round(benchRatio * 100));

  // 下肢力量评分（深蹲为主）
  const lower_body = Math.min(100, Math.round(squatRatio * 60));

  // 核心力量评分（硬拉为主）
  const core = Math.min(100, Math.round(deadliftRatio * 70));

  // 综合评分
  const overall_score = Math.round((upper_body + lower_body + core) / 3);

  return {
    upper_body,
    lower_body,
    core,
    overall_score
  };
}

/**
 * 分析核心问题
 * @param profile 用户档案数据
 * @returns 核心问题列表
 */
export function analyzeCoreProblems(profile: Profile): Array<{
  problem: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}> {
  const problems: Array<{
    problem: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }> = [];

  const jumpAnalysis = analyzeJumpAbility(profile);
  const strengthAssessment = assessStrengthStructure(profile);

  // 检查力量失衡
  if (strengthAssessment.upper_body > 0 && strengthAssessment.lower_body > 0) {
    const imbalanceRatio = Math.abs(strengthAssessment.upper_body - strengthAssessment.lower_body);
    if (imbalanceRatio > 30) {
      problems.push({
        problem: '力量失衡',
        description: `上下肢力量差异过大（${imbalanceRatio}%），可能影响运动表现和增加受伤风险。`,
        severity: 'high'
      });
    }
  }

  // 检查核心力量不足
  if (strengthAssessment.core < 40) {
    problems.push({
      problem: '核心力量不足',
      description: '核心力量偏弱，建议加强核心训练以提高整体稳定性和力量传递效率。',
      severity: 'medium'
    });
  }

  // 检查弹跳技术问题
  if (jumpAnalysis.technique_score < 60) {
    problems.push({
      problem: '弹跳技术有待改善',
      description: '相对于力量水平，弹跳表现不佳，建议重点训练弹跳技术和爆发力。',
      severity: 'medium'
    });
  }

  // 检查柔韧性问题
  if (jumpAnalysis.flexibility_score < 50) {
    problems.push({
      problem: '柔韧性不足',
      description: '身体柔韧性偏低，可能限制动作幅度和运动表现。',
      severity: 'low'
    });
  }

  // 检查干扰效应（力量训练可能影响爆发力）
  if (strengthAssessment.overall_score > 80 && jumpAnalysis.current_jump < 40) {
    problems.push({
      problem: '干扰效应',
      description: '力量水平较高但弹跳表现不佳，可能存在力量训练对爆发力的负面影响。',
      severity: 'high'
    });
  }

  return problems;
}

/**
 * 获取训练建议
 * @param profile 用户档案数据
 * @returns 训练建议列表
 */
export function getTrainingRecommendations(profile: Profile): Array<{
  category: string;
  recommendations: string[];
}> {
  const problems = analyzeCoreProblems(profile);
  const jumpAnalysis = analyzeJumpAbility(profile);
  const strengthAssessment = assessStrengthStructure(profile);

  const recommendations: Array<{
    category: string;
    recommendations: string[];
  }> = [];

  // 基于问题提供建议
  problems.forEach(problem => {
    switch (problem.problem) {
      case '力量失衡':
        recommendations.push({
          category: '力量平衡',
          recommendations: [
            '增加较弱部位的训练频率',
            '减少较强部位的训练强度',
            '进行单侧训练以纠正不平衡'
          ]
        });
        break;
      case '核心力量不足':
        recommendations.push({
          category: '核心训练',
          recommendations: [
            '增加平板支撑、侧平板等静态核心训练',
            '进行俄罗斯转体、仰卧起坐等动态核心训练',
            '在复合动作中注重核心稳定性'
          ]
        });
        break;
      case '弹跳技术有待改善':
        recommendations.push({
          category: '弹跳技术',
          recommendations: [
            '进行跳跃技术专项训练',
            '练习深蹲跳、箱式跳等爆发力动作',
            '注重起跳和落地技术的规范性'
          ]
        });
        break;
    }
  });

  // 基于能力水平提供通用建议
  if (jumpAnalysis.current_jump < 30) {
    recommendations.push({
      category: '基础弹跳',
      recommendations: [
        '从基础跳跃动作开始练习',
        '重点发展下肢力量',
        '改善踝关节灵活性'
      ]
    });
  }

  if (strengthAssessment.overall_score < 50) {
    recommendations.push({
      category: '力量基础',
      recommendations: [
        '建立基础力量训练计划',
        '重点练习复合动作（深蹲、硬拉、卧推）',
        '循序渐进增加训练强度'
      ]
    });
  }

  return recommendations;
}

/**
 * 计算训练优先级
 * @param profile 用户档案数据
 * @returns 训练优先级排序
 */
export function calculateTrainingPriority(profile: Profile): Array<{
  area: string;
  priority: number;
  reason: string;
}> {
  const problems = analyzeCoreProblems(profile);
  const jumpAnalysis = analyzeJumpAbility(profile);
  const strengthAssessment = assessStrengthStructure(profile);

  const priorities: Array<{
    area: string;
    priority: number;
    reason: string;
  }> = [];

  // 基于问题严重程度确定优先级
  problems.forEach(problem => {
    let priority = 0;
    switch (problem.severity) {
      case 'high':
        priority = 90;
        break;
      case 'medium':
        priority = 60;
        break;
      case 'low':
        priority = 30;
        break;
    }

    priorities.push({
      area: problem.problem,
      priority,
      reason: problem.description
    });
  });

  // 基于能力水平调整优先级
  if (strengthAssessment.overall_score < 40) {
    priorities.push({
      area: '基础力量建设',
      priority: 85,
      reason: '力量基础薄弱，需要优先建立基础力量'
    });
  }

  if (jumpAnalysis.current_jump < 25) {
    priorities.push({
      area: '弹跳基础训练',
      priority: 80,
      reason: '弹跳能力较弱，需要从基础开始训练'
    });
  }

  // 按优先级排序
  return priorities.sort((a, b) => b.priority - a.priority);
} 