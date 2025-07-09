<!-- 认证页面 - 登录/注册 -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { signIn, signUp, user, authLoading, authError, clearAuthError } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  
  // 表单模式：'signin' 或 'signup'
  let mode: 'signin' | 'signup' = 'signin';
  
  // 表单数据
  let email = '';
  let password = '';
  let confirmPassword = '';
  let fullName = '';
  
  // 表单验证错误
  let validationErrors: string[] = [];
  
  // 本地加载状态
  let isSubmitting = false;

  onMount(() => {
    // 从URL参数获取模式
    const urlMode = $page.url.searchParams.get('mode');
    if (urlMode === 'signup') {
      mode = 'signup';
    }
    
    // 清除之前的错误
    clearAuthError();
    
    // 如果用户已登录，重定向到首页
    if ($user) {
      goto('/');
    }
  });

  // 监听用户状态变化
  $: if ($user) {
    goto('/');
  }

  /**
   * 切换模式
   */
  function toggleMode() {
    mode = mode === 'signin' ? 'signup' : 'signin';
    clearErrors();
    
    // 更新URL
    const newUrl = mode === 'signup' ? '/auth?mode=signup' : '/auth';
    goto(newUrl, { replaceState: true });
  }

  /**
   * 清除错误信息
   */
  function clearErrors() {
    validationErrors = [];
    clearAuthError();
  }

  /**
   * 验证表单
   */
  function validateForm(): boolean {
    validationErrors = [];
    
    if (!email.trim()) {
      validationErrors.push('请输入邮箱地址');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push('请输入有效的邮箱地址');
    }
    
    if (!password) {
      validationErrors.push('请输入密码');
    } else if (password.length < 6) {
      validationErrors.push('密码至少需要6个字符');
    }
    
    if (mode === 'signup') {
      if (!confirmPassword) {
        validationErrors.push('请确认密码');
      } else if (password !== confirmPassword) {
        validationErrors.push('两次输入的密码不一致');
      }
      
      if (!fullName.trim()) {
        validationErrors.push('请输入姓名');
      }
    }
    
    return validationErrors.length === 0;
  }

  /**
   * 处理表单提交
   */
  async function handleSubmit() {
    clearErrors();
    
    if (!validateForm()) {
      return;
    }
    
    isSubmitting = true;
    
    try {
      let result;
      
      if (mode === 'signin') {
        result = await signIn(email.trim(), password);
      } else {
        result = await signUp(email.trim(), password, fullName.trim());
      }
      
      if (result.success) {
        if (mode === 'signup') {
          // 注册成功，显示确认邮件提示
          alert('注册成功！请检查您的邮箱并点击确认链接以激活账户。');
        }
        // 登录成功会自动重定向到首页（通过用户状态监听）
      }
    } catch (error) {
      console.error('认证错误:', error);
    } finally {
      isSubmitting = false;
    }
  }

  /**
   * 处理键盘事件
   */
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<!-- 页面头部 -->
<svelte:head>
  <title>{mode === 'signin' ? '登录' : '注册'} - 训练计划管理系统</title>
  <meta name="description" content="登录或注册训练计划管理系统" />
</svelte:head>

<!-- 主要内容 -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <!-- Logo和标题 -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        🏋️‍♂️
      </h1>
      <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
        训练计划管理系统
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {mode === 'signin' ? '登录到您的账户' : '创建您的新账户'}
      </p>
    </div>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <!-- 认证表单 -->
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        
        <!-- 姓名字段（仅注册时显示） -->
        {#if mode === 'signup'}
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              姓名
            </label>
            <div class="mt-1">
              <input
                id="fullName"
                name="fullName"
                type="text"
                bind:value={fullName}
                on:keydown={handleKeydown}
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="请输入您的姓名"
              />
            </div>
          </div>
        {/if}

        <!-- 邮箱字段 -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            邮箱地址
          </label>
          <div class="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              bind:value={email}
              on:keydown={handleKeydown}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="请输入邮箱地址"
            />
          </div>
        </div>

        <!-- 密码字段 -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            密码
          </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete={mode === 'signin' ? 'current-password' : 'new-password'}
              bind:value={password}
              on:keydown={handleKeydown}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="请输入密码"
            />
          </div>
        </div>

        <!-- 确认密码字段（仅注册时显示） -->
        {#if mode === 'signup'}
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              确认密码
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                bind:value={confirmPassword}
                on:keydown={handleKeydown}
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="请再次输入密码"
              />
            </div>
          </div>
        {/if}

        <!-- 错误信息显示 -->
        {#if validationErrors.length > 0 || $authError}
          <div class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                  {validationErrors.length > 0 ? '表单验证错误' : '认证错误'}
                </h3>
                <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                  {#if validationErrors.length > 0}
                    <ul class="list-disc list-inside space-y-1">
                      {#each validationErrors as error}
                        <li>{error}</li>
                      {/each}
                    </ul>
                  {/if}
                  {#if $authError}
                    <p>{$authError}</p>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/if}

        <!-- 提交按钮 -->
        <div>
          <button
            type="submit"
            disabled={$authLoading || isSubmitting}
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {#if $authLoading || isSubmitting}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {mode === 'signin' ? '登录中...' : '注册中...'}
            {:else}
              {mode === 'signin' ? '登录' : '注册'}
            {/if}
          </button>
        </div>

        <!-- 模式切换 -->
        <div class="text-center">
          <button
            type="button"
            on:click={toggleMode}
            class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {mode === 'signin' ? '还没有账户？点击注册' : '已有账户？点击登录'}
          </button>
        </div>
      </form>

      <!-- 返回首页链接 -->
      <div class="mt-6 text-center">
        <a
          href="/"
          class="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ← 返回首页
        </a>
      </div>
    </div>
  </div>
</div>

 