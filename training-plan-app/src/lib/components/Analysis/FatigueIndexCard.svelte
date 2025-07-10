<!-- src/lib/components/Analysis/FatigueIndexCard.svelte -->
<script lang="ts">
  // 该组件现在是一个纯粹的“展示型”组件
  // 它接收预加载的数据，并负责渲染UI

  // 疲劳指数数据类型定义
  interface FatigueAnalysis {
    fatigue_index: number;
    fatigue_level: 'low' | 'moderate' | 'high' | 'critical';
    recommendation: string;
    analysis_period: string;
    objective_metrics: {
      training_frequency: number;
      total_volume: number;
      avg_duration_minutes: number;
      total_sets: number;
    };
    subjective_metrics: {
      avg_status_score: number;
      avg_mood_score: number;
    };
    calculated_at: string;
  }

  // 组件属性
  export let showDetails = false; // 是否显示详细信息
  export let compact = false; // 紧凑模式
  export let preloadedData: FatigueAnalysis | null = null; // 接收预加载的数据

  // 组件状态
  $: fatigueData = preloadedData;

  // 获取疲劳等级的颜色和图标
  function getFatigueLevelStyle(level: string) {
    switch (level) {
      case 'low':
        return { color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: '😊', label: '状态良好' };
      case 'moderate':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', icon: '😐', label: '适中' };
      case 'high':
        return { color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', icon: '😰', label: '较高' };
      case 'critical':
        return { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: '😵', label: '过高' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', icon: '❓', label: '未知' };
    }
  }

  // 计算仪表盘的进度值（0-100）
  function getGaugeProgress(index: number): number {
    return Math.min(Math.max(index, 0), 100);
  }

  // 获取仪表盘的颜色
  function getGaugeColor(index: number): string {
    if (index <= 30) return '#10b981'; // green
    if (index <= 60) return '#f59e0b'; // yellow
    if (index <= 80) return '#f97316'; // orange
    return '#ef4444'; // red
  }
</script>

<!-- 疲劳指数卡片 -->
<div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
  <!-- 卡片头部 -->
  <div class="px-6 py-4 border-b border-gray-100">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <span class="text-blue-600 text-xl">🧠</span>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900">疲劳指数</h3>
        <p class="text-sm text-gray-500">基于过去7天的训练数据</p>
      </div>
    </div>
  </div>

  <!-- 卡片内容 -->
  <div class="p-6 flex-grow">
    {#if !fatigueData}
      <!-- 无数据或加载状态 -->
      <div class="flex items-center justify-center h-full">
          <div class="text-center text-gray-500">
            <div class="text-4xl mb-2">📊</div>
            <p>暂无数据</p>
          </div>
      </div>
    {:else}
      <!-- 疲劳指数显示 -->
      {@const levelStyle = getFatigueLevelStyle(fatigueData.fatigue_level)}
      {@const progress = getGaugeProgress(fatigueData.fatigue_index)}
      {@const gaugeColor = getGaugeColor(fatigueData.fatigue_index)}
      
      <div class="space-y-6">
        <!-- 主要指数显示 -->
        <div class="text-center">
          <!-- 仪表盘图 -->
          <div class="relative w-32 h-32 mx-auto mb-4">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" stroke-width="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={gaugeColor}
                stroke-width="8"
                stroke-dasharray={2 * Math.PI * 50}
                stroke-dashoffset={(2 * Math.PI * 50) * (1 - progress / 100)}
                stroke-linecap="round"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold" style="color: {gaugeColor}">{fatigueData.fatigue_index.toFixed(0)}</span>
              <span class="text-sm font-medium {levelStyle.color}">{levelStyle.label}</span>
            </div>
          </div>
          
          <!-- 建议文本 -->
          <p class="text-gray-600">{fatigueData.recommendation}</p>
        </div>

        <!-- 详细信息切换 -->
        <div>
          <button on:click={() => showDetails = !showDetails} class="text-sm text-blue-600 hover:underline">
            {showDetails ? '隐藏详细指标' : '显示详细指标'}
          </button>

          {#if showDetails}
            <div class="mt-4 p-4 rounded-lg {levelStyle.bgColor} border {levelStyle.borderColor} text-sm space-y-3">
              <h4 class="font-semibold text-gray-800 mb-2">指标详情 ({fatigueData.analysis_period})</h4>
              
              <!-- 客观指标 -->
              <div>
                <strong class="font-medium text-gray-700">客观负荷:</strong>
                <ul class="list-disc list-inside mt-1 text-gray-600 space-y-1">
                  <li>训练频率: {fatigueData.objective_metrics.training_frequency}次/周</li>
                  <li>总容量: {fatigueData.objective_metrics.total_volume.toFixed(0)} kg</li>
                  <li>平均时长: {fatigueData.objective_metrics.avg_duration_minutes.toFixed(0)} 分钟</li>
                  <li>总组数: {fatigueData.objective_metrics.total_sets} 组</li>
                </ul>
              </div>

              <!-- 主观指标 -->
              <div>
                <strong class="font-medium text-gray-700">主观感受:</strong>
                 <ul class="list-disc list-inside mt-1 text-gray-600 space-y-1">
                  <li>平均状态分: {fatigueData.subjective_metrics.avg_status_score.toFixed(2)}</li>
                  <li>平均心情分: {fatigueData.subjective_metrics.avg_mood_score.toFixed(2)}</li>
                </ul>
              </div>
              
              <p class="text-xs text-gray-400 pt-2 border-t border-gray-200/50">计算于: {new Date(fatigueData.calculated_at).toLocaleString()}</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div> 