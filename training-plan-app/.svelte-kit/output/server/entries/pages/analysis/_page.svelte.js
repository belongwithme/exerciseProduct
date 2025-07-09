import { A as push, M as escape_html, R as bind_props, E as pop, S as attr_style, Q as stringify, O as ensure_array_like, I as attr_class, G as store_get, N as head, K as unsubscribe_stores } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { u as user, a as userProfile } from "../../../chunks/auth.js";
function analyzeJumpAbility(profile) {
  const heightCm = profile.height_cm || 170;
  const weightKg = profile.weight_kg || 70;
  const standingReachCm = profile.standing_reach_cm || heightCm * 1.3;
  const maxTouchCm = profile.max_touch_height_cm || standingReachCm + 20;
  const currentJump = Math.max(0, maxTouchCm - standingReachCm);
  const theoreticalMax = calculateTheoreticalMaxJump(heightCm, weightKg);
  const improvementNeeded = Math.max(0, theoreticalMax - currentJump);
  const relativeStrength = Math.min(100, currentJump / weightKg * 100);
  const speedStrength = Math.min(100, currentJump / 40 * 100);
  const jumpEfficiency = Math.min(100, currentJump / theoreticalMax * 100);
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
function assessStrengthStructure(profile) {
  const weightKg = profile.weight_kg || 70;
  const benchKg = profile.bench_press_kg || 0;
  const squatKg = profile.squat_kg || 0;
  const deadliftKg = profile.deadlift_kg || 0;
  const upperBodyScore = calculateUpperBodyScore(benchKg, weightKg);
  const lowerBodyScore = calculateLowerBodyScore(squatKg, weightKg);
  const coreScore = calculateCoreScore(deadliftKg, weightKg);
  const balanceScore = calculateBalanceScore(upperBodyScore, lowerBodyScore, coreScore);
  const overallScore = Math.round((upperBodyScore + lowerBodyScore + coreScore + balanceScore) / 4);
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
function calculateTheoreticalMaxJump(heightCm, weightKg) {
  const heightFactor = heightCm * 0.25;
  const weightFactor = Math.max(0, 100 - weightKg) * 0.2;
  return heightFactor + weightFactor;
}
function calculateUpperBodyScore(benchKg, weightKg) {
  if (benchKg === 0) return 0;
  const ratio = benchKg / weightKg;
  let score = 0;
  if (ratio >= 1.5) score = 100;
  else if (ratio >= 1.2) score = 85;
  else if (ratio >= 1) score = 70;
  else if (ratio >= 0.8) score = 55;
  else if (ratio >= 0.6) score = 40;
  else score = 25;
  return score;
}
function calculateLowerBodyScore(squatKg, weightKg) {
  if (squatKg === 0) return 0;
  const ratio = squatKg / weightKg;
  let score = 0;
  if (ratio >= 2) score = 100;
  else if (ratio >= 1.75) score = 85;
  else if (ratio >= 1.5) score = 70;
  else if (ratio >= 1.25) score = 55;
  else if (ratio >= 1) score = 40;
  else score = 25;
  return score;
}
function calculateCoreScore(deadliftKg, weightKg) {
  if (deadliftKg === 0) return 0;
  const ratio = deadliftKg / weightKg;
  let score = 0;
  if (ratio >= 2.5) score = 100;
  else if (ratio >= 2) score = 85;
  else if (ratio >= 1.75) score = 70;
  else if (ratio >= 1.5) score = 55;
  else if (ratio >= 1.25) score = 40;
  else score = 25;
  return score;
}
function calculateBalanceScore(upper, lower, core) {
  const scores = [upper, lower, core].filter((s) => s > 0);
  if (scores.length === 0) return 0;
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const balance = min / max;
  return balance * 100;
}
function generateJumpRecommendations(data) {
  const recommendations = [];
  if (data.currentJump < 30) {
    recommendations.push("建议从基础弹跳训练开始，重点训练腿部力量");
  }
  if (data.relativeStrength < 50) {
    recommendations.push("需要提高相对力量，建议增加负重深蹲训练");
  }
  if (data.speedStrength < 50) {
    recommendations.push("速度力量不足，建议进行爆发力训练如纵跳、箱跳");
  }
  if (data.jumpEfficiency < 70) {
    recommendations.push("弹跳技术有待提高，建议练习正确的起跳姿势");
  }
  if (recommendations.length === 0) {
    recommendations.push("您的弹跳能力表现良好，继续保持训练强度");
  }
  return recommendations;
}
function generateStrengthRecommendations(data) {
  const recommendations = [];
  if (data.upperBodyScore < 50) {
    recommendations.push("上肢力量偏弱，建议增加卧推、俯卧撑等训练");
  }
  if (data.lowerBodyScore < 50) {
    recommendations.push("下肢力量不足，建议重点训练深蹲、腿举等动作");
  }
  if (data.coreScore < 50) {
    recommendations.push("核心力量较弱，建议加强硬拉、平板支撑训练");
  }
  if (data.balanceScore < 70) {
    recommendations.push("力量发展不均衡，建议均衡训练各个部位");
  }
  if (data.overallScore >= 80) {
    recommendations.push("力量水平优秀，可以尝试更高强度的训练");
  }
  if (recommendations.length === 0) {
    recommendations.push("力量结构合理，继续保持当前训练计划");
  }
  return recommendations;
}
function JumpAnalysisChart($$payload, $$props) {
  push();
  let data = $$props["data"];
  $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">弹跳能力分析</h3> <div class="relative h-64 mb-4"><canvas></canvas></div> <div class="grid grid-cols-2 gap-4"><div class="text-center"><div class="text-2xl font-bold text-blue-600">${escape_html(data.current_jump)}cm</div> <div class="text-sm text-gray-600 dark:text-gray-400">当前弹跳高度</div></div> <div class="text-center"><div class="text-2xl font-bold text-green-600">${escape_html(data.improvement_needed)}cm</div> <div class="text-sm text-gray-600 dark:text-gray-400">提升潜力</div></div></div> <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"><div class="grid grid-cols-3 gap-4 text-center"><div><div class="text-lg font-semibold text-gray-900 dark:text-white">${escape_html(data.relative_strength.toFixed(1))}</div> <div class="text-xs text-gray-600 dark:text-gray-400">相对力量</div></div> <div><div class="text-lg font-semibold text-gray-900 dark:text-white">${escape_html(data.speed_strength)}%</div> <div class="text-xs text-gray-600 dark:text-gray-400">速度力量</div></div> <div><div class="text-lg font-semibold text-gray-900 dark:text-white">${escape_html(data.jump_efficiency)}%</div> <div class="text-xs text-gray-600 dark:text-gray-400">弹跳效率</div></div></div></div></div>`;
  bind_props($$props, { data });
  pop();
}
function StrengthRadarChart($$payload, $$props) {
  push();
  let data = $$props["data"];
  $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">力量结构分析</h3> <div class="relative h-64 mb-4"><canvas></canvas></div> <div class="grid grid-cols-2 gap-4"><div class="space-y-2"><div class="flex justify-between items-center"><span class="text-sm text-gray-600 dark:text-gray-400">上肢力量</span> <span class="font-semibold text-gray-900 dark:text-white">${escape_html(data.upper_body_score)}/100</span></div> <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-blue-600 h-2 rounded-full"${attr_style(`width: ${stringify(data.upper_body_score)}%`)}></div></div></div> <div class="space-y-2"><div class="flex justify-between items-center"><span class="text-sm text-gray-600 dark:text-gray-400">下肢力量</span> <span class="font-semibold text-gray-900 dark:text-white">${escape_html(data.lower_body_score)}/100</span></div> <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-600 h-2 rounded-full"${attr_style(`width: ${stringify(data.lower_body_score)}%`)}></div></div></div> <div class="space-y-2"><div class="flex justify-between items-center"><span class="text-sm text-gray-600 dark:text-gray-400">核心力量</span> <span class="font-semibold text-gray-900 dark:text-white">${escape_html(data.core_score)}/100</span></div> <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-purple-600 h-2 rounded-full"${attr_style(`width: ${stringify(data.core_score)}%`)}></div></div></div> <div class="space-y-2"><div class="flex justify-between items-center"><span class="text-sm text-gray-600 dark:text-gray-400">平衡能力</span> <span class="font-semibold text-gray-900 dark:text-white">${escape_html(data.balance_score)}/100</span></div> <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-orange-600 h-2 rounded-full"${attr_style(`width: ${stringify(data.balance_score)}%`)}></div></div></div></div> <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center"><div class="text-2xl font-bold text-blue-600">${escape_html(data.overall_score)}/100</div> <div class="text-sm text-gray-600 dark:text-gray-400">综合力量评分</div></div></div>`;
  bind_props($$props, { data });
  pop();
}
function CoreProblemsAnalysis($$payload, $$props) {
  push();
  let problems;
  let jumpAnalysis = $$props["jumpAnalysis"];
  let strengthAssessment = $$props["strengthAssessment"];
  function analyzeProblems() {
    const problems2 = [];
    if (jumpAnalysis.jump_efficiency < 80) {
      problems2.push({
        type: "technique",
        title: "弹跳技术效率偏低",
        description: "您的弹跳技术还有提升空间，建议加强技术训练",
        severity: "medium",
        recommendations: ["练习正确的起跳姿势", "加强踝关节灵活性", "提升动作协调性"]
      });
    }
    if (jumpAnalysis.relative_strength < 1.5) {
      problems2.push({
        type: "strength",
        title: "相对力量不足",
        description: "您的力量相对于体重比较偏低，需要加强基础力量训练",
        severity: "high",
        recommendations: ["增加深蹲训练强度", "进行硬拉练习", "加强腿部力量训练"]
      });
    }
    if (jumpAnalysis.speed_strength < 70) {
      problems2.push({
        type: "power",
        title: "爆发力需要提升",
        description: "速度力量偏低，影响弹跳表现",
        severity: "high",
        recommendations: ["进行跳跃训练", "练习爆发力动作", "增加plyometric训练"]
      });
    }
    if (strengthAssessment.upper_body_score < 70) {
      problems2.push({
        type: "upper_body",
        title: "上肢力量薄弱",
        description: "上肢力量相对较弱，可能影响整体运动表现",
        severity: "medium",
        recommendations: ["增加推举训练", "加强引体向上练习", "进行上肢力量训练"]
      });
    }
    if (strengthAssessment.core_score < 75) {
      problems2.push({
        type: "core",
        title: "核心稳定性不足",
        description: "核心力量偏弱，影响整体稳定性和力量传递",
        severity: "high",
        recommendations: ["加强平板支撑训练", "进行核心稳定性练习", "练习旋转力量训练"]
      });
    }
    if (strengthAssessment.balance_score < 70) {
      problems2.push({
        type: "balance",
        title: "平衡能力有待加强",
        description: "平衡能力偏弱，可能影响运动稳定性",
        severity: "medium",
        recommendations: ["进行单腿训练", "使用平衡板练习", "加强本体感觉训练"]
      });
    }
    return problems2.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
  function getSeverityColor(severity) {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }
  function getSeverityLabel(severity) {
    switch (severity) {
      case "high":
        return "高优先级";
      case "medium":
        return "中优先级";
      case "low":
        return "低优先级";
      default:
        return "普通";
    }
  }
  function getTypeIcon(type) {
    switch (type) {
      case "technique":
        return "🎯";
      case "strength":
        return "💪";
      case "power":
        return "⚡";
      case "upper_body":
        return "🏋️‍♂️";
      case "core":
        return "🔥";
      case "balance":
        return "⚖️";
      default:
        return "📊";
    }
  }
  problems = analyzeProblems();
  $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">核心问题分析</h3> `;
  if (problems.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center py-8"><div class="text-4xl mb-2">🎉</div> <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">表现优秀！</h4> <p class="text-gray-600 dark:text-gray-400">您的各项指标都表现良好，继续保持！</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(problems);
    $$payload.out += `<div class="space-y-4"><!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let problem = each_array[index];
      const each_array_1 = ensure_array_like(problem.recommendations);
      $$payload.out += `<div${attr_class(`border rounded-lg p-4 ${stringify(getSeverityColor(problem.severity))}`)}><div class="flex items-start space-x-3"><div class="text-2xl">${escape_html(getTypeIcon(problem.type))}</div> <div class="flex-1"><div class="flex items-center justify-between mb-2"><h4 class="font-semibold text-lg">${escape_html(problem.title)}</h4> <span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stringify(getSeverityColor(problem.severity))}`)}>${escape_html(getSeverityLabel(problem.severity))}</span></div> <p class="text-sm mb-3 opacity-90">${escape_html(problem.description)}</p> <div><h5 class="font-medium text-sm mb-2">改善建议：</h5> <ul class="text-sm space-y-1"><!--[-->`;
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let recommendation = each_array_1[$$index];
        $$payload.out += `<li class="flex items-start space-x-2"><span class="text-xs mt-1">•</span> <span>${escape_html(recommendation)}</span></li>`;
      }
      $$payload.out += `<!--]--></ul></div></div></div></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"><div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"><h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">训练建议总结</h4> <p class="text-sm text-blue-800 dark:text-blue-200">根据分析结果，建议您优先关注标记为"高优先级"的问题。
          这些问题对您的弹跳能力提升影响最大。
          建议制定针对性的训练计划，循序渐进地改善各项指标。</p></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { jumpAnalysis, strengthAssessment });
  pop();
}
const demoProfile = {
  id: "demo-user-1",
  email: "demo@example.com",
  full_name: "张三",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  height_cm: 180,
  weight_kg: 75,
  standing_reach_cm: 235,
  max_touch_height_cm: 295,
  bench_press_kg: 80,
  squat_kg: 120,
  deadlift_kg: 140
};
const demoJumpAnalysis = {
  current_jump: 60,
  improvement_needed: 20,
  relative_strength: 1.6,
  speed_strength: 78,
  jump_efficiency: 85,
  recommendations: [
    "增加深蹲训练，提升下肢力量",
    "加强爆发力训练，如跳跃训练",
    "提升弹跳技巧，优化起跳动作",
    "增强核心稳定性，改善身体控制"
  ]
};
const demoStrengthAssessment = {
  overall_score: 75,
  upper_body_score: 70,
  lower_body_score: 80,
  core_score: 72,
  balance_score: 68,
  recommendations: [
    "上肢力量相对较弱，建议增加推拉训练",
    "下肢力量基础较好，可以增加爆发力训练",
    "核心力量需要持续加强",
    "平衡能力有待提升，建议增加单腿训练"
  ]
};
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let loading = true;
  let error = "";
  let profile = null;
  let jumpAnalysis = null;
  let strengthAssessment = null;
  function loadAnalysisData() {
    try {
      loading = true;
      error = "";
      if (store_get($$store_subs ??= {}, "$user", user) && store_get($$store_subs ??= {}, "$userProfile", userProfile) && hasEnoughDataForAnalysis(store_get($$store_subs ??= {}, "$userProfile", userProfile))) {
        profile = store_get($$store_subs ??= {}, "$userProfile", userProfile);
        jumpAnalysis = analyzeJumpAbility(store_get($$store_subs ??= {}, "$userProfile", userProfile));
        strengthAssessment = assessStrengthStructure(store_get($$store_subs ??= {}, "$userProfile", userProfile));
      } else if (store_get($$store_subs ??= {}, "$user", user) && store_get($$store_subs ??= {}, "$userProfile", userProfile) && !hasEnoughDataForAnalysis(store_get($$store_subs ??= {}, "$userProfile", userProfile))) {
        error = "数据不足，请在个人资料中补充身高、体重、摸高和力量数据";
        loading = false;
        return;
      } else if (store_get($$store_subs ??= {}, "$user", user) && !store_get($$store_subs ??= {}, "$userProfile", userProfile)) {
        error = "无法获取用户档案数据，请先完善个人资料";
        loading = false;
        return;
      } else {
        profile = demoProfile;
        jumpAnalysis = demoJumpAnalysis;
        strengthAssessment = demoStrengthAssessment;
      }
    } catch (err) {
      console.error("加载分析数据失败:", err);
      error = "加载分析数据失败，请稍后重试";
    } finally {
      loading = false;
    }
  }
  function hasEnoughDataForAnalysis(profile2) {
    const hasBasicData = profile2.height_cm != null && profile2.weight_kg != null;
    const hasJumpData = profile2.standing_reach_cm != null && profile2.max_touch_height_cm != null;
    const hasStrengthData = profile2.bench_press_kg != null || profile2.squat_kg != null || profile2.deadlift_kg != null;
    return !!(hasBasicData && (hasJumpData || hasStrengthData));
  }
  if (store_get($$store_subs ??= {}, "$user", user) !== void 0) {
    loadAnalysisData();
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>能力分析 - 训练计划系统</title>`;
    $$payload2.out += `<meta name="description" content="分析您的弹跳能力和力量结构，识别训练中的核心问题"/>`;
  });
  $$payload.out += `<main class="min-h-screen bg-gray-50 py-8"><div class="max-w-7xl mx-auto px-4"><div class="text-center mb-8"><h1 class="text-3xl font-bold text-gray-900 mb-2">🎯 能力分析</h1> <p class="text-gray-600">基于您的身体数据和训练水平，提供专业的能力评估和训练建议</p> `;
  if (!store_get($$store_subs ??= {}, "$user", user)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"><p class="text-sm text-blue-700">📊 当前显示的是演示数据。<a href="/auth" class="underline font-medium">登录</a>后可查看基于您个人数据的分析结果。</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> `;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div> <span class="ml-2 text-gray-600">正在分析您的能力数据...</span></div>`;
  } else if (error) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="max-w-2xl mx-auto"><div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"><div class="text-red-500 mb-4"><svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg></div> <h3 class="text-lg font-semibold text-red-800 mb-2">无法进行能力分析</h3> <p class="text-red-600 mb-4">${escape_html(error)}</p> <div class="flex justify-center space-x-4"><button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">完善个人资料</button> <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">重新分析</button></div></div></div>`;
  } else if (profile && jumpAnalysis && strengthAssessment) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="space-y-8"><div class="bg-white rounded-lg shadow-md p-6 border border-gray-200"><h2 class="text-xl font-bold text-gray-800 mb-4">分析概览</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="text-center"><div class="text-3xl font-bold text-blue-600 mb-2">${escape_html(jumpAnalysis.current_jump)}cm</div> <div class="text-sm text-gray-600">当前弹跳高度</div></div> <div class="text-center"><div class="text-3xl font-bold text-green-600 mb-2">${escape_html(strengthAssessment.overall_score)}分</div> <div class="text-sm text-gray-600">综合力量评分</div></div> <div class="text-center"><div class="text-3xl font-bold text-purple-600 mb-2">${escape_html(jumpAnalysis.improvement_needed)}cm</div> <div class="text-sm text-gray-600">需要提升高度</div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">`;
    JumpAnalysisChart($$payload, { jumpAnalysis });
    $$payload.out += `<!----></div> <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">`;
    StrengthRadarChart($$payload, { strengthAssessment });
    $$payload.out += `<!----></div></div> <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">`;
    CoreProblemsAnalysis($$payload, { profile });
    $$payload.out += `<!----></div> <div class="flex justify-center space-x-4"><button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">更新个人资料</button> <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">重新分析</button></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="mt-8 text-center"><button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">← 返回首页</button></div></div></main>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
