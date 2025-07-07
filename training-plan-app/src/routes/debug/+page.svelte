<!-- 调试页面 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { initAuth } from '../../lib/stores/auth';
  import ProfileDebug from '../../lib/components/Profile/ProfileDebug.svelte';

  onMount(() => {
    initAuth();
  });
</script>

<svelte:head>
  <title>调试工具 - 训练计划应用</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 py-8">
  <div class="container mx-auto px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">调试工具</h1>
      <p class="text-gray-600">用于排查注册和用户档案问题</p>
    </div>

    <ProfileDebug />
  </div>
</div> 