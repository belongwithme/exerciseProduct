<!-- 主布局文件 - 训练计划应用 -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { user, initAuth } from '$lib/stores/auth'
  // 引入全局样式
  import '../app.css'

  onMount(() => {
    // 初始化认证状态
    initAuth()
  })
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
            href="/exercises"
            class="px-3 py-2 rounded"
            class:font-bold={$page.url.pathname === '/exercises'}
            class:text-blue-600={$page.url.pathname === '/exercises'}
            class:text-gray-600={$page.url.pathname !== '/exercises'}
            class:dark:text-white={$page.url.pathname !== '/exercises'}
          >
            动作库
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
            href="/calendar"
            class="px-3 py-2 rounded"
            class:font-bold={$page.url.pathname === '/calendar'}
            class:text-blue-600={$page.url.pathname === '/calendar'}
            class:text-gray-600={$page.url.pathname !== '/calendar'}
            class:dark:text-white={$page.url.pathname !== '/calendar'}
          >
            训练日历
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
  <slot />
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