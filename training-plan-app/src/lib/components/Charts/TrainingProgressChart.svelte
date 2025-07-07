<!-- 训练进度图表组件 - 环形图 -->
<script lang="ts">
  import DoughnutChart from './DoughnutChart.svelte';
  import type { ChartData, ChartOptions } from 'chart.js';
  import type { TrainingProgressData } from '../../types';

  // 组件属性
  export let progressData: TrainingProgressData;
  export let width: number = 400;
  export let height: number = 300;

  // Chart.js data and options
  let data: ChartData<'doughnut'>;
  let options: ChartOptions<'doughnut'>;

  // 监听数据变化，重新生成图表配置
  $: {
    if (progressData) {
      const {
        current_progress,
        target_progress,
        days_trained,
        total_days,
        completion_rate,
        streak_days
      } = progressData;

      // 计算剩余进度
      const remainingProgress = Math.max(0, target_progress - current_progress);

      data = {
        labels: ['已完成', '待完成'],
        datasets: [
          {
            label: '训练进度',
            data: [current_progress, remainingProgress],
            backgroundColor: [
              'rgb(59, 130, 246)', // blue-500 - 已完成
              'rgb(229, 231, 235)', // gray-200 - 待完成
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(229, 231, 235)',
            ],
            borderWidth: 2,
            hoverOffset: 8,
          }
        ]
      };

      options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%', // 环形图的内圆大小
        plugins: {
          title: {
            display: true,
            text: '训练进度总览',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20,
            color: '#1F2937' // gray-800
          },
          legend: {
            display: false // 我们将使用自定义图例
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.parsed;
                const percentage = Math.round((value / target_progress) * 100);
                return `${label}: ${value.toFixed(1)}% (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      };
    }
  }

  // 计算进度等级
  $: progressLevel = getProgressLevel(progressData?.current_progress || 0);
  $: completionPercentage = Math.round((progressData?.current_progress || 0));
  $: estimatedDaysLeft = calculateEstimatedDaysLeft(progressData);

  /**
   * 获取进度等级描述
   */
  function getProgressLevel(progress: number): {
    level: string;
    color: string;
    description: string;
  } {
    if (progress >= 90) {
      return { level: '优秀', color: 'text-green-600', description: '即将达成目标' };
    } else if (progress >= 70) {
      return { level: '良好', color: 'text-blue-600', description: '进展顺利' };
    } else if (progress >= 50) {
      return { level: '中等', color: 'text-yellow-600', description: '稳步提升' };
    } else if (progress >= 30) {
      return { level: '起步', color: 'text-orange-600', description: '需要坚持' };
    } else {
      return { level: '初始', color: 'text-red-600', description: '刚刚开始' };
    }
  }

  /**
   * 计算预估剩余天数
   */
  function calculateEstimatedDaysLeft(data: TrainingProgressData | null): number {
    if (!data || data.days_trained === 0) return 0;
    
    const { current_progress, target_progress, days_trained } = data;
    const remainingProgress = target_progress - current_progress;
    const progressPerDay = current_progress / days_trained;
    
    if (progressPerDay <= 0) return 0;
    
    return Math.ceil(remainingProgress / progressPerDay);
  }

  /**
   * 获取连续训练天数的评价
   */
  function getStreakEvaluation(days: number): {
    text: string;
    color: string;
    icon: string;
  } {
    if (days >= 30) {
      return { text: '超级坚持', color: 'text-purple-600', icon: '🔥' };
    } else if (days >= 14) {
      return { text: '非常坚持', color: 'text-green-600', icon: '💪' };
    } else if (days >= 7) {
      return { text: '坚持良好', color: 'text-blue-600', icon: '👍' };
    } else if (days >= 3) {
      return { text: '开始坚持', color: 'text-yellow-600', icon: '🌟' };
    } else {
      return { text: '加油坚持', color: 'text-gray-600', icon: '💪' };
    }
  }

  $: streakEvaluation = getStreakEvaluation(progressData?.streak_days || 0);
</script>

<!-- 训练进度图表容器 -->
<div class="p-6 bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
  <!-- 标题和进度等级 -->
  <div class="mb-4">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-xl font-bold text-gray-800">训练进度</h3>
      <div class="text-right">
        <div class="text-sm text-gray-500">当前等级</div>
        <div class="font-bold {progressLevel.color}">{progressLevel.level}</div>
      </div>
    </div>
    <div class="text-sm text-gray-600">{progressLevel.description}</div>
  </div>

  <!-- 图表区域 -->
  <div class="flex-grow flex items-center justify-center relative" style="min-height: 300px;">
    {#if progressData}
      <div class="relative">
        <DoughnutChart {data} {options} />
        <!-- 中心显示进度百分比 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-4xl font-bold text-blue-600">{completionPercentage}%</div>
            <div class="text-sm text-gray-500">完成度</div>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center text-gray-500">
        <div class="text-4xl mb-2">📊</div>
        <div class="text-lg font-medium">暂无进度数据</div>
        <div class="text-sm">开始训练后将显示您的进度</div>
      </div>
    {/if}
  </div>

  <!-- 详细统计信息 -->
  {#if progressData}
    <div class="mt-4 pt-4 border-t border-gray-200">
      <!-- 训练统计 -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{progressData.days_trained}</div>
          <div class="text-sm text-gray-500">已训练天数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{progressData.total_days}</div>
          <div class="text-sm text-gray-500">计划总天数</div>
        </div>
      </div>

      <!-- 连续训练天数 -->
      <div class="bg-gray-50 rounded-lg p-3 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-600">连续训练</div>
            <div class="text-lg font-bold text-gray-800">{progressData.streak_days} 天</div>
          </div>
          <div class="text-right">
            <div class="text-2xl">{streakEvaluation.icon}</div>
            <div class="text-sm font-medium {streakEvaluation.color}">
              {streakEvaluation.text}
            </div>
          </div>
        </div>
      </div>

      <!-- 预估信息 -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="text-center">
          <div class="text-lg font-bold text-purple-600">{estimatedDaysLeft}</div>
          <div class="text-gray-500">预估剩余天数</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-bold text-orange-600">
            {Math.round(progressData.completion_rate * 100)}%
          </div>
          <div class="text-gray-500">完成率</div>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="mt-4">
      <div class="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>整体进度</span>
        <span>{completionPercentage}% / 100%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div 
          class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
          style="width: {completionPercentage}%"
        ></div>
      </div>
    </div>

    <!-- 鼓励信息 -->
    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <div class="text-sm text-blue-800">
        {#if completionPercentage >= 80}
          🎉 太棒了！您已经接近目标了，继续保持！
        {:else if completionPercentage >= 60}
          💪 进展很好！坚持下去，胜利就在前方！
        {:else if completionPercentage >= 40}
          🌟 稳步前进中，每一次训练都是进步！
        {:else if completionPercentage >= 20}
          🚀 良好的开始！持续努力会看到更大的进步！
        {:else}
          💡 万事开头难，但您已经迈出了第一步！
        {/if}
      </div>
    </div>
  {/if}
</div> 