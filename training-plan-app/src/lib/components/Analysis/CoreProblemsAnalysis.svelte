<!-- 核心问题分析组件 -->
<script lang="ts">
  import type { Profile } from '../../types';
  import { analyzeCoreProblems, getTrainingRecommendations, calculateTrainingPriority } from '../../utils/analysis';

  // 组件属性
  export let profile: Profile;

  // 计算分析结果
  $: coreProblems = analyzeCoreProblems(profile);
  $: trainingRecommendations = getTrainingRecommendations(profile);
  $: trainingPriority = calculateTrainingPriority(profile);

  /**
   * 获取严重程度的样式类
   */
  function getSeverityClass(severity: 'high' | 'medium' | 'low'): string {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  /**
   * 获取严重程度的图标
   */
  function getSeverityIcon(severity: 'high' | 'medium' | 'low'): string {
    switch (severity) {
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return 'ℹ️';
      default:
        return '•';
    }
  }

  /**
   * 获取优先级的样式类
   */
  function getPriorityClass(priority: number): string {
    if (priority >= 80) {
      return 'bg-red-500';
    } else if (priority >= 60) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  }

  /**
   * 获取优先级描述
   */
  function getPriorityText(priority: number): string {
    if (priority >= 80) {
      return '高优先级';
    } else if (priority >= 60) {
      return '中优先级';
    } else {
      return '低优先级';
    }
  }
</script>

<!-- 核心问题分析容器 -->
<div class="core-problems-container">
  <!-- 标题 -->
  <div class="analysis-header">
    <h3 class="text-xl font-bold text-gray-800 mb-2">核心问题分析</h3>
    <p class="text-sm text-gray-600">基于您的身体数据和训练水平，识别出以下需要关注的问题</p>
  </div>

  <!-- 核心问题列表 -->
  <div class="problems-section">
    <h4 class="text-lg font-semibold text-gray-800 mb-3">发现的问题</h4>
    
    {#if coreProblems.length === 0}
      <div class="no-problems">
        <div class="no-problems-icon">✅</div>
        <div class="no-problems-text">
          <h5 class="font-semibold text-green-800">恭喜！</h5>
          <p class="text-sm text-green-600">暂未发现明显的训练问题，请保持当前的训练状态。</p>
        </div>
      </div>
    {:else}
      <div class="problems-list">
        {#each coreProblems as problem}
          <div class="problem-item {getSeverityClass(problem.severity)}">
            <div class="problem-header">
              <div class="problem-title">
                <span class="problem-icon">{getSeverityIcon(problem.severity)}</span>
                <span class="problem-name">{problem.problem}</span>
              </div>
              <div class="problem-severity">
                {#if problem.severity === 'high'}
                  <span class="severity-badge high">高风险</span>
                {:else if problem.severity === 'medium'}
                  <span class="severity-badge medium">中等</span>
                {:else}
                  <span class="severity-badge low">轻微</span>
                {/if}
              </div>
            </div>
            <div class="problem-description">
              <p class="text-sm">{problem.description}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- 训练优先级 -->
  <div class="priority-section">
    <h4 class="text-lg font-semibold text-gray-800 mb-3">训练优先级</h4>
    
    {#if trainingPriority.length === 0}
      <div class="no-priority">
        <p class="text-sm text-gray-600">暂无特定的训练优先级建议</p>
      </div>
    {:else}
      <div class="priority-list">
        {#each trainingPriority as priority}
          <div class="priority-item">
            <div class="priority-indicator">
              <div class="priority-bar {getPriorityClass(priority.priority)}" style="width: {priority.priority}%"></div>
              <span class="priority-value">{priority.priority}分</span>
            </div>
            <div class="priority-content">
              <div class="priority-title">
                <span class="priority-area">{priority.area}</span>
                <span class="priority-level">{getPriorityText(priority.priority)}</span>
              </div>
              <p class="priority-reason">{priority.reason}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- 训练建议 -->
  <div class="recommendations-section">
    <h4 class="text-lg font-semibold text-gray-800 mb-3">训练建议</h4>
    
    {#if trainingRecommendations.length === 0}
      <div class="no-recommendations">
        <p class="text-sm text-gray-600">暂无特定的训练建议</p>
      </div>
    {:else}
      <div class="recommendations-list">
        {#each trainingRecommendations as recommendation}
          <div class="recommendation-category">
            <h5 class="category-title">{recommendation.category}</h5>
            <ul class="category-recommendations">
              {#each recommendation.recommendations as item}
                <li class="recommendation-item">
                  <span class="recommendation-bullet">•</span>
                  <span class="recommendation-text">{item}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- 总结 -->
  <div class="summary-section">
    <div class="summary-card">
      <h4 class="summary-title">分析总结</h4>
      <div class="summary-stats">
        <div class="stat-item">
          <div class="stat-value">{coreProblems.length}</div>
          <div class="stat-label">发现问题</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{trainingPriority.length}</div>
          <div class="stat-label">训练重点</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{trainingRecommendations.length}</div>
          <div class="stat-label">建议类别</div>
        </div>
      </div>
      <div class="summary-advice">
        <p class="text-sm text-gray-600">
          建议您根据优先级逐步改善发现的问题，持续跟踪训练效果，定期重新评估。
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .core-problems-container {
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .analysis-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .problems-section,
  .priority-section,
  .recommendations-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .no-problems {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: #f0fdf4;
    border-radius: 0.5rem;
    border: 1px solid #bbf7d0;
  }

  .no-problems-icon {
    font-size: 1.5rem;
  }

  .no-problems-text {
    flex: 1;
  }

  .problems-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .problem-item {
    padding: 1rem;
    border-radius: 0.5rem;
    border-width: 1px;
  }

  .problem-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .problem-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .problem-icon {
    font-size: 1.125rem;
  }

  .problem-name {
    font-weight: 600;
  }

  .problem-severity {
    flex-shrink: 0;
  }

  .severity-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;
  }

  .severity-badge.high {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .severity-badge.medium {
    background-color: #fef3c7;
    color: #92400e;
  }

  .severity-badge.low {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .problem-description {
    margin-top: 0.5rem;
  }

  .priority-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .priority-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
  }

  .priority-indicator {
    flex-shrink: 0;
    width: 6rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .priority-bar {
    height: 0.5rem;
    border-radius: 9999px;
  }

  .priority-value {
    font-size: 0.75rem;
    font-weight: 500;
    color: #4b5563;
  }

  .priority-content {
    flex: 1;
  }

  .priority-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .priority-area {
    font-weight: 600;
    color: #1f2937;
  }

  .priority-level {
    font-size: 0.75rem;
    font-weight: 500;
    color: #4b5563;
  }

  .priority-reason {
    font-size: 0.875rem;
    color: #4b5563;
  }

  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .recommendation-category {
    padding: 1rem;
    background-color: #eff6ff;
    border-radius: 0.5rem;
    border: 1px solid #bfdbfe;
  }

  .category-title {
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 0.5rem;
  }

  .category-recommendations {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .recommendation-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .recommendation-bullet {
    color: #3b82f6;
    font-weight: 700;
    flex-shrink: 0;
  }

  .recommendation-text {
    font-size: 0.875rem;
    color: #1d4ed8;
  }

  .summary-section {
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .summary-card {
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #bfdbfe;
    background: linear-gradient(to right, #eff6ff, #faf5ff);
  }

  .summary-title {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
  }

  .summary-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2563eb;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #4b5563;
  }

  .summary-advice {
    padding: 0.75rem;
    background-color: #fff;
    border-radius: 0.5rem;
  }

  @media (max-width: 768px) {
    .problem-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .priority-item {
      flex-direction: column;
      gap: 0.75rem;
    }

    .priority-indicator {
      width: 100%;
    }

    .summary-stats {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style> 