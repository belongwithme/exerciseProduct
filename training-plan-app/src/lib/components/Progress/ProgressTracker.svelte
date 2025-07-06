<!-- 进度追踪主组件 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import JumpProgressChart from '../Charts/JumpProgressChart.svelte';
  import TrainingProgressChart from '../Charts/TrainingProgressChart.svelte';
  import { generateProgressStats } from '../../utils/progress';
  import type { Profile, WorkoutLog, LoggedSet, ProgressStats } from '../../types';

  // 组件属性
  export let profile: Profile;
  export let workoutLogs: WorkoutLog[] = [];
  export let loggedSets: LoggedSet[] = [];

  // 进度统计数据
  let progressStats: ProgressStats | null = null;
  let isLoading = true;
  let error: string | null = null;

  // 选择的时间范围
  let timeRange: 'week' | 'month' | 'all' = 'month';

  // 时间范围选项
  const timeRangeOptions: Array<{key: 'week' | 'month' | 'all', label: string}> = [
    { key: 'week', label: '最近一周' },
    { key: 'month', label: '最近一月' },
    { key: 'all', label: '全部时间' }
  ];

  // 计算进度统计
  $: {
    if (profile && workoutLogs) {
      try {
        progressStats = generateProgressStats(profile, workoutLogs, loggedSets);
        isLoading = false;
        error = null;
      } catch (err) {
        console.error('计算进度统计时出错:', err);
        error = '计算进度数据时出现错误';
        isLoading = false;
      }
    }
  }

  // 根据时间范围过滤数据
  $: filteredJumpProgress = progressStats?.jump_progress ? 
    filterByTimeRange(progressStats.jump_progress, timeRange) : [];

  /**
   * 根据时间范围过滤数据
   */
  function filterByTimeRange(data: any[], range: 'week' | 'month' | 'all') {
    if (range === 'all') return data;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (range === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  }

  /**
   * 计算总体进度摘要
   */
  function calculateOverallSummary(stats: ProgressStats | null) {
    if (!stats) return null;
    
    const { jump_progress, training_progress, monthly_comparison } = stats;
    
    // 计算弹跳提升
    const jumpImprovement = jump_progress.length > 0 
      ? jump_progress[jump_progress.length - 1].jump_height - jump_progress[0].jump_height
      : 0;
    
    // 计算训练频率
    const trainingFrequency = training_progress.days_trained > 0 
      ? training_progress.days_trained / (training_progress.total_days || 90) * 100
      : 0;
    
    // 月度对比
    const monthlyImprovement = monthly_comparison.current_month.improvement - 
      monthly_comparison.previous_month.improvement;
    
    return {
      jumpImprovement: Math.round(jumpImprovement * 10) / 10,
      trainingFrequency: Math.round(trainingFrequency),
      monthlyImprovement: Math.round(monthlyImprovement * 10) / 10,
      currentProgress: Math.round(training_progress.current_progress),
      streakDays: training_progress.streak_days
    };
  }

  $: overallSummary = calculateOverallSummary(progressStats);

  onMount(() => {
    // 组件挂载时的初始化逻辑
    console.log('进度追踪组件已挂载');
  });
</script>

<!-- 进度追踪主容器 -->
<div class="space-y-6">
  <!-- 页面标题和时间范围选择 -->
  <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">训练进度追踪</h2>
        <p class="text-gray-600">追踪您的弹跳高度提升和训练完成情况</p>
      </div>
      
      <!-- 时间范围选择器 -->
      <div class="flex space-x-2 mt-4 sm:mt-0">
        {#each timeRangeOptions as range}
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {
              timeRange === range.key 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }"
            on:click={() => timeRange = range.key}
          >
            {range.label}
          </button>
        {/each}
      </div>
    </div>

    <!-- 总体进度摘要 -->
    {#if overallSummary && !isLoading}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{overallSummary.currentProgress}%</div>
          <div class="text-sm text-gray-500">总体进度</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">+{overallSummary.jumpImprovement}cm</div>
          <div class="text-sm text-gray-500">弹跳提升</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{overallSummary.trainingFrequency}%</div>
          <div class="text-sm text-gray-500">训练频率</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{overallSummary.streakDays}</div>
          <div class="text-sm text-gray-500">连续天数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold {overallSummary.monthlyImprovement >= 0 ? 'text-green-600' : 'text-red-600'}">
            {overallSummary.monthlyImprovement >= 0 ? '+' : ''}{overallSummary.monthlyImprovement}cm
          </div>
          <div class="text-sm text-gray-500">月度变化</div>
        </div>
      </div>
    {/if}
  </div>

  <!-- 加载状态 -->
  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">正在计算进度数据...</span>
    </div>
  {/if}

  <!-- 错误状态 -->
  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="text-red-400">⚠️</div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">数据加载错误</h3>
          <p class="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- 进度图表区域 -->
  {#if progressStats && !isLoading && !error}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 弹跳高度进展折线图 -->
      <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <JumpProgressChart 
          progressData={filteredJumpProgress}
          width={500}
          height={400}
        />
      </div>

      <!-- 训练进度环形图 -->
      <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <TrainingProgressChart 
          progressData={progressStats.training_progress}
          width={500}
          height={400}
        />
      </div>
    </div>

    <!-- 详细统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 周统计 -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4">周统计数据</h3>
        {#if progressStats.weekly_stats.length > 0}
          <div class="space-y-3">
            {#each progressStats.weekly_stats.slice(-4) as weekStat}
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">第{weekStat.week}周</span>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-800">
                    {weekStat.workouts_completed}次训练
                  </div>
                  <div class="text-xs text-gray-500">
                    {Math.round(weekStat.total_duration / 60)}小时
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center text-gray-500 py-4">
            <div class="text-2xl mb-2">📊</div>
            <div class="text-sm">暂无周统计数据</div>
          </div>
        {/if}
      </div>

      <!-- 月度对比 -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4">月度对比</h3>
        <div class="space-y-4">
          <!-- 当月数据 -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-sm font-medium text-blue-800 mb-2">本月</div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div class="text-blue-600 font-bold">
                  {progressStats.monthly_comparison.current_month.workouts}
                </div>
                <div class="text-blue-500">训练次数</div>
              </div>
              <div>
                <div class="text-blue-600 font-bold">
                  +{progressStats.monthly_comparison.current_month.improvement}cm
                </div>
                <div class="text-blue-500">弹跳提升</div>
              </div>
            </div>
          </div>

          <!-- 上月数据 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-sm font-medium text-gray-800 mb-2">上月</div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div class="text-gray-600 font-bold">
                  {progressStats.monthly_comparison.previous_month.workouts}
                </div>
                <div class="text-gray-500">训练次数</div>
              </div>
              <div>
                <div class="text-gray-600 font-bold">
                  +{progressStats.monthly_comparison.previous_month.improvement}cm
                </div>
                <div class="text-gray-500">弹跳提升</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 激励信息 -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold mb-2">坚持就是胜利！</h3>
                     <p class="text-blue-100">
             {#if overallSummary && overallSummary.streakDays >= 7}
               🔥 您已经连续训练{overallSummary.streakDays}天了，太棒了！
             {:else if overallSummary && overallSummary.streakDays >= 3}
               💪 连续{overallSummary.streakDays}天的坚持，继续保持！
             {:else}
               🌟 每一次训练都是进步，加油！
             {/if}
           </p>
         </div>
         <div class="text-4xl">
           {#if overallSummary && overallSummary.currentProgress >= 80}
             🎉
           {:else if overallSummary && overallSummary.currentProgress >= 60}
             💪
           {:else if overallSummary && overallSummary.currentProgress >= 40}
             🚀
           {:else}
             🌟
           {/if}
         </div>
      </div>
    </div>
  {/if}

  <!-- 空状态 -->
  {#if !progressStats && !isLoading && !error}
    <div class="text-center py-12">
      <div class="text-6xl mb-4">📈</div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">开始您的训练之旅</h3>
      <p class="text-gray-600 mb-6">完成第一次训练后，您将看到详细的进度分析</p>
      <a 
        href="/plans" 
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        查看训练计划
      </a>
    </div>
  {/if}
</div> 