<!-- 主页面 - 训练计划应用 -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { user, signOut } from '$lib/stores/auth';

  // 页面标题
  const pageTitle = "训练计划管理系统";
  const version = "1.0.0-MVP";
  
  // 当前时间
  const currentDate = new Date().toLocaleDateString('zh-CN');

  /**
   * 处理登出
   */
  async function handleSignOut() {
    const result = await signOut();
    if (result.success) {
      console.log('登出成功');
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

  /**
   * 跳转到个人资料页面
   */
  function goToProfile() {
    goto('/profile');
  }
</script>

<!-- 页面头部 -->
<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content="专业的训练计划管理应用，支持弹跳训练、力量分析、进度追踪" />
</svelte:head>

<!-- 主要内容 -->
<div class="container mx-auto px-4 py-8">
  <!-- 用户状态栏 -->
  <div class="flex justify-between items-center mb-8">
    <div class="flex items-center space-x-4">
      {#if $user}
        <div class="flex items-center space-x-2">
          <span class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
            {$user.email?.charAt(0).toUpperCase()}
          </span>
          <span class="text-gray-700">欢迎，{$user.email}</span>
        </div>
      {:else}
        <span class="text-gray-600">未登录</span>
      {/if}
    </div>
    
    <div class="flex items-center space-x-3">
      {#if $user}
        <button
          on:click={goToProfile}
          class="btn-secondary text-sm"
        >
          个人资料
        </button>
        <button
          on:click={() => goto('/analysis')}
          class="btn-primary text-sm"
        >
          能力分析
        </button>
        <button
          on:click={handleSignOut}
          class="btn-secondary text-sm"
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

  <!-- 欢迎区域 -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">
      🏋️‍♂️ 训练计划管理系统
    </h1>
    <p class="text-xl text-gray-600 mb-2">
      专业的弹跳训练与力量分析平台
    </p>
    <p class="text-sm text-gray-500">
      版本: {version} | 日期: {currentDate}
    </p>
  </div>

  <!-- 项目状态卡片 -->
  <div class="max-w-4xl mx-auto">
    <div class="card mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">
        📋 项目初始化状态
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 技术栈 -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-3">技术栈</h3>
          <ul class="space-y-2">
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span class="text-gray-600">SvelteKit 1.20.4</span>
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span class="text-gray-600">Tailwind CSS 3.3.0</span>
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span class="text-gray-600">TypeScript 5.0.0</span>
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span class="text-gray-600">Vite 4.4.2</span>
            </li>
          </ul>
        </div>

        <!-- 完成状态 -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-3">初始化完成</h3>
          <ul class="space-y-2">
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span class="text-gray-600">SvelteKit项目创建</span>
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span class="text-gray-600">Tailwind CSS配置</span>
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span class="text-gray-600">TypeScript支持</span>
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span class="text-gray-600">项目结构设置</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 下一步计划 -->
    <div class="card">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">
        🚀 下一步开发计划
      </h2>
      
      <div class="space-y-3">
        <div class="flex items-start">
          <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
            1
          </span>
          <div>
            <h4 class="font-medium text-gray-800">数据库配置</h4>
            <p class="text-sm text-gray-600">创建Supabase项目，配置数据库连接</p>
          </div>
        </div>
        
        <div class="flex items-start">
          <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
            2
          </span>
          <div>
            <h4 class="font-medium text-gray-800">数据库结构建立</h4>
            <p class="text-sm text-gray-600">创建用户、训练计划、训练记录等核心表</p>
          </div>
        </div>
        
        <div class="flex items-start">
          <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
            3
          </span>
          <div>
            <h4 class="font-medium text-gray-800">能力分析功能</h4>
            <p class="text-sm text-gray-600">弹跳能力分析、力量结构评估、核心问题分析</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 页面样式 -->
<style>
  .container {
    max-width: 1200px;
  }
</style>
