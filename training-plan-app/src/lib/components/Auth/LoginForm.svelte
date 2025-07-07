<!-- 登录表单组件 -->
<script lang="ts">
  import { signIn, authLoading, authError, clearAuthError } from '../../stores/auth';
  import { createEventDispatcher } from 'svelte';

  // 事件分发器，用于与父组件通信
  const dispatch = createEventDispatcher();

  // 表单数据
  let email = '';
  let password = '';

  // 表单验证状态
  let emailError = '';
  let passwordError = '';
  let isSubmitting = false;

  // 订阅认证状态
  $: loading = $authLoading;
  $: error = $authError;

  /**
   * 验证邮箱格式
   */
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证密码
   */
  function validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  /**
   * 验证表单
   */
  function validateForm(): boolean {
    let isValid = true;

    // 清除之前的错误
    emailError = '';
    passwordError = '';

    // 验证邮箱
    if (!email.trim()) {
      emailError = '请输入邮箱地址';
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError = '请输入有效的邮箱地址';
      isValid = false;
    }

    // 验证密码
    if (!password.trim()) {
      passwordError = '请输入密码';
      isValid = false;
    } else if (!validatePassword(password)) {
      passwordError = '密码至少需要6个字符';
      isValid = false;
    }

    return isValid;
  }

  /**
   * 处理登录提交
   */
  async function handleSubmit() {
    // 清除之前的认证错误
    clearAuthError();

    // 验证表单
    if (!validateForm()) {
      return;
    }

    isSubmitting = true;

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // 登录成功，触发事件
        dispatch('success', { message: '登录成功！' });
      }
    } catch (error) {
      console.error('登录处理失败:', error);
    } finally {
      isSubmitting = false;
    }
  }

  /**
   * 切换到注册模式
   */
  function switchToSignUp() {
    dispatch('switch', { mode: 'signup' });
  }

  /**
   * 切换到密码重置模式
   */
  function switchToResetPassword() {
    dispatch('switch', { mode: 'reset' });
  }
</script>

<div class="w-full max-w-md mx-auto">
  <div class="bg-white shadow-lg rounded-lg p-6">
    <!-- 标题 -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">登录</h2>
      <p class="text-gray-600 mt-2">欢迎回到训练计划系统</p>
    </div>

    <!-- 表单 -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <!-- 邮箱输入 -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          邮箱地址
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="请输入邮箱地址"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          class:border-red-500={emailError}
          disabled={loading || isSubmitting}
        />
        {#if emailError}
          <p class="mt-1 text-sm text-red-600">{emailError}</p>
        {/if}
      </div>

      <!-- 密码输入 -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          密码
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="请输入密码"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          class:border-red-500={passwordError}
          disabled={loading || isSubmitting}
        />
        {#if passwordError}
          <p class="mt-1 text-sm text-red-600">{passwordError}</p>
        {/if}
      </div>

      <!-- 全局错误信息 -->
      {#if error}
        <div class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-600">{error}</p>
        </div>
      {/if}

      <!-- 登录按钮 -->
      <button
        type="submit"
        disabled={loading || isSubmitting}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {#if loading || isSubmitting}
          <span class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            登录中...
          </span>
        {:else}
          登录
        {/if}
      </button>
    </form>

    <!-- 底部链接 -->
    <div class="mt-6 text-center space-y-2">
      <button
        type="button"
        on:click={switchToResetPassword}
        class="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        忘记密码？
      </button>
      
      <div class="text-sm text-gray-600">
        还没有账号？
        <button
          type="button"
          on:click={switchToSignUp}
          class="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          立即注册
        </button>
      </div>
    </div>
  </div>
</div> 