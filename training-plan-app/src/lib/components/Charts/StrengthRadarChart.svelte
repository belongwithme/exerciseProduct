<!-- 力量结构雷达图组件 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { StrengthAssessment } from '$lib/utils/analysis';
  
  export let data: StrengthAssessment;
  
  let chartContainer: HTMLCanvasElement;
  
  onMount(async () => {
    // 动态导入 Chart.js 以避免服务端渲染问题
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    
    if (chartContainer) {
      new Chart(chartContainer, {
        type: 'radar',
        data: {
          labels: ['上肢力量', '下肢力量', '核心力量', '平衡能力'],
          datasets: [{
            label: '力量评估',
            data: [
              data.upper_body_score,
              data.lower_body_score,
              data.core_score,
              data.balance_score
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(59, 130, 246)',
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              pointLabels: {
                font: {
                  size: 12
                }
              },
              ticks: {
                stepSize: 20,
                display: false // 隐藏刻度标签
              }
            }
          },
          plugins: {
            legend: {
              display: false // 隐藏图例
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  return `${context.label}: ${context.parsed.r}/100`;
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
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">力量结构分析</h3>
  
  <div class="relative h-64 mb-4">
    <canvas bind:this={chartContainer}></canvas>
  </div>
  
  <!-- 数据指标 -->
  <div class="grid grid-cols-2 gap-4">
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">上肢力量</span>
        <span class="font-semibold text-gray-900 dark:text-white">{data.upper_body_score}/100</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full" style="width: {data.upper_body_score}%"></div>
      </div>
    </div>
    
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">下肢力量</span>
        <span class="font-semibold text-gray-900 dark:text-white">{data.lower_body_score}/100</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-green-600 h-2 rounded-full" style="width: {data.lower_body_score}%"></div>
      </div>
    </div>
    
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">核心力量</span>
        <span class="font-semibold text-gray-900 dark:text-white">{data.core_score}/100</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-purple-600 h-2 rounded-full" style="width: {data.core_score}%"></div>
      </div>
    </div>
    
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600 dark:text-gray-400">平衡能力</span>
        <span class="font-semibold text-gray-900 dark:text-white">{data.balance_score}/100</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-orange-600 h-2 rounded-full" style="width: {data.balance_score}%"></div>
      </div>
    </div>
  </div>
  
  <!-- 综合评分 -->
  <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
    <div class="text-2xl font-bold text-blue-600">{data.overall_score}/100</div>
    <div class="text-sm text-gray-600 dark:text-gray-400">综合力量评分</div>
  </div>
</div> 