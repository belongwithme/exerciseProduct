<!-- 密码重置表单组件 -->
<script lang="ts">
  import { resetPassword, authLoading, authError, clearAuthError } from '../../stores/auth';
  import { createEventDispatcher } from 'svelte';

  // 事件分发器，用于与父组件通信
  const dispatch = createEventDispatcher();

  // 表单数据
  let email = '';

  // 表单验证状态
  let emailError = '';
  let isSubmitting = false;
  let resetSent = false;

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
   * 验证表单
   */
  function validateForm(): boolean {
    emailError = '';

    if (!email.trim()) {
      emailError = '请输入邮箱地址';
      return false;
    } else if (!validateEmail(email)) {
      emailError = '请输入有效的邮箱地址';
      return false;
    }

    return true;
  }

  /**
   * 处理密码重置提交
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
      const result = await resetPassword(email);
      
      if (result.success) {
        resetSent = true;
        // 触发成功事件
        dispatch('success', { 
          message: '密码重置邮件已发送，请检查您的邮箱。' 
        });
      }
    } catch (error) {
      console.error('密码重置处理失败:', error);
    } finally {
      isSubmitting = false;
    }
  }

  /**
   * 切换到登录模式
   */
  function switchToSignIn() {
    dispatch('switch', { mode: 'signin' });
  }

  /**
   * 重新发送重置邮件
   */
  function resendReset() {
    resetSent = false;
    clearAuthError();
  }
</script>

<div class="w-full max-w-md mx-auto">
  <div class="bg-white shadow-lg rounded-lg p-6">
    {#if !resetSent}
      <!-- 标题 -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">重置密码</h2>
        <p class="text-gray-600 mt-2">输入您的邮箱地址，我们将发送重置链接</p>
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
            placeholder="请输入您的邮箱地址"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            class:border-red-500={emailError}
            disabled={loading || isSubmitting}
          />
          {#if emailError}
            <p class="mt-1 text-sm text-red-600">{emailError}</p>
          {/if}
        </div>

        <!-- 全局错误信息 -->
        {#if error}
          <div class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-sm text-red-600">{error}</p>
          </div>
        {/if}

        <!-- 重置按钮 -->
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
              发送中...
            </span>
          {:else}
            发送重置邮件
          {/if}
        </button>
      </form>
    {:else}
      <!-- 重置邮件已发送 -->
      <div class="text-center">
        <div class="mb-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">邮件已发送</h2>
        <p class="text-gray-600 mb-4">
          我们已向 <span class="font-medium">{email}</span> 发送了密码重置链接。
        </p>
        <p class="text-sm text-gray-500 mb-6">
          请检查您的邮箱（包括垃圾邮件文件夹）并点击链接重置密码。
        </p>
        
        <!-- 操作按钮 -->
        <div class="space-y-3">
          <button
            type="button"
            on:click={resendReset}
            class="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            重新发送
          </button>
        </div>
      </div>
    {/if}

    <!-- 底部链接 -->
    <div class="mt-6 text-center">
      <div class="text-sm text-gray-600">
        记起密码了？
        <button
          type="button"
          on:click={switchToSignIn}
          class="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          返回登录
        </button>
      </div>
    </div>
  </div>
</div> 