<!-- 核心问题分析组件 -->
<script lang="ts">
  import type { JumpAnalysis, StrengthAssessment } from '$lib/utils/analysis';
  
  export let jumpAnalysis: JumpAnalysis;
  export let strengthAssessment: StrengthAssessment;
  
  // 分析核心问题
  function analyzeProblems() {
    const problems = [];
    
    // 弹跳相关问题
    if (jumpAnalysis.jump_efficiency < 80) {
      problems.push({
        type: 'technique',
        title: '弹跳技术效率偏低',
        description: '您的弹跳技术还有提升空间，建议加强技术训练',
        severity: 'medium',
        recommendations: [
          '练习正确的起跳姿势',
          '加强踝关节灵活性',
          '提升动作协调性'
        ]
      });
    }
    
    if (jumpAnalysis.relative_strength < 1.5) {
      problems.push({
        type: 'strength',
        title: '相对力量不足',
        description: '您的力量相对于体重比较偏低，需要加强基础力量训练',
        severity: 'high',
        recommendations: [
          '增加深蹲训练强度',
          '进行硬拉练习',
          '加强腿部力量训练'
        ]
      });
    }
    
    if (jumpAnalysis.speed_strength < 70) {
      problems.push({
        type: 'power',
        title: '爆发力需要提升',
        description: '速度力量偏低，影响弹跳表现',
        severity: 'high',
        recommendations: [
          '进行跳跃训练',
          '练习爆发力动作',
          '增加plyometric训练'
        ]
      });
    }
    
    // 力量结构问题
    if (strengthAssessment.upper_body_score < 70) {
      problems.push({
        type: 'upper_body',
        title: '上肢力量薄弱',
        description: '上肢力量相对较弱，可能影响整体运动表现',
        severity: 'medium',
        recommendations: [
          '增加推举训练',
          '加强引体向上练习',
          '进行上肢力量训练'
        ]
      });
    }
    
    if (strengthAssessment.core_score < 75) {
      problems.push({
        type: 'core',
        title: '核心稳定性不足',
        description: '核心力量偏弱，影响整体稳定性和力量传递',
        severity: 'high',
        recommendations: [
          '加强平板支撑训练',
          '进行核心稳定性练习',
          '练习旋转力量训练'
        ]
      });
    }
    
    if (strengthAssessment.balance_score < 70) {
      problems.push({
        type: 'balance',
        title: '平衡能力有待加强',
        description: '平衡能力偏弱，可能影响运动稳定性',
        severity: 'medium',
        recommendations: [
          '进行单腿训练',
          '使用平衡板练习',
          '加强本体感觉训练'
        ]
      });
    }
    
    return problems.sort((a, b) => {
      const severityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
  
  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
  
  function getSeverityLabel(severity: string) {
    switch (severity) {
      case 'high':
        return '高优先级';
      case 'medium':
        return '中优先级';
      case 'low':
        return '低优先级';
      default:
        return '普通';
    }
  }
  
  function getTypeIcon(type: string) {
    switch (type) {
      case 'technique':
        return '🎯';
      case 'strength':
        return '💪';
      case 'power':
        return '⚡';
      case 'upper_body':
        return '🏋️‍♂️';
      case 'core':
        return '🔥';
      case 'balance':
        return '⚖️';
      default:
        return '📊';
    }
  }
  
  $: problems = analyzeProblems();
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">核心问题分析</h3>
  
  {#if problems.length === 0}
    <div class="text-center py-8">
      <div class="text-4xl mb-2">🎉</div>
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">表现优秀！</h4>
      <p class="text-gray-600 dark:text-gray-400">您的各项指标都表现良好，继续保持！</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each problems as problem, index}
        <div class="border rounded-lg p-4 {getSeverityColor(problem.severity)}">
          <div class="flex items-start space-x-3">
            <div class="text-2xl">{getTypeIcon(problem.type)}</div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-lg">{problem.title}</h4>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getSeverityColor(problem.severity)}">
                  {getSeverityLabel(problem.severity)}
                </span>
              </div>
              
              <p class="text-sm mb-3 opacity-90">{problem.description}</p>
              
              <div>
                <h5 class="font-medium text-sm mb-2">改善建议：</h5>
                <ul class="text-sm space-y-1">
                  {#each problem.recommendations as recommendation}
                    <li class="flex items-start space-x-2">
                      <span class="text-xs mt-1">•</span>
                      <span>{recommendation}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- 总结 -->
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">训练建议总结</h4>
        <p class="text-sm text-blue-800 dark:text-blue-200">
          根据分析结果，建议您优先关注标记为"高优先级"的问题。
          这些问题对您的弹跳能力提升影响最大。
          建议制定针对性的训练计划，循序渐进地改善各项指标。
        </p>
      </div>
    </div>
  {/if}
</div> 