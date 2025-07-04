<!-- 认证容器组件 - 管理不同认证模式的切换 -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import LoginForm from './LoginForm.svelte';
  import SignUpForm from './SignUpForm.svelte';
  import ResetPasswordForm from './ResetPasswordForm.svelte';

  // 事件分发器
  const dispatch = createEventDispatcher();

  // 当前认证模式
  export let mode: 'signin' | 'signup' | 'reset' = 'signin';

  // 成功消息
  let successMessage = '';
  let showSuccess = false;

  /**
   * 处理模式切换
   */
  function handleModeSwitch(event: CustomEvent) {
    mode = event.detail.mode;
    clearSuccess();
  }

  /**
   * 处理认证成功
   */
  function handleAuthSuccess(event: CustomEvent) {
    successMessage = event.detail.message;
    showSuccess = true;
    
    // 向父组件发送成功事件
    dispatch('success', event.detail);

    // 3秒后自动隐藏成功消息
    setTimeout(() => {
      clearSuccess();
    }, 3000);
  }

  /**
   * 清除成功消息
   */
  function clearSuccess() {
    showSuccess = false;
    successMessage = '';
  }

  /**
   * 获取当前模式的标题
   */
  function getModeTitle(currentMode: string): string {
    switch (currentMode) {
      case 'signin':
        return '用户登录';
      case 'signup':
        return '用户注册';
      case 'reset':
        return '密码重置';
      default:
        return '用户认证';
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <!-- 页面标题 -->
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        🏋️‍♂️ 训练计划系统
      </h1>
      <p class="text-lg text-gray-600">
        {getModeTitle(mode)}
      </p>
    </div>
  </div>

  <!-- 成功消息 -->
  {#if showSuccess}
    <div class="sm:mx-auto sm:w-full sm:max-w-md mt-4">
      <div class="bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-800">{successMessage}</p>
          </div>
          <div class="ml-auto pl-3">
            <button
              type="button"
              on:click={clearSuccess}
              class="inline-flex text-green-400 hover:text-green-600 focus:outline-none"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- 认证表单容器 -->
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    {#if mode === 'signin'}
      <LoginForm 
        on:switch={handleModeSwitch}
        on:success={handleAuthSuccess}
      />
    {:else if mode === 'signup'}
      <SignUpForm 
        on:switch={handleModeSwitch}
        on:success={handleAuthSuccess}
      />
    {:else if mode === 'reset'}
      <ResetPasswordForm 
        on:switch={handleModeSwitch}
        on:success={handleAuthSuccess}
      />
    {/if}
  </div>

  <!-- 页脚信息 -->
  <div class="mt-8 text-center">
    <p class="text-sm text-gray-500">
      © 2025 训练计划系统. 专业的弹跳训练与力量分析平台
    </p>
  </div>
</div>

<style>
  /* 确保容器占满整个视口高度 */
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style> 