<!-- Epic 6: 疲劳趋势分析与休息建议 (Fatigue Analysis) -->
<!-- Task 6.5 (FE): 实现主动提醒功能，当疲劳指数超过80时弹出提醒 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // 疲劳数据类型
  interface FatigueData {
    user_id: string;
    fatigue_index: number;
    fatigue_level: 'low' | 'moderate' | 'high' | 'critical';
    objective_score: number;
    subjective_score: number;
    recommendations: string;
    generated_at: string;
  }

  // 组件状态
  let showAlert = false;
  let fatigueData: FatigueData | null = null;
  let alertDismissed = false;

  // 本地存储键名
  const ALERT_DISMISSED_KEY = 'fatigue_alert_dismissed';
  const LAST_CHECK_KEY = 'fatigue_last_check';

  // 检查是否需要显示提醒
  async function checkFatigueAlert() {
    if (!browser || alertDismissed) return;

    try {
      // 检查是否在同一天已经检查过
      const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
      const today = new Date().toDateString();
      
      if (lastCheck === today) {
        // 今天已经检查过，检查是否被用户关闭
        const dismissed = localStorage.getItem(ALERT_DISMISSED_KEY);
        if (dismissed === today) {
          return;
        }
      }

      // 获取当前疲劳指数
      const response = await fetch('/api/fatigue-index');
      
      if (!response.ok) {
        console.warn('Failed to fetch fatigue index for alert check');
        return;
      }

      const data = await response.json();
      
      if (data.fatigue_analysis && data.fatigue_analysis.fatigue_index > 80) {
        fatigueData = data.fatigue_analysis;
        showAlert = true;
        
        // 记录检查时间
        localStorage.setItem(LAST_CHECK_KEY, today);
      }
      
    } catch (error) {
      console.warn('Error checking fatigue alert:', error);
    }
  }

  // 关闭提醒
  function dismissAlert() {
    showAlert = false;
    alertDismissed = true;
    
    // 记录今天已关闭提醒
    const today = new Date().toDateString();
    localStorage.setItem(ALERT_DISMISSED_KEY, today);
  }

  // 稍后提醒（1小时后）
  function snoozeAlert() {
    showAlert = false;
    
    // 1小时后再次检查
    setTimeout(() => {
      if (!alertDismissed) {
        showAlert = true;
      }
    }, 60 * 60 * 1000); // 1小时
  }

  // 获取疲劳等级的样式
  function getFatigueStyle(level: string) {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '🚨'
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200', 
          text: 'text-orange-800',
          icon: '⚠️'
        };
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: '⚡'
        };
    }
  }

  // 组件挂载时检查
  onMount(() => {
    // 延迟检查，避免影响页面加载
    setTimeout(checkFatigueAlert, 2000);
  });
</script>

<!-- 疲劳提醒弹窗 -->
{#if showAlert && fatigueData}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="fatigue-alert-title">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
      <!-- 头部 -->
      <div class="px-6 py-4 {getFatigueStyle(fatigueData.fatigue_level).bg} {getFatigueStyle(fatigueData.fatigue_level).border} border-b">
        <div class="flex items-center space-x-3">
          <div class="text-2xl">
            {getFatigueStyle(fatigueData.fatigue_level).icon}
          </div>
          <div>
            <h3 id="fatigue-alert-title" class="text-lg font-semibold {getFatigueStyle(fatigueData.fatigue_level).text}">
              疲劳指数过高提醒
            </h3>
            <p class="text-sm {getFatigueStyle(fatigueData.fatigue_level).text} opacity-80">
              当前疲劳指数: {fatigueData.fatigue_index.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <!-- 内容 -->
      <div class="px-6 py-4">
        <div class="mb-4">
          <p class="text-gray-700 mb-3">
            您的疲劳指数已经超过80，建议您适当休息调整。
          </p>
          
          <!-- 疲劳指数可视化 -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>疲劳指数</span>
              <span>{fatigueData.fatigue_index.toFixed(1)}/100</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-500 {fatigueData.fatigue_index > 90 ? 'bg-red-500' : fatigueData.fatigue_index > 80 ? 'bg-orange-500' : 'bg-yellow-500'}"
                style="width: {Math.min(fatigueData.fatigue_index, 100)}%"
              ></div>
            </div>
          </div>

          <!-- 建议 -->
          {#if fatigueData.recommendations}
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-start space-x-2">
                <span class="text-blue-500 text-sm">💡</span>
                <div>
                  <p class="text-sm font-medium text-blue-800 mb-1">建议</p>
                  <p class="text-sm text-blue-700">{fatigueData.recommendations}</p>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- 详细指标 -->
        <div class="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">详细指标</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500">客观评分:</span>
              <span class="font-medium text-gray-800 ml-1">{fatigueData.objective_score.toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-500">主观评分:</span>
              <span class="font-medium text-gray-800 ml-1">{fatigueData.subjective_score.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
        <button
          on:click={snoozeAlert}
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          稍后提醒
        </button>
        <button
          on:click={dismissAlert}
          class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          我知道了
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* 确保弹窗在最顶层 */
  :global(.fixed.z-50) {
    z-index: 9999;
  }
</style> 