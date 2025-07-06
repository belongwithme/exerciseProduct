<!-- 弹跳能力分析图表组件 - 甜甜圈图 -->
<script lang="ts">
  import DoughnutChart from './DoughnutChart.svelte';
  import type { ChartData, ChartOptions } from 'chart.js';
  import type { JumpAnalysis } from '../../types';

  // 组件属性
  export let jumpAnalysis: JumpAnalysis;
  
  // Chart.js data and options
  let data: ChartData<'doughnut'>;
  let options: ChartOptions<'doughnut'>;

  // 监听数据变化，重新生成图表配置
  $: {
    const {
      current_jump,
      target_jump,
      improvement_needed,
      strength_score,
      flexibility_score,
      technique_score
    } = jumpAnalysis;

    data = {
      labels: ['当前弹跳 (cm)', '需要提升 (cm)', '力量评分', '柔韧性评分', '技术评分'],
      datasets: [
        {
          label: '弹跳能力分析',
          data: [
            current_jump,
            improvement_needed > 0 ? improvement_needed : 0,
            strength_score,
            flexibility_score,
            technique_score
          ],
          backgroundColor: [
            '#10B981', // emerald-500
            '#F59E0B', // amber-500
            '#EF4444', // red-500
            '#8B5CF6', // violet-500
            '#3B82F6'  // blue-500
          ],
          borderColor: [
            '#ffffff',
          ],
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    };

    options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '弹跳能力综合评估',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: 20,
          color: '#1F2937' // gray-800
        },
        legend: {
          position: 'bottom',
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
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.parsed;
              return `${label}: ${value}`;
            }
          }
        }
      },
      cutout: '60%',
    };
  }

  // 计算能力等级
  $: abilityLevel = getAbilityLevel(jumpAnalysis.current_jump);
  $: overallScore = Math.round(
    (jumpAnalysis.strength_score + jumpAnalysis.flexibility_score + jumpAnalysis.technique_score) / 3
  );

  /**
   * 获取能力等级描述
   */
  function getAbilityLevel(jump: number): { level: string; color: string; description: string } {
    if (jump >= 80) {
      return { level: '精英', color: 'text-purple-600', description: '优秀的弹跳能力' };
    } else if (jump >= 60) {
      return { level: '优秀', color: 'text-green-600', description: '良好的弹跳能力' };
    } else if (jump >= 40) {
      return { level: '良好', color: 'text-blue-600', description: '中等的弹跳能力' };
    } else if (jump >= 20) {
      return { level: '一般', color: 'text-yellow-600', description: '有提升空间' };
    } else {
      return { level: '初级', color: 'text-red-600', description: '需要加强训练' };
    }
  }
</script>

<!-- 弹跳能力分析容器 -->
<div class="p-6 bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
  <!-- 标题和概览 -->
  <div class="mb-4">
    <h3 class="text-xl font-bold text-gray-800 mb-2">弹跳能力分析</h3>
    <div class="flex justify-between items-center text-sm text-gray-600">
      <div>
        <span>当前等级:</span>
        <span class="font-semibold {abilityLevel.color}">{abilityLevel.level}</span>
      </div>
      <div>
        <span>综合评分:</span>
        <span class="font-semibold text-blue-600">{overallScore}分</span>
      </div>
    </div>
  </div>

  <!-- 图表区域 -->
  <div class="flex-grow flex items-center justify-center">
    <DoughnutChart {data} {options} />
  </div>

  <!-- 详细数据 -->
  <div class="mt-4 pt-4 border-t border-gray-200">
    <div class="grid grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-sm text-gray-500">当前弹跳</div>
        <div class="text-lg font-bold text-gray-800">{jumpAnalysis.current_jump}cm</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">目标弹跳</div>
        <div class="text-lg font-bold text-gray-800">{jumpAnalysis.target_jump}cm</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">需要提升</div>
        <div class="text-lg font-bold text-orange-500">{jumpAnalysis.improvement_needed}cm</div>
      </div>
    </div>
  </div>
</div> 