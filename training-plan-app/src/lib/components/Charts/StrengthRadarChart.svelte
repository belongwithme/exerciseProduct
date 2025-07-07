<!-- 力量结构评估图表组件 - 雷达图 -->
<script lang="ts">
  import RadarChart from './RadarChart.svelte';
  import type { ChartData, ChartOptions } from 'chart.js';
  import type { StrengthAssessment } from '../../types';

  // 组件属性
  export let strengthAssessment: StrengthAssessment;

  // Chart.js data and options
  let data: ChartData<'radar', number[], string>;
  let options: ChartOptions<'radar'>;

  // 监听数据变化，重新生成图表配置
  $: {
    const { upper_body, lower_body, core } = strengthAssessment;

    data = {
      labels: ['上肢力量', '下肢力量', '核心力量'],
      datasets: [
        {
          label: '当前力量水平 (分)',
          data: [upper_body, lower_body, core],
          backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointRadius: 5,
        },
        {
          label: '理想力量水平 (分)',
          data: [85, 80, 75], // Example ideal scores
          backgroundColor: 'rgba(34, 197, 94, 0.1)', // green-500
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(34, 197, 94)',
          pointBorderColor: '#fff',
          pointRadius: 5,
          borderDash: [5, 5],
        }
      ]
    };

    options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '力量结构评估',
          font: { size: 18, weight: 'bold' },
          padding: 20,
          color: '#1F2937' // gray-800
        },
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: { size: 12 },
            color: '#4B5563' // gray-600
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.dataset.label || '';
              const value = context.parsed.r;
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        r: {
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          pointLabels: {
            font: { size: 14, weight: 'bold' },
            color: 'rgb(55, 65, 81)' // gray-700
          },
          suggestedMax: 100,
          suggestedMin: 0
        }
      }
    };
  }

  // 计算力量等级和平衡性
  $: strengthLevel = getStrengthLevel(strengthAssessment.overall_score);
  $: balanceScore = calculateBalanceScore(strengthAssessment);

  /**
   * 获取力量等级描述
   */
  function getStrengthLevel(score: number): { level: string; color: string; } {
    if (score >= 80) return { level: '精英', color: 'text-purple-600' };
    if (score >= 60) return { level: '优秀', color: 'text-green-600' };
    if (score >= 40) return { level: '良好', color: 'text-blue-600' };
    if (score >= 20) return { level: '一般', color: 'text-yellow-600' };
    return { level: '初级', color: 'text-red-600' };
  }

  /**
   * 计算力量平衡评分
   */
  function calculateBalanceScore(assessment: StrengthAssessment): number {
    const { upper_body, lower_body, core } = assessment;
    const values = [upper_body, lower_body, core].filter(v => v > 0);
    if (values.length < 2) return 100;
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, Math.round(100 - (stdDev * 2)));
  }
</script>

<!-- 力量结构评估容器 -->
<div class="p-6 bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
  <!-- 标题和概览 -->
  <div class="mb-4">
    <h3 class="text-xl font-bold text-gray-800 mb-2">力量结构评估</h3>
    <div class="flex justify-between items-center text-sm text-gray-600">
      <div>
        <span>力量等级:</span>
        <span class="font-semibold {strengthLevel.color}">{strengthLevel.level}</span>
      </div>
      <div>
        <span>平衡评分:</span>
        <span class="font-semibold text-green-600">{balanceScore}分</span>
      </div>
    </div>
  </div>

  <!-- 图表区域 -->
  <div class="flex-grow flex items-center justify-center">
    <RadarChart {data} {options} />
  </div>
</div> 