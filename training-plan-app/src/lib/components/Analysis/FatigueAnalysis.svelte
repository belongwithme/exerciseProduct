<!-- src/lib/components/Analysis/FatigueAnalysis.svelte -->
<script lang="ts">
  import FatigueIndexCard from '$lib/components/Analysis/FatigueIndexCard.svelte';
  import FatigueTrendChart from '$lib/components/Analysis/FatigueTrendChart.svelte';

  // 该组件接收从 `load` 函数预加载的数据
  export let data: any;

  // 从 prop 中解构出需要的数据
  $: fatigueData = data?.current_analysis;
  $: trendData = data?.trend_analysis; // Corrected from trend_data to trend_analysis
  $: error = data?.error;

</script>

{#if error}
  <!-- 全局错误状态 -->
  <div class="col-span-1 lg:col-span-2 bg-red-50 text-red-700 p-6 rounded-lg border border-red-200">
    <h3 class="font-semibold text-lg mb-2">无法加载疲劳分析</h3>
    <p class="mb-4">{error}</p>
    
    <!-- 错误解决方案提示 -->
    <div class="bg-white p-4 rounded-lg border border-red-300">
      <h4 class="font-semibold text-red-800 mb-2">可能的解决方案：</h4>
      <ul class="text-sm text-red-700 space-y-1 list-disc list-inside">
        <li>确保您已登录账户</li>
        <li>检查数据库函数是否已正确部署</li>
        <li>尝试刷新页面或稍后重试</li>
        <li>如果问题持续，请联系技术支持</li>
      </ul>
      <div class="mt-3">
        <button 
          on:click={() => window.location.reload()} 
          class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          刷新页面
        </button>
      </div>
    </div>
  </div>
{:else if data}
  <!-- 正常显示 -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- 疲劳指数卡片 -->
    <!-- 将预加载的数据传递给子组件 -->
    <FatigueIndexCard preloadedData={fatigueData} />
    
    <!-- 疲劳趋势图表 -->
    <!-- 将预加载的数据传递给子组件 -->
    <FatigueTrendChart preloadedData={trendData} />
  </div>
{:else}
    <!-- 加载状态或无数据状态 -->
    <div class="col-span-1 lg:col-span-2 flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <span class="text-gray-600 text-lg font-medium">正在加载疲劳分析模块...</span>
      <span class="text-gray-500 text-sm mt-2">首次加载可能需要几秒钟</span>
      
      <!-- 如果加载时间过长的提示 -->
      <div class="mt-6 text-center">
        <p class="text-gray-500 text-sm mb-2">如果加载时间过长，可能是以下原因：</p>
        <ul class="text-xs text-gray-400 space-y-1">
          <li>• 数据库函数未部署</li>
          <li>• 网络连接问题</li>
          <li>• 服务器正在处理大量数据</li>
        </ul>
      </div>
    </div>
{/if} 