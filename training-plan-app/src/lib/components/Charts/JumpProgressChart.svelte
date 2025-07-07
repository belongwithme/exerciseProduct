<!-- 弹跳高度进展图表组件 - 折线图 -->
<script lang="ts">
  import LineChart from './LineChart.svelte';
  import type { ChartData, ChartOptions } from 'chart.js';
  import type { JumpProgressData } from '../../types';

  // 组件属性
  export let progressData: JumpProgressData[];
  export let width: number = 400;
  export let height: number = 300;

  // Chart.js data and options
  let data: ChartData<'line', number[], string>;
  let options: ChartOptions<'line'>;

  // 监听数据变化，重新生成图表配置
  $: {
    if (progressData && progressData.length > 0) {
      // 处理日期标签
      const labels = progressData.map(item => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

      // 准备数据集
      data = {
        labels,
        datasets: [
          {
            label: '弹跳高度 (cm)',
            data: progressData.map(item => item.jump_height),
            borderColor: 'rgb(59, 130, 246)', // blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: '目标高度 (cm)',
            data: progressData.map(item => item.target_height),
            borderColor: 'rgb(34, 197, 94)', // green-500
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0,
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      };

      // 图表配置选项
      options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '弹跳高度进展趋势',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20,
            color: '#1F2937' // gray-800
          },
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              },
              color: '#4B5563' // gray-600
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            callbacks: {
              title: function(context: any) {
                const index = context[0].dataIndex;
                const date = new Date(progressData[index].date);
                return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
              },
              label: function(context: any) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${value}cm`;
              },
              afterBody: function(context: any) {
                const index = context[0].dataIndex;
                const current = progressData[index];
                const improvement = index > 0 
                  ? (current.jump_height - progressData[index - 1].jump_height).toFixed(1)
                  : '0.0';
                return [`提升: ${improvement}cm`];
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: '训练日期',
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#4B5563' // gray-600
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: '#6B7280' // gray-500
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: '弹跳高度 (cm)',
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#4B5563' // gray-600
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: '#6B7280' // gray-500
            },
            beginAtZero: false
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      };
    }
  }

  // 计算统计信息
  $: statistics = calculateStatistics(progressData);
  $: progressTrend = calculateTrend(progressData);

  /**
   * 计算统计信息
   */
  function calculateStatistics(data: JumpProgressData[]) {
    if (!data || data.length === 0) {
      return {
        totalImprovement: 0,
        averageImprovement: 0,
        bestSession: 0,
        currentHeight: 0,
        targetHeight: 0
      };
    }

    const first = data[0];
    const last = data[data.length - 1];
    const totalImprovement = last.jump_height - first.jump_height;
    const averageImprovement = totalImprovement / data.length;
    
    // 找到最佳单次提升
    let bestSession = 0;
    for (let i = 1; i < data.length; i++) {
      const improvement = data[i].jump_height - data[i - 1].jump_height;
      if (improvement > bestSession) {
        bestSession = improvement;
      }
    }

    return {
      totalImprovement: Math.round(totalImprovement * 10) / 10,
      averageImprovement: Math.round(averageImprovement * 10) / 10,
      bestSession: Math.round(bestSession * 10) / 10,
      currentHeight: Math.round(last.jump_height * 10) / 10,
      targetHeight: Math.round(last.target_height * 10) / 10
    };
  }

  /**
   * 计算趋势方向
   */
  function calculateTrend(data: JumpProgressData[]): 'up' | 'down' | 'stable' {
    if (!data || data.length < 2) return 'stable';
    
    const recentData = data.slice(-3); // 取最近3次数据
    const firstValue = recentData[0].jump_height;
    const lastValue = recentData[recentData.length - 1].jump_height;
    
    const difference = lastValue - firstValue;
    const threshold = 0.3; // 0.3cm的变化阈值
    
    if (difference > threshold) return 'up';
    if (difference < -threshold) return 'down';
    return 'stable';
  }

  /**
   * 获取趋势图标和颜色
   */
  function getTrendDisplay(trend: 'up' | 'down' | 'stable') {
    switch (trend) {
      case 'up':
        return { icon: '↗', color: 'text-green-600', text: '上升趋势' };
      case 'down':
        return { icon: '↘', color: 'text-red-600', text: '下降趋势' };
      default:
        return { icon: '→', color: 'text-gray-600', text: '稳定趋势' };
    }
  }

  $: trendDisplay = getTrendDisplay(progressTrend);
</script>

<!-- 弹跳高度进展图表容器 -->
<div class="p-6 bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
  <!-- 标题和统计信息 -->
  <div class="mb-4">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-xl font-bold text-gray-800">弹跳高度进展</h3>
      <div class="flex items-center space-x-2">
        <span class="text-2xl">{trendDisplay.icon}</span>
        <span class="text-sm font-medium {trendDisplay.color}">{trendDisplay.text}</span>
      </div>
    </div>
    
    <!-- 快速统计 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div class="text-center">
        <div class="text-lg font-bold text-blue-600">{statistics.currentHeight}cm</div>
        <div class="text-gray-500">当前高度</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-green-600">{statistics.totalImprovement}cm</div>
        <div class="text-gray-500">总提升</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-purple-600">{statistics.averageImprovement}cm</div>
        <div class="text-gray-500">平均提升</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-orange-600">{statistics.bestSession}cm</div>
        <div class="text-gray-500">最佳单次</div>
      </div>
    </div>
  </div>

  <!-- 图表区域 -->
  <div class="flex-grow flex items-center justify-center" style="min-height: 300px;">
    {#if progressData && progressData.length > 0}
      <LineChart {data} {options} />
    {:else}
      <div class="text-center text-gray-500">
        <div class="text-4xl mb-2">📈</div>
        <div class="text-lg font-medium">暂无进展数据</div>
        <div class="text-sm">开始训练后将显示您的进展趋势</div>
      </div>
    {/if}
  </div>

  <!-- 进度指示器 -->
  {#if progressData && progressData.length > 0}
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>距离目标</span>
        <span>{Math.max(0, statistics.targetHeight - statistics.currentHeight).toFixed(1)}cm</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style="width: {Math.min(100, (statistics.currentHeight / statistics.targetHeight) * 100)}%"
        ></div>
      </div>
      <div class="text-xs text-gray-500 mt-1 text-center">
        {Math.min(100, Math.round((statistics.currentHeight / statistics.targetHeight) * 100))}% 完成
      </div>
    </div>
  {/if}
</div> 