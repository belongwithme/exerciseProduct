<!-- 认证页面 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import AuthContainer from '$lib/components/Auth/AuthContainer.svelte';
  import { initAuth, user } from '$lib/stores/auth';

  // 当前认证模式，从URL参数获取
  let mode: 'signin' | 'signup' | 'reset' = 'signin';

  // 初始化认证状态
  onMount(async () => {
    await initAuth();
    
    // 如果用户已登录，重定向到主页
    if ($user) {
      goto('/');
      return;
    }

    // 从URL参数获取认证模式
    const urlMode = $page.url.searchParams.get('mode');
    if (urlMode === 'signup' || urlMode === 'reset') {
      mode = urlMode;
    }
  });

  // 监听用户状态变化
  $: if ($user) {
    // 用户登录成功，重定向到主页
    goto('/');
  }

  /**
   * 处理认证成功
   */
  function handleAuthSuccess(event: CustomEvent) {
    console.log('认证成功:', event.detail);
    
    // 如果是注册成功，切换到登录模式
    if (mode === 'signup') {
      mode = 'signin';
    }
  }

  /**
   * 更新URL参数
   */
  function updateUrlMode(newMode: string) {
    if (newMode === 'signin') {
      // 登录模式不需要参数
      goto('/auth', { replaceState: true });
    } else {
      // 其他模式添加参数
      goto(`/auth?mode=${newMode}`, { replaceState: true });
    }
  }

  // 监听模式变化，更新URL
  $: updateUrlMode(mode);
</script>

<!-- 页面头部 -->
<svelte:head>
  <title>用户认证 - 训练计划系统</title>
  <meta name="description" content="登录或注册您的训练计划系统账户" />
</svelte:head>

<!-- 认证容器 -->
<AuthContainer 
  bind:mode={mode}
  on:success={handleAuthSuccess}
/> 