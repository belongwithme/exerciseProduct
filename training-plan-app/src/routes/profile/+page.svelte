<!-- 个人资料页面 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { user, userProfile, updateProfile, signOut, refreshUserProfile } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  // 用户信息
  let isLoading = false;
  let isSaving = false;
  let error: string | null = null;
  let successMessage: string | null = null;
  
  // 编辑模式
  let isEditing = false;
  
  // 表单数据
  let profile = {
    full_name: '',
    email: '',
    height_cm: '',
    weight_kg: '',
    birth_date: '',
    gender: '',
    experience_level: '',
    goals: '',
    bio: '',
    // 弹跳相关数据
    standing_reach_cm: '',
    max_touch_height_cm: '',
    target_touch_height_cm: '',
    // 训练重量数据
    bench_press_kg: '',
    squat_kg: '',
    deadlift_kg: ''
  };
  
  onMount(async () => {
    // 检查用户登录状态
    if (!$user) {
      goto('/auth');
      return;
    }
    
    // 加载用户资料
    await loadProfile();
  });

  // 监听userProfile变化，自动填充表单
  $: if ($userProfile && !isLoading && !isSaving) {
    fillFormFromProfile();
  }
  
  function fillFormFromProfile() {
    try {
      // 从用户对象获取基本信息
      if ($user) {
        profile.email = $user.email || '';
        profile.full_name = $user.user_metadata?.full_name || '';
      }
      
      // 从userProfile store获取完整的用户资料
      if ($userProfile) {
        profile = {
          full_name: $userProfile.full_name || '',
          email: $userProfile.email || $user?.email || '',
          height_cm: $userProfile.height_cm?.toString() || '',
          weight_kg: $userProfile.weight_kg?.toString() || '',
          birth_date: $userProfile.birth_date || '',
          gender: $userProfile.gender || '',
          experience_level: $userProfile.experience_level || '',
          goals: $userProfile.goals || '',
          bio: $userProfile.bio || '',
          // 弹跳相关数据
          standing_reach_cm: $userProfile.standing_reach_cm?.toString() || '',
          max_touch_height_cm: $userProfile.max_touch_height_cm?.toString() || '',
          target_touch_height_cm: $userProfile.target_touch_height_cm?.toString() || '',
          // 训练重量数据
          bench_press_kg: $userProfile.bench_press_kg?.toString() || '',
          squat_kg: $userProfile.squat_kg?.toString() || '',
          deadlift_kg: $userProfile.deadlift_kg?.toString() || ''
        };
      }
    } catch (err) {
      console.error('填充表单数据失败:', err);
    }
  }

  async function loadProfile() {
    try {
      isLoading = true;
      error = null;
      
      // 填充表单数据
      fillFormFromProfile();
      
    } catch (err) {
      error = '加载个人资料失败，请稍后重试';
      console.error('加载个人资料失败:', err);
    } finally {
      isLoading = false;
    }
  }

  async function saveProfile() {
    try {
      isSaving = true;
      error = null;
      successMessage = null;
      
      // 数据验证
      if (!profile.full_name.trim()) {
        error = '请输入姓名';
        return;
      }
      
      if (profile.height_cm && (parseInt(profile.height_cm) < 100 || parseInt(profile.height_cm) > 250)) {
        error = '身高请输入100-250之间的数值';
        return;
      }
      
      if (profile.weight_kg && (parseInt(profile.weight_kg) < 30 || parseInt(profile.weight_kg) > 200)) {
        error = '体重请输入30-200之间的数值';
        return;
      }
      
      if (profile.bench_press_kg && (parseInt(profile.bench_press_kg) < 10 || parseInt(profile.bench_press_kg) > 300)) {
        error = '卧推重量请输入10-300之间的数值';
        return;
      }
      
      if (profile.squat_kg && (parseInt(profile.squat_kg) < 10 || parseInt(profile.squat_kg) > 400)) {
        error = '深蹲重量请输入10-400之间的数值';
        return;
      }
      
      if (profile.deadlift_kg && (parseInt(profile.deadlift_kg) < 10 || parseInt(profile.deadlift_kg) > 400)) {
        error = '硬拉重量请输入10-400之间的数值';
        return;
      }
      
      // 准备更新数据
      const updates: any = {
        full_name: profile.full_name.trim(),
        goals: profile.goals?.trim(),
        bio: profile.bio?.trim(),
        gender: profile.gender || null,
        experience_level: profile.experience_level || null,
        birth_date: profile.birth_date || null,
      };
      
      // 数值字段转换
      if (profile.height_cm) updates.height_cm = parseInt(profile.height_cm);
      if (profile.weight_kg) updates.weight_kg = parseInt(profile.weight_kg);
      if (profile.standing_reach_cm) updates.standing_reach_cm = parseInt(profile.standing_reach_cm);
      if (profile.max_touch_height_cm) updates.max_touch_height_cm = parseInt(profile.max_touch_height_cm);
      if (profile.target_touch_height_cm) updates.target_touch_height_cm = parseInt(profile.target_touch_height_cm);
      if (profile.bench_press_kg) updates.bench_press_kg = parseInt(profile.bench_press_kg);
      if (profile.squat_kg) updates.squat_kg = parseInt(profile.squat_kg);
      if (profile.deadlift_kg) updates.deadlift_kg = parseInt(profile.deadlift_kg);
      
      // 调用更新函数
      const result = await updateProfile(updates);
      
      if (result.success) {
        successMessage = '个人资料保存成功！';
        isEditing = false;
        
        // 3秒后清除成功消息
        setTimeout(() => {
          successMessage = null;
        }, 3000);
      } else {
        error = result.error || '保存个人资料失败';
        console.error('保存个人资料失败，详细错误:', result.error);
      }
      
    } catch (err) {
      error = '保存个人资料失败，请稍后重试';
      console.error('保存个人资料失败:', err);
    } finally {
      isSaving = false;
    }
  }
  
  function cancelEdit() {
    isEditing = false;
    error = null;
    successMessage = null;
    // 重新加载数据以恢复原始值
    loadProfile();
  }
  
  async function handleSignOut() {
    if (confirm('确定要退出登录吗？')) {
      await signOut();
      goto('/auth');
    }
  }
  
  function getExperienceLevelLabel(level: string) {
    const levels: Record<string, string> = {
      beginner: '初学者',
      intermediate: '中级',
      advanced: '高级',
      professional: '专业级'
    };
    return levels[level] || level;
  }
  
  function getGenderLabel(gender: string) {
    const genders: Record<string, string> = {
      male: '男',
      female: '女',
      other: '其他'
    };
    return genders[gender] || gender;
  }
  
  function calculateAge(birthDate: string) {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
  
  function calculateBMI(height: string, weight: string) {
    if (!height || !weight) return '';
    const h = parseInt(height) / 100; // 转换为米
    const w = parseInt(weight);
    const bmi = w / (h * h);
    return bmi.toFixed(1);
  }
</script>

<svelte:head>
  <title>个人资料 - 弹跳训练营</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">个人资料</h1>
    <p class="text-gray-600 dark:text-gray-300">管理您的个人信息和训练偏好</p>
  </div>

  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-300">加载个人资料中...</span>
    </div>
  {:else}
    <div class="max-w-4xl mx-auto">
      <!-- 头像和基本信息 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.full_name || '未设置姓名'}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">{profile.email}</p>
            <div class="mt-2 flex flex-wrap gap-2">
              {#if profile.experience_level}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {getExperienceLevelLabel(profile.experience_level)}
                </span>
              {/if}
              {#if profile.gender}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {getGenderLabel(profile.gender)}
                </span>
              {/if}
              {#if profile.birth_date}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {calculateAge(profile.birth_date)}岁
                </span>
              {/if}
            </div>
          </div>
          <div class="flex-shrink-0 space-x-3">
            {#if !isEditing}
              <button
                on:click={refreshUserProfile}
                class="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-gray-700 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新数据
              </button>
              <button
                on:click={() => isEditing = true}
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑资料
              </button>
            {/if}
            <button
              on:click={handleSignOut}
              class="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
          </div>
        </div>
      </div>

      <!-- 错误和成功消息 -->
      {#if error}
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      {/if}

      {#if successMessage}
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      {/if}

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        <!-- 基本信息 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h3>
          
          <div class="space-y-4">
            <div>
              <label for="full_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名</label>
              {#if isEditing}
                <input
                  id="full_name"
                  type="text"
                  bind:value={profile.full_name}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="请输入您的姓名"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.full_name || '未设置'}</p>
              {/if}
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
              <p class="text-gray-900 dark:text-white">{profile.email}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">邮箱地址无法修改</p>
            </div>
            
            <div>
              <label for="birth_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">出生日期</label>
              {#if isEditing}
                <input
                  id="birth_date"
                  type="date"
                  bind:value={profile.birth_date}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">
                  {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('zh-CN') : '未设置'}
                  {#if profile.birth_date}
                    <span class="text-gray-500 dark:text-gray-400">({calculateAge(profile.birth_date)}岁)</span>
                  {/if}
                </p>
              {/if}
            </div>
            
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">性别</label>
              {#if isEditing}
                <select
                  id="gender"
                  bind:value={profile.gender}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              {:else}
                <p class="text-gray-900 dark:text-white">{getGenderLabel(profile.gender) || '未设置'}</p>
              {/if}
            </div>
          </div>
        </div>

        <!-- 体格信息 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">体格信息</h3>
          
          <div class="space-y-4">
            <div>
              <label for="height_cm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">身高 (cm)</label>
              {#if isEditing}
                <input
                  id="height_cm"
                  type="number"
                  bind:value={profile.height_cm}
                  min="100"
                  max="250"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="175"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.height_cm ? profile.height_cm + ' cm' : '未设置'}</p>
              {/if}
            </div>
            
            <div>
              <label for="weight_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">体重 (kg)</label>
              {#if isEditing}
                <input
                  id="weight_kg"
                  type="number"
                  bind:value={profile.weight_kg}
                  min="30"
                  max="200"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="70"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.weight_kg ? profile.weight_kg + ' kg' : '未设置'}</p>
              {/if}
            </div>
            
            {#if profile.height_cm && profile.weight_kg}
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BMI</label>
                <p class="text-gray-900 dark:text-white">{calculateBMI(profile.height_cm, profile.weight_kg)}</p>
              </div>
            {/if}
            
            <div>
              <label for="experience_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">训练水平</label>
              {#if isEditing}
                <select
                  id="experience_level"
                  bind:value={profile.experience_level}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">请选择</option>
                  <option value="beginner">初学者</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                  <option value="professional">专业级</option>
                </select>
              {:else}
                <p class="text-gray-900 dark:text-white">{getExperienceLevelLabel(profile.experience_level) || '未设置'}</p>
              {/if}
            </div>
          </div>
        </div>

        <!-- 弹跳能力数据 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">弹跳能力数据</h3>
          
          <div class="space-y-4">
            <div>
              <label for="standing_reach_cm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">站立摸高 (cm)</label>
              {#if isEditing}
                <input
                  id="standing_reach_cm"
                  type="number"
                  bind:value={profile.standing_reach_cm}
                  min="150"
                  max="300"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="230"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.standing_reach_cm ? profile.standing_reach_cm + ' cm' : '未设置'}</p>
              {/if}
            </div>
            
            <div>
              <label for="max_touch_height_cm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">最大摸高 (cm)</label>
              {#if isEditing}
                <input
                  id="max_touch_height_cm"
                  type="number"
                  bind:value={profile.max_touch_height_cm}
                  min="150"
                  max="400"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="285"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.max_touch_height_cm ? profile.max_touch_height_cm + ' cm' : '未设置'}</p>
              {/if}
            </div>
            
            <div>
              <label for="target_touch_height_cm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目标摸高 (cm)</label>
              {#if isEditing}
                <input
                  id="target_touch_height_cm"
                  type="number"
                  bind:value={profile.target_touch_height_cm}
                  min="150"
                  max="400"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="300"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.target_touch_height_cm ? profile.target_touch_height_cm + ' cm' : '未设置'}</p>
              {/if}
            </div>
            
            {#if profile.standing_reach_cm && profile.max_touch_height_cm}
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">垂直跳跃</label>
                <p class="text-gray-900 dark:text-white">
                  {parseInt(profile.max_touch_height_cm) - parseInt(profile.standing_reach_cm)} cm
                </p>
              </div>
            {/if}
            
            {#if profile.max_touch_height_cm && profile.target_touch_height_cm}
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">需提升高度</label>
                <p class="text-gray-900 dark:text-white">
                  {parseInt(profile.target_touch_height_cm) - parseInt(profile.max_touch_height_cm)} cm
                </p>
              </div>
            {/if}
          </div>
        </div>

        <!-- 训练重量数据 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">训练重量数据</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">记录您的三大项训练重量（1RM或最大重量）</p>
          
          <div class="space-y-4">
            <div>
              <label for="bench_press_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">卧推 (kg)</label>
              {#if isEditing}
                <input
                  id="bench_press_kg"
                  type="number"
                  bind:value={profile.bench_press_kg}
                  min="10"
                  max="300"
                  step="2.5"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="80"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.bench_press_kg ? profile.bench_press_kg + ' kg' : '未设置'}</p>
              {/if}
            </div>
            
            <div>
              <label for="squat_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">深蹲 (kg)</label>
              {#if isEditing}
                <input
                  id="squat_kg"
                  type="number"
                  bind:value={profile.squat_kg}
                  min="10"
                  max="400"
                  step="2.5"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="100"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.squat_kg ? profile.squat_kg + ' kg' : '未设置'}</p>
              {/if}
            </div>
            
            <div>
              <label for="deadlift_kg" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">硬拉 (kg)</label>
              {#if isEditing}
                <input
                  id="deadlift_kg"
                  type="number"
                  bind:value={profile.deadlift_kg}
                  min="10"
                  max="400"
                  step="2.5"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="120"
                />
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.deadlift_kg ? profile.deadlift_kg + ' kg' : '未设置'}</p>
              {/if}
            </div>
            
            {#if profile.bench_press_kg && profile.squat_kg && profile.deadlift_kg && profile.weight_kg}
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">力量指标</h4>
                <div class="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div class="text-center">
                    <p class="font-medium">卧推/体重</p>
                    <p>{(parseFloat(profile.bench_press_kg) / parseFloat(profile.weight_kg)).toFixed(1)}x</p>
                  </div>
                  <div class="text-center">
                    <p class="font-medium">深蹲/体重</p>
                    <p>{(parseFloat(profile.squat_kg) / parseFloat(profile.weight_kg)).toFixed(1)}x</p>
                  </div>
                  <div class="text-center">
                    <p class="font-medium">硬拉/体重</p>
                    <p>{(parseFloat(profile.deadlift_kg) / parseFloat(profile.weight_kg)).toFixed(1)}x</p>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- 训练目标 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">训练目标</h3>
          
          <div class="space-y-4">
            <div>
              <label for="goals" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">训练目标</label>
              {#if isEditing}
                <textarea
                  id="goals"
                  bind:value={profile.goals}
                  rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="描述您的训练目标..."
                ></textarea>
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.goals || '未设置'}</p>
              {/if}
            </div>
            
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">个人简介</label>
              {#if isEditing}
                <textarea
                  id="bio"
                  bind:value={profile.bio}
                  rows="4"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="简单介绍一下自己..."
                ></textarea>
              {:else}
                <p class="text-gray-900 dark:text-white">{profile.bio || '未设置'}</p>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      {#if isEditing}
        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            on:click={cancelEdit}
            disabled={isSaving}
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            取消
          </button>
          <button
            type="button"
            on:click={saveProfile}
            disabled={isSaving}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSaving}
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              保存中...
            {:else}
              保存
            {/if}
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div> 