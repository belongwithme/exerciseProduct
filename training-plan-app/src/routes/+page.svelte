<!-- 主页面 - 训练计划应用 -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { user, signOut } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  
  // 页面标题
  const pageTitle = "训练计划管理系统";
  
  // 功能模块
  const features = [
    {
      title: '训练计划',
      description: '创建和管理个性化训练计划',
      icon: '📋',
      href: '/plans',
      color: 'blue'
    },
    {
      title: '能力分析',
      description: '分析弹跳能力和力量结构',
      icon: '📊',
      href: '/analysis',
      color: 'green'
    },
    {
      title: '进度追踪',
      description: '追踪训练进度和成果',
      icon: '📈',
      href: '/progress',
      color: 'purple'
    },
    {
      title: '训练记录',
      description: '记录每日训练数据',
      icon: '✍️',
      href: '/log',
      color: 'orange'
    },
    {
      title: '工具箱',
      description: '实用训练辅助工具',
      icon: '🛠️',
      href: '/tools',
      color: 'indigo'
    },
    {
      title: '个人资料',
      description: '管理个人信息和目标',
      icon: '👤',
      href: '/profile',
      color: 'pink'
    }
  ];

  // 快速统计数据
  let stats = {
    plans: 0,
    workouts: 0,
    streak: 0
  };

  onMount(async () => {
    if ($user) {
      // 这里可以加载用户的统计数据
      // 暂时使用模拟数据
      stats = {
        plans: 3,
        workouts: 12,
        streak: 5
      };
    }
  });

  /**
   * 处理登出
   */
  async function handleSignOut() {
    const result = await signOut();
    if (result.success) {
      goto('/auth');
    }
  }

  /**
   * 跳转到认证页面
   */
  function goToAuth(mode: 'signin' | 'signup' = 'signin') {
    if (mode === 'signin') {
      goto('/auth');
    } else {
      goto(`/auth?mode=${mode}`);
    }
  }
</script>

<!-- 页面头部 -->
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content="专业的训练计划管理应用，支持弹跳训练、力量分析、进度追踪" />
</svelte:head>

<!-- 主要内容 -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- 导航栏 -->
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">
            🏋️‍♂️ 训练计划管理系统
          </h1>
        </div>
        
        <div class="flex items-center space-x-4">
          {#if $user}
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {$user.email}
            </span>
            <button
              on:click={handleSignOut}
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              登出
            </button>
          {:else}
            <button
              on:click={() => goToAuth('signin')}
              class="btn-primary text-sm"
            >
              登录
            </button>
            <button
              on:click={() => goToAuth('signup')}
              class="btn-secondary text-sm"
            >
              注册
            </button>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <!-- 主内容区 -->
  <main class="container mx-auto px-4 py-8">
    {#if $user}
      <!-- 欢迎信息 -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          欢迎回来！
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          继续你的训练之旅，每一天都是进步的机会。
        </p>
      </div>

      <!-- 快速统计 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">训练计划</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{stats.plans}</p>
            </div>
            <span class="text-3xl">📋</span>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">完成训练</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{stats.workouts}</p>
            </div>
            <span class="text-3xl">💪</span>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">连续天数</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">{stats.streak}</p>
            </div>
            <span class="text-3xl">🔥</span>
          </div>
        </div>
      </div>

      <!-- 功能模块 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each features as feature}
          <a
            href={feature.href}
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
          >
            <div class="flex items-start">
              <span class="text-4xl mr-4">{feature.icon}</span>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-{feature.color}-600 dark:group-hover:text-{feature.color}-400">
                  {feature.title}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <!-- 未登录状态 -->
      <div class="max-w-2xl mx-auto text-center py-16">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          🏋️‍♂️ 训练计划管理系统
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          专业的弹跳训练与力量分析平台
        </p>
        <div class="space-y-4 mb-8">
          <p class="text-gray-600 dark:text-gray-400">
            ✅ 个性化训练计划定制
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            ✅ 科学的能力分析系统
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            ✅ 详细的进度追踪记录
          </p>
          <p class="text-gray-600 dark:text-gray-400">
            ✅ 实用的训练辅助工具
          </p>
        </div>
        <div class="flex justify-center space-x-4">
          <button
            on:click={() => goToAuth('signup')}
            class="btn-primary"
          >
            立即开始
          </button>
          <button
            on:click={() => goToAuth('signin')}
            class="btn-secondary"
          >
            登录账号
          </button>
        </div>
      </div>
    {/if}
  </main>
</div>

<!-- 页面样式 -->
<style>
  .container {
    max-width: 1200px;
  }
</style>
