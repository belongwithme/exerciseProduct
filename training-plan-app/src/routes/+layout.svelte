<!-- 主布局文件 - 训练计划应用 -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { initAuth, user, authLoading, authError, cleanupAuth } from '$lib/stores/auth';
  // 引入全局样式
  import '../app.css';

  let initializationComplete = false;
  let initializationPromise: Promise<void> | null = null;

  // 初始化认证状态 - 只在组件挂载时执行一次
  onMount(() => {
    if (!initializationPromise) {
      initializationPromise = initializeApp();
    }
    return initializationPromise;
  });

  async function initializeApp(): Promise<void> {
    try {
      console.log('布局组件开始初始化应用...');
      await initAuth();
      initializationComplete = true;
      console.log('布局组件初始化完成');
    } catch (error) {
      console.error('布局组件初始化失败:', error);
      initializationComplete = true; // 即使失败也要显示页面
    }
  }

  // 清理资源
  onDestroy(() => {
    cleanupAuth();
  });

  // 计算是否应该显示加载界面
  $: shouldShowLoading = !initializationComplete;
</script>

<!-- 主要内容区域 -->
<main class="min-h-screen">
  {#if shouldShowLoading}
    <!-- 认证加载中 -->
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">正在初始化应用...</p>
        {#if $authError}
          <p class="text-red-600 mt-2 text-sm">{$authError}</p>
          <button 
            on:click={() => window.location.reload()} 
            class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重新加载
          </button>
        {/if}
      </div>
    </div>
  {:else}
    <!-- 应用主体内容 -->
    <slot />
  {/if}
</main>

<!-- 全局样式 -->
<style>
  /* 确保全局样式正确加载 */
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style> 