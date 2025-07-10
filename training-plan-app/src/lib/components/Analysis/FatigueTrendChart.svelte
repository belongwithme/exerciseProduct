<!-- Epic 6: 疲劳趋势分析与休息建议 (Fatigue Analysis) -->
<!-- Task 6.4 (FE): 在疲劳指数组件中，使用图表库展示指数的历史趋势变化 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // 趋势数据类型定义
  interface TrendDataPoint {
    date: string;
    fatigue_index: number;
    fatigue_level: 'low' | 'moderate' | 'high' | 'critical';
  }

  interface TrendAnalysis {
    user_id: string;
    period_days: number;
    trend_data: TrendDataPoint[];
    generated_at: string;
  }

  // 组件属性
  export let days = 30; // 分析天数
  export let height = 300; // 图表高度
  export let preloadedData: TrendAnalysis | null = null; // 接收预加载的数据

  // 组件状态
  let trendData: TrendAnalysis | null = preloadedData;
  let loading = !preloadedData; // 如果有预加载数据，初始时不显示加载状态
  let error: string | null = null;

  // 获取趋势数据
  async function fetchTrendData(force = false) {
    // 如果没有强制刷新，并且已经有数据，则不重新获取
    if (!force && trendData) return;

    if (!browser) return;
    
    try {
      loading = true;
      error = null;

      const response = await fetch(`/api/fatigue-index?include_trend=true&trend_days=${days}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trend data');
      }

      const data = await response.json();
      trendData = data.trend_analysis;
      
    } catch (err) {
      console.error('Error fetching trend data:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  // 获取疲劳等级的颜色
  function getLevelColor(level: string): string {
    switch (level) {
      case 'low': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  }

  // 格式化日期
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  // 计算SVG路径
  function calculatePath(data: TrendDataPoint[], width: number, height: number): string {
    if (!data || data.length === 0) return '';
    
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const maxIndex = Math.max(...data.map(d => d.fatigue_index));
    const minIndex = Math.min(...data.map(d => d.fatigue_index));
    const indexRange = maxIndex - minIndex || 1;
    
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.fatigue_index - minIndex) / indexRange) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }

  // 计算数据点位置
  function calculatePoints(data: TrendDataPoint[], width: number, height: number): Array<{x: number, y: number, data: TrendDataPoint}> {
    if (!data || data.length === 0) return [];
    
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const maxIndex = Math.max(...data.map(d => d.fatigue_index));
    const minIndex = Math.min(...data.map(d => d.fatigue_index));
    const indexRange = maxIndex - minIndex || 1;
    
    return data.map((d, i) => ({
      x: padding + (i / (data.length - 1)) * chartWidth,
      y: padding + chartHeight - ((d.fatigue_index - minIndex) / indexRange) * chartHeight,
      data: d
    }));
  }

  // 获取趋势分析
  function getTrendAnalysis(data: TrendDataPoint[]): { trend: 'improving' | 'stable' | 'worsening', message: string } {
    if (!data || data.length < 2) {
      return { trend: 'stable', message: '数据不足，无法分析趋势' };
    }
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.fatigue_index, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.fatigue_index, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference < -5) {
      return { trend: 'improving', message: '疲劳指数呈下降趋势，身体状态在改善' };
    } else if (difference > 5) {
      return { trend: 'worsening', message: '疲劳指数呈上升趋势，需要注意休息' };
    } else {
      return { trend: 'stable', message: '疲劳指数相对稳定' };
    }
  }

  // 组件挂载时获取数据
  onMount(() => {
    // 只有在没有预加载数据时才在挂载时获取
    if (!preloadedData) {
      fetchTrendData();
    }
  });

  // 当预加载数据变化时，更新内部状态
  $: if (preloadedData) {
    trendData = preloadedData;
    loading = false;
    error = null;
  }

  // 响应式变量
  $: chartWidth = 600;
  $: chartHeight = height;
  $: trendAnalysis = trendData ? getTrendAnalysis(trendData.trend_data) : null;
</script>

<!-- 疲劳趋势图表 -->
<div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
  <!-- 头部 -->
  <div class="px-6 py-4 border-b border-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <span class="text-purple-600 text-xl">📈</span>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">疲劳趋势分析</h3>
          <p class="text-sm text-gray-500">过去 {days} 天的趋势变化</p>
        </div>
      </div>
      
      <!-- 天数选择器 -->
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600">天数:</label>
        <select 
          bind:value={days} 
          on:change={() => fetchTrendData(true)}
          class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value={14}>14天</option>
          <option value={30}>30天</option>
          <option value={60}>60天</option>
          <option value={90}>90天</option>
        </select>
        
        <button
          on:click={() => fetchTrendData(true)}
          disabled={loading}
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="刷新数据"
        >
          <svg class="w-5 h-5 {loading ? 'animate-spin' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- 图表内容 -->
  <div class="p-6">
    {#if loading}
      <!-- 加载状态 -->
      <div class="flex items-center justify-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span class="ml-3 text-gray-600">正在加载趋势数据...</span>
      </div>
    
    {:else if error}
      <!-- 错误状态 -->
      <div class="text-center py-16">
        <div class="text-red-500 text-4xl mb-2">⚠️</div>
        <p class="text-red-600 font-medium">加载失败</p>
        <p class="text-gray-500 text-sm mt-1">{error}</p>
        <button
          on:click={() => fetchTrendData(true)}
          class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          重试
        </button>
      </div>
    
    {:else if trendData && trendData.trend_data.length > 0}
      <!-- 趋势分析摘要 -->
      {#if trendAnalysis}
        <div class="mb-6 p-4 rounded-lg {trendAnalysis.trend === 'improving' ? 'bg-green-50 border border-green-200' : trendAnalysis.trend === 'worsening' ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}">
          <div class="flex items-center space-x-2">
            <span class="text-lg">
              {trendAnalysis.trend === 'improving' ? '📈' : trendAnalysis.trend === 'worsening' ? '📉' : '📊'}
            </span>
            <span class="font-medium {trendAnalysis.trend === 'improving' ? 'text-green-800' : trendAnalysis.trend === 'worsening' ? 'text-red-800' : 'text-blue-800'}">
              {trendAnalysis.message}
            </span>
          </div>
        </div>
      {/if}

      <!-- SVG 图表 -->
      <div class="relative">
        <svg width={chartWidth} height={chartHeight} class="w-full" viewBox="0 0 {chartWidth} {chartHeight}">
          <!-- 网格线 -->
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <!-- Y轴标签 -->
          <g class="text-xs fill-gray-500">
            <text x="10" y="30" text-anchor="start">100</text>
            <text x="10" y="80" text-anchor="start">75</text>
            <text x="10" y="130" text-anchor="start">50</text>
            <text x="10" y="180" text-anchor="start">25</text>
            <text x="10" y="230" text-anchor="start">0</text>
          </g>
          
          <!-- 趋势线 -->
          <path
            d={calculatePath(trendData.trend_data, chartWidth, chartHeight)}
            fill="none"
            stroke="#8b5cf6"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="drop-shadow-sm"
          />
          
          <!-- 数据点 -->
          {#each calculatePoints(trendData.trend_data, chartWidth, chartHeight) as point}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={getLevelColor(point.data.fatigue_level)}
              stroke="white"
              stroke-width="2"
              class="drop-shadow-sm cursor-pointer hover:r-8 transition-all"
            >
              <title>{formatDate(point.data.date)}: {point.data.fatigue_index}</title>
            </circle>
          {/each}
        </svg>
        
        <!-- 图例 -->
        <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span>状态良好 (≤30)</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>适中 (31-60)</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>较高 (61-80)</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <span>过高 (>80)</span>
          </div>
        </div>
      </div>

      <!-- 数据摘要 -->
      <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-gray-900">
            {(trendData.trend_data.map(d => d.fatigue_index).reduce((sum, val) => sum + val, 0) / trendData.trend_data.length).toFixed(1)}
          </div>
          <div class="text-sm text-gray-600">平均指数</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-red-600">
            {Math.max(...trendData.trend_data.map(d => d.fatigue_index)).toFixed(1)}
          </div>
          <div class="text-sm text-gray-600">最高指数</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">
            {Math.min(...trendData.trend_data.map(d => d.fatigue_index)).toFixed(1)}
          </div>
          <div class="text-sm text-gray-600">最低指数</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-orange-600">
            {trendData.trend_data.filter(d => d.fatigue_index > 80).length}
          </div>
          <div class="text-sm text-gray-600">高疲劳天数</div>
        </div>
      </div>
    
    {:else}
      <!-- 无数据状态 -->
      <div class="text-center py-16">
        <div class="text-gray-400 text-4xl mb-2">📈</div>
        <p class="text-gray-600">暂无趋势数据</p>
        <p class="text-gray-500 text-sm mt-1">请先完成更多训练记录来生成趋势分析</p>
      </div>
    {/if}
  </div>
</div>

<style>
  /* 自定义样式 */
  .drop-shadow-sm {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
</style> 