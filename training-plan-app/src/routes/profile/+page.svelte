<!-- 个人资料管理页面 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ProfileForm from '$lib/components/Profile/ProfileForm.svelte';
  import { user } from '$lib/stores/auth';
  import { supabase } from '$lib/utils/supabaseClient';
  import type { Profile } from '$lib/types';

  let profile: Partial<Profile> = {};
  let loading = true;
  let saving = false;
  let message = '';
  let messageType: 'success' | 'error' = 'success';

  // 监听认证状态
  $: if (!$user && !loading) {
    goto('/auth');
  }

  /**
   * 加载用户资料
   */
  async function loadProfile() {
    if (!$user) return;

    try {
      loading = true;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', $user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // 用户资料不存在，创建空资料
          profile = {
            id: $user.id,
            username: $user.user_metadata?.username || '',
            full_name: $user.user_metadata?.full_name || ''
          };
        } else {
          throw error;
        }
      } else {
        profile = data;
      }
    } catch (error) {
      console.error('加载用户资料失败:', error);
      showMessage('加载用户资料失败', 'error');
    } finally {
      loading = false;
    }
  }

  /**
   * 保存用户资料
   */
  async function handleProfileSubmit(event: CustomEvent) {
    if (!$user) return;

    try {
      saving = true;
      const profileData = event.detail;
      
      // 添加用户ID和更新时间
      const updateData = {
        ...profileData,
        id: $user.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updateData, {
          onConflict: 'id'
        });

      if (error) {
        throw error;
      }

      // 更新本地状态
      profile = { ...profile, ...profileData };
      showMessage('个人资料保存成功！', 'success');
      
    } catch (error) {
      console.error('保存用户资料失败:', error);
      showMessage('保存用户资料失败', 'error');
    } finally {
      saving = false;
    }
  }

  /**
   * 显示消息
   */
  function showMessage(text: string, type: 'success' | 'error') {
    message = text;
    messageType = type;
    setTimeout(() => {
      message = '';
    }, 3000);
  }

  // 组件挂载时加载资料
  onMount(() => {
    loadProfile();
  });
</script>

<svelte:head>
  <title>个人资料管理 - 训练计划</title>
  <meta name="description" content="管理您的个人资料，包括身体数据、弹跳数据和力量数据" />
</svelte:head>

<main class="min-h-screen bg-gray-50 py-8">
  <div class="container mx-auto px-4">
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">个人资料管理</h1>
      <p class="text-gray-600">完善您的个人资料，获得更精准的训练建议</p>
    </div>

    <!-- 消息提示 -->
    {#if message}
      <div class="max-w-4xl mx-auto mb-6">
        <div class="alert {messageType === 'success' ? 'alert-success' : 'alert-error'}">
          {message}
        </div>
      </div>
    {/if}

    <!-- 加载状态 -->
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">加载中...</span>
      </div>
    {:else}
      <!-- 个人资料表单 -->
      <ProfileForm 
        {profile} 
        on:submit={handleProfileSubmit}
      />
    {/if}

    <!-- 返回按钮 -->
    <div class="max-w-4xl mx-auto mt-8">
      <button
        on:click={() => goto('/')}
        class="btn-secondary"
        disabled={saving}
      >
        ← 返回首页
      </button>
    </div>
  </div>
</main>

<style>
  .alert {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .alert-success {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  }
  
  .alert-error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }
</style> 