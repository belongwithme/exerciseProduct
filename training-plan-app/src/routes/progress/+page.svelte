<!-- 进度追踪页面 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import ProgressTracker from '$lib/components/Progress/ProgressTracker.svelte';
  import { demoProfile } from '$lib/data/demo';
  import { demoWorkoutLogs, demoLoggedSets } from '$lib/data/progressDemo';
  import type { Profile, WorkoutLog, LoggedSet } from '$lib/types';

  // 页面数据
  let profile: Profile = demoProfile;
  let workoutLogs: WorkoutLog[] = demoWorkoutLogs;
  let loggedSets: LoggedSet[] = demoLoggedSets;
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      // 这里可以添加从API获取数据的逻辑
      // 目前使用演示数据
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟加载时间
      isLoading = false;
    } catch (err) {
      console.error('加载进度数据时出错:', err);
      error = '加载数据失败，请刷新页面重试';
      isLoading = false;
    }
  });
</script>

<!-- 页面头部 -->
<svelte:head>
  <title>训练进度 - 训练计划</title>
  <meta name="description" content="查看您的训练进度和弹跳高度提升情况" />
</svelte:head>

<!-- 页面内容 -->
<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- 页面标题 -->
    <div class="mb-8">
      <nav class="flex" aria-label="面包屑">
        <ol class="flex items-center space-x-4">
          <li>
            <div>
              <a href="/" class="text-gray-400 hover:text-gray-500">
                <svg class="flex-shrink-0 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span class="sr-only">首页</span>
              </a>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="flex-shrink-0 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="ml-4 text-sm font-medium text-gray-500">训练进度</span>
            </div>
          </li>
        </ol>
      </nav>
    </div>

    <!-- 进度追踪组件 -->
    {#if isLoading}
      <div class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <span class="ml-4 text-xl text-gray-600">正在加载进度数据...</span>
      </div>
    {:else if error}
      <div class="max-w-md mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">加载失败</h3>
              <p class="text-sm text-red-700 mt-1">{error}</p>
              <div class="mt-4">
                <button 
                  class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors"
                  on:click={() => window.location.reload()}
                >
                  重新加载
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <ProgressTracker 
        {profile}
        {workoutLogs}
        {loggedSets}
      />
    {/if}
  </div>
</div>

<!-- 页面样式 -->
<style>
  /* 自定义滚动条样式 */
  :global(html) {
    scroll-behavior: smooth;
  }
  
  /* 响应式调整 */
  @media (max-width: 640px) {
    :global(.grid-cols-5) {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }
</style> 