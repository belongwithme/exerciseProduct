<!-- 弹跳分析图表组件 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { JumpAnalysis } from '$lib/utils/analysis';
  
  export let data: JumpAnalysis;
  
  let chartContainer: HTMLCanvasElement;
  
  onMount(async () => {
    // 动态导入 Chart.js 以避免服务端渲染问题
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    
    if (chartContainer) {
      new Chart(chartContainer, {
        type: 'doughnut',
        data: {
          labels: ['当前弹跳', '待提升空间'],
          datasets: [{
            data: [data.current_jump, data.improvement_needed],
            backgroundColor: [
              '#3B82F6', // 蓝色
              '#E5E7EB'  // 灰色
            ],
            borderWidth: 0,
            cutout: '60%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  return `${label}: ${value}cm`;
                }
              }
            }
          }
        }
      });
    }
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">弹跳能力分析</h3>
  
  <div class="relative h-64 mb-4">
    <canvas bind:this={chartContainer}></canvas>
  </div>
  
  <!-- 数据指标 -->
  <div class="grid grid-cols-2 gap-4">
    <div class="text-center">
      <div class="text-2xl font-bold text-blue-600">{data.current_jump}cm</div>
      <div class="text-sm text-gray-600 dark:text-gray-400">当前弹跳高度</div>
    </div>
    <div class="text-center">
      <div class="text-2xl font-bold text-green-600">{data.improvement_needed}cm</div>
      <div class="text-sm text-gray-600 dark:text-gray-400">提升潜力</div>
    </div>
  </div>
  
  <!-- 效率指标 -->
  <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div class="grid grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-lg font-semibold text-gray-900 dark:text-white">{data.relative_strength.toFixed(1)}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">相对力量</div>
      </div>
      <div>
        <div class="text-lg font-semibold text-gray-900 dark:text-white">{data.speed_strength}%</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">速度力量</div>
      </div>
      <div>
        <div class="text-lg font-semibold text-gray-900 dark:text-white">{data.jump_efficiency}%</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">弹跳效率</div>
      </div>
    </div>
  </div>
</div> 