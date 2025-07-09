<!-- 训练日志页面 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import TrainingLogger from '$lib/components/TrainingLogger.svelte';
  
  // 训练记录数据
  let workoutLogs: any[] = [];
  let isLoading = true;
  let error: string | null = null;
  
  // 统计数据
  let stats = {
    totalWorkouts: 0,
    totalDuration: 0,
    averageDuration: 0,
    currentStreak: 0,
    longestStreak: 0
  };
  
  // 过滤和排序选项
  let sortBy = 'date'; // 'date', 'duration', 'exercises'
  let sortOrder = 'desc'; // 'asc', 'desc'
  let filterBy = 'all'; // 'all', 'strength', 'cardio', 'flexibility'
  
  onMount(async () => {
    // 检查用户登录状态
    if (!$user) {
      goto('/auth');
      return;
    }
    
    await loadWorkoutLogs();
  });
  
  async function loadWorkoutLogs() {
    try {
      isLoading = true;
      error = null;
      
      // 这里应该调用API获取训练记录
      // 暂时使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      workoutLogs = [
        {
          id: 1,
          date: '2024-01-15',
          duration: 45,
          exercises: ['深蹲', '硬拉', '卧推'],
          type: 'strength',
          notes: '感觉不错，重量有所提升'
        },
        {
          id: 2,
          date: '2024-01-13',
          duration: 30,
          exercises: ['跑步', '拉伸'],
          type: 'cardio',
          notes: '轻松的有氧训练'
        },
        {
          id: 3,
          date: '2024-01-11',
          duration: 60,
          exercises: ['弹跳训练', '爆发力训练'],
          type: 'plyometric',
          notes: '专注提升弹跳力'
        }
      ];
      
      // 计算统计数据
      stats.totalWorkouts = workoutLogs.length;
      stats.totalDuration = workoutLogs.reduce((sum, log) => sum + log.duration, 0);
      stats.averageDuration = Math.round(stats.totalDuration / stats.totalWorkouts);
      stats.currentStreak = 3; // 模拟数据
      stats.longestStreak = 7; // 模拟数据
      
    } catch (err) {
      error = '加载训练记录失败，请稍后重试';
      console.error('加载训练记录失败:', err);
    } finally {
      isLoading = false;
    }
  }
  
  // 过滤和排序训练记录
  $: filteredLogs = workoutLogs
    .filter(log => filterBy === 'all' || log.type === filterBy)
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'duration':
          aVal = a.duration;
          bVal = b.duration;
          break;
        case 'exercises':
          aVal = a.exercises.length;
          bVal = b.exercises.length;
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }
  
  function getTypeLabel(type: string) {
    const typeMap: Record<string, string> = {
      strength: '力量训练',
      cardio: '有氧训练',
      flexibility: '柔韧性训练',
      plyometric: '爆发力训练',
      endurance: '耐力训练'
    };
    return typeMap[type] || type;
  }
  
  function getTypeColor(type: string) {
    const colorMap: Record<string, string> = {
      strength: 'bg-red-100 text-red-800',
      cardio: 'bg-blue-100 text-blue-800',
      flexibility: 'bg-green-100 text-green-800',
      plyometric: 'bg-purple-100 text-purple-800',
      endurance: 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  }
</script>

<svelte:head>
  <title>训练日志 - 弹跳训练营</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">训练日志</h1>
    <p class="text-gray-600 dark:text-gray-300">记录和追踪你的训练进度</p>
  </div>

  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-300">加载训练记录中...</span>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">加载失败</h3>
          <p class="mt-1 text-sm text-red-700">{error}</p>
          <button
            on:click={loadWorkoutLogs}
            class="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">总训练次数</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalWorkouts}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">总训练时长</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalDuration}分钟</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">平均时长</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.averageDuration}分钟</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">当前连续</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.currentStreak}天</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">最长连续</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.longestStreak}天</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和排序控件 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label for="filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">筛选类型</label>
          <select id="filter" bind:value={filterBy} class="border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="all">全部</option>
            <option value="strength">力量训练</option>
            <option value="cardio">有氧训练</option>
            <option value="flexibility">柔韧性训练</option>
            <option value="plyometric">爆发力训练</option>
          </select>
        </div>
        
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">排序方式</label>
          <select id="sort" bind:value={sortBy} class="border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="date">按日期</option>
            <option value="duration">按时长</option>
            <option value="exercises">按动作数量</option>
          </select>
        </div>
        
        <div>
          <label for="order" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">排序顺序</label>
          <select id="order" bind:value={sortOrder} class="border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="desc">降序</option>
            <option value="asc">升序</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 训练记录列表 -->
    <div class="space-y-4">
      {#each filteredLogs as log (log.id)}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDate(log.date)}
                </h3>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getTypeColor(log.type)}">
                  {getTypeLabel(log.type)}
                </span>
              </div>
              
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="mr-4">{log.duration} 分钟</span>
                
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{log.exercises.length} 个动作</span>
              </div>
              
              <div class="mb-3">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">训练动作：</p>
                <div class="flex flex-wrap gap-2">
                  {#each log.exercises as exercise}
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {exercise}
                    </span>
                  {/each}
                </div>
              </div>
              
              {#if log.notes}
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">训练笔记：</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{log.notes}</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无训练记录</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">开始你的第一次训练吧！</p>
          <div class="mt-6">
            <a href="/plans" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              查看训练计划
            </a>
          </div>
        </div>
      {/each}
    </div>

    <!-- 快速记录训练按钮 -->
    <div class="fixed bottom-6 right-6">
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        记录训练
      </button>
    </div>
  {/if}
</div> 