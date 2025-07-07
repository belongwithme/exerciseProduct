<!-- 图表基础组件 - 封装Chart.js的通用功能 -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, type ChartConfiguration } from 'chart.js/auto';

  // 图表配置属性
  export let config: ChartConfiguration;
  export let width: number = 400;
  export let height: number = 300;
  export let responsive: boolean = true;
  export let maintainAspectRatio: boolean = true;

  // 图表实例
  let chartInstance: Chart | null = null;
  let canvasElement: HTMLCanvasElement;

  /**
   * 初始化图表
   */
  function initChart() {
    if (!canvasElement || !config) return;

    try {
      // 销毁已存在的图表实例
      if (chartInstance) {
        chartInstance.destroy();
      }

      // 创建新的图表实例
      chartInstance = new Chart(canvasElement, {
        ...config,
        options: {
          ...config.options,
          responsive,
          maintainAspectRatio,
          // 确保图表在容器中正确显示
          plugins: {
            ...config.options?.plugins,
            legend: {
              display: true,
              position: 'bottom',
              ...config.options?.plugins?.legend
            }
          }
        }
      });
    } catch (error) {
      console.error('图表初始化失败:', error);
    }
  }

  /**
   * 更新图表数据
   */
  function updateChart() {
    if (!chartInstance || !config) return;

    try {
      // 更新数据
      chartInstance.data = config.data;
      
      // 更新选项
      if (config.options) {
        chartInstance.options = {
          ...chartInstance.options,
          ...config.options
        };
      }

      // 重新渲染图表
      chartInstance.update();
    } catch (error) {
      console.error('图表更新失败:', error);
    }
  }

  /**
   * 销毁图表实例
   */
  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  // 组件挂载时初始化图表
  onMount(() => {
    initChart();
  });

  // 组件销毁时清理图表
  onDestroy(() => {
    destroyChart();
  });

  // 监听配置变化，重新初始化图表
  $: if (config && canvasElement) {
    initChart();
  }

  // 导出图表实例供父组件使用
  export function getChartInstance(): Chart | null {
    return chartInstance;
  }

  // 导出更新方法供父组件使用
  export function updateChartData(newData: any) {
    if (chartInstance) {
      chartInstance.data = newData;
      chartInstance.update();
    }
  }

  // 导出重置方法供父组件使用
  export function resetChart() {
    initChart();
  }
</script>

<!-- 图表容器 -->
<div class="chart-container" style="width: {width}px; height: {height}px;">
  <canvas 
    bind:this={canvasElement}
    class="chart-canvas"
    aria-label="数据图表"
  ></canvas>
</div>

<style>
  .chart-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    min-height: 150px;
  }

  .chart-canvas {
    max-width: 100%;
    max-height: 100%;
  }

  @media (max-width: 768px) {
    .chart-container {
      width: 100%;
      height: auto;
    }
  }
</style> 