<!-- 工具箱页面 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  onMount(() => {
    // 检查用户登录状态
    if (!$user) {
      goto('/auth');
      return;
    }
  });
  
  // 工具列表
  const tools = [
    {
      id: 'share',
      name: '分享工具',
      description: '生成训练计划分享链接，与朋友分享你的训练成果',
      icon: 'share',
      url: '/tools/share',
      color: 'blue',
      available: true
    },
    {
      id: 'calculator',
      name: '训练计算器',
      description: '计算1RM、训练强度、卡路里消耗等',
      icon: 'calculator',
      url: '/tools/calculator',
      color: 'green',
      available: false
    },
    {
      id: 'timer',
      name: '训练计时器',
      description: '间歇训练计时器，支持自定义训练和休息时间',
      icon: 'clock',
      url: '/tools/timer',
      color: 'purple',
      available: false
    },
    {
      id: 'progress',
      name: '进度追踪',
      description: '可视化展示训练进度和成果统计',
      icon: 'chart',
      url: '/tools/progress',
      color: 'orange',
      available: false
    },
    {
      id: 'export',
      name: '数据导出',
      description: '导出训练数据为Excel或PDF格式',
      icon: 'download',
      url: '/tools/export',
      color: 'indigo',
      available: false
    },
    {
      id: 'backup',
      name: '数据备份',
      description: '备份和恢复你的训练数据',
      icon: 'shield',
      url: '/tools/backup',
      color: 'red',
      available: false
    }
  ];
  
  // 图标组件映射
  function getIcon(iconName: string) {
    const icons: Record<string, string> = {
      share: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />`,
      calculator: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />`,
      clock: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />`,
      chart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`,
      download: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />`,
      shield: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`
    };
    return icons[iconName] || icons.share;
  }
  
  function getColorClasses(color: string) {
    const colorMap: Record<string, { bg: string; text: string; hover: string; icon: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        hover: 'hover:bg-blue-100',
        icon: 'text-blue-500'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        hover: 'hover:bg-green-100',
        icon: 'text-green-500'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        hover: 'hover:bg-purple-100',
        icon: 'text-purple-500'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        hover: 'hover:bg-orange-100',
        icon: 'text-orange-500'
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        hover: 'hover:bg-indigo-100',
        icon: 'text-indigo-500'
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        hover: 'hover:bg-red-100',
        icon: 'text-red-500'
      }
    };
    return colorMap[color] || colorMap.blue;
  }
</script>

<svelte:head>
  <title>工具箱 - 弹跳训练营</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">工具箱</h1>
    <p class="text-gray-600 dark:text-gray-300">提升训练效率的实用工具集合</p>
  </div>

  <!-- 工具网格 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each tools as tool}
      {@const colors = getColorClasses(tool.color)}
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {#if tool.available}
          <a 
            href={tool.url}
            class="block p-6 transition-colors duration-200 {colors.hover}"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 {colors.bg} rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 {colors.icon}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {@html getIcon(tool.icon)}
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {tool.name}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  {tool.description}
                </p>
                <div class="mt-3">
                  <span class="inline-flex items-center text-sm font-medium {colors.text}">
                    使用工具
                    <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>
        {:else}
          <div class="p-6 opacity-50 cursor-not-allowed">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {@html getIcon(tool.icon)}
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {tool.name}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {tool.description}
                </p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  即将推出
                </span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- 使用提示 -->
  <div class="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">使用提示</h3>
        <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
          <ul class="list-disc list-inside space-y-1">
            <li>点击可用工具卡片即可开始使用</li>
            <li>标记为"即将推出"的工具正在开发中，敬请期待</li>
            <li>如果您有其他工具需求，欢迎向我们反馈</li>
            <li>所有工具均为免费使用，无需额外付费</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- 反馈区域 -->
  <div class="mt-8 text-center">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">需要其他工具？</h3>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      告诉我们您希望看到什么新功能，我们会优先考虑开发
    </p>
    <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      提交反馈
    </button>
  </div>
</div> 