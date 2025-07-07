<!-- 主布局文件 - 训练计划应用 -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { initAuth, user, authLoading, authError, cleanupAuth } from '$lib/stores/auth';
  import { page } from '$app/stores';
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

<!-- 全局页眉 -->
<header class="bg-white dark:bg-gray-800 shadow-md">
  <nav class="container mx-auto px-4 py-2 flex justify-between items-center">
    <a href="/" class="text-xl font-bold text-blue-600 dark:text-blue-400"> 弹跳训练营 </a>
    {#if $user}
      <ul class="flex items-center space-x-4">
        <li>
          <a
            href="/analysis"
            class="px-3 py-2 rounded"
            class:font-bold={$page.url.pathname === '/analysis'}
            class:text-blue-600={$page.url.pathname === '/analysis'}
            class:text-gray-600={$page.url.pathname !== '/analysis'}
            class:dark:text-white={$page.url.pathname !== '/analysis'}
          >
            能力分析
          </a>
        </li>
        <li>
          <a
            href="/plans"
            class="px-3 py-2 rounded"
            class:font-bold={$page.url.pathname === '/plans'}
            class:text-blue-600={$page.url.pathname === '/plans'}
            class:text-gray-600={$page.url.pathname !== '/plans'}
            class:dark:text-white={$page.url.pathname !== '/plans'}
          >
            训练计划
          </a>
        </li>
        <li>
          <a
            href="/log"
            class="px-3 py-2 rounded"
            class:font-bold={$page.url.pathname === '/log'}
            class:text-blue-600={$page.url.pathname === '/log'}
            class:text-gray-600={$page.url.pathname !== '/log'}
            class:dark:text-white={$page.url.pathname !== '/log'}
          >
            训练日志
          </a>
        </li>
        <li>
          <a
            href="/tools"
            class="px-3 py-2 rounded"
            class:font-bold={$page.url.pathname.startsWith('/tools')}
            class:text-blue-600={$page.url.pathname.startsWith('/tools')}
            class:text-gray-600={!$page.url.pathname.startsWith('/tools')}
            class:dark:text-white={!$page.url.pathname.startsWith('/tools')}
          >
            工具箱
          </a>
        </li>
        <li>
          <a
            href="/profile"
            class="px-3 py-2 rounded"
            class:font-bold={$page.url.pathname === '/profile'}
            class:text-blue-600={$page.url.pathname === '/profile'}
            class:text-gray-600={$page.url.pathname !== '/profile'}
            class:dark:text-white={$page.url.pathname !== '/profile'}
          >
            个人资料
          </a>
        </li>
        <li>
          <a
            href="/setup-demo"
            class="px-3 py-2 rounded text-sm bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-700"
          >
            设置演示数据
          </a>
        </li>
      </ul>
    {/if}
  </nav>
</header>

<!-- 主要内容区域 -->
<main class="min-h-screen bg-gray-50 dark:bg-gray-900">
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