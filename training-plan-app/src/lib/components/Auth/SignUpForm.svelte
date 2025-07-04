<!-- 用户注册表单组件 -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { signUp, clearAuthError } from '$lib/stores/auth';
  import { authLoading, authError } from '$lib/stores/auth';

  const dispatch = createEventDispatcher();

  // 基本认证信息
  let email = '';
  let password = '';
  let confirmPassword = '';
  let username = '';
  let fullName = '';

  // 可选的基本身体数据
  let height = '';
  let weight = '';
  let age = '';
  let gender = '';

  // 表单验证状态
  let emailError = '';
  let passwordError = '';
  let confirmPasswordError = '';
  let usernameError = '';
  let isSubmitting = false;

  // 显示扩展信息表单
  let showExtendedForm = false;

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
   * 验证密码强度
   */
  function validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  /**
   * 验证用户名
   */
  function validateUsername(username: string): boolean {
    return username.length >= 2 && username.length <= 20;
  }

  /**
   * 验证表单
   */
  function validateForm(): boolean {
    let isValid = true;

    // 清除之前的错误
    emailError = '';
    passwordError = '';
    confirmPasswordError = '';
    usernameError = '';

    // 验证邮箱
    if (!email.trim()) {
      emailError = '请输入邮箱地址';
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError = '请输入有效的邮箱地址';
      isValid = false;
    }

    // 验证用户名
    if (!username.trim()) {
      usernameError = '请输入用户名';
      isValid = false;
    } else if (!validateUsername(username)) {
      usernameError = '用户名长度应在2-20个字符之间';
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

    // 验证确认密码
    if (!confirmPassword.trim()) {
      confirmPasswordError = '请确认密码';
      isValid = false;
    } else if (password !== confirmPassword) {
      confirmPasswordError = '两次输入的密码不一致';
      isValid = false;
    }

    return isValid;
  }

  /**
   * 处理注册提交
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
      // 准备用户数据
      const userData: any = {
        username: username.trim(),
        full_name: fullName.trim() || username.trim(),
      };

      // 如果填写了可选信息，添加到用户数据中
      if (height) userData.height_cm = parseInt(height);
      if (weight) userData.weight_kg = parseFloat(weight);
      if (age) userData.age = parseInt(age);
      if (gender) userData.gender = gender;

      const result = await signUp(email, password, userData);
      
      if (result.success) {
        // 注册成功，触发事件
        dispatch('success', { 
          message: result.message || '注册成功！',
          needsProfileCompletion: !showExtendedForm || !height || !weight,
          needsConfirmation: result.needsConfirmation
        });
      } else {
        // 注册失败，错误信息已经在auth store中设置
        console.error('注册失败:', result.message);
      }
    } catch (error) {
      console.error('注册处理失败:', error);
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
   * 切换扩展表单显示
   */
  function toggleExtendedForm() {
    showExtendedForm = !showExtendedForm;
  }
</script>

<div class="w-full max-w-md mx-auto">
  <div class="bg-white shadow-lg rounded-lg p-6">
    <!-- 标题 -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">注册</h2>
      <p class="text-gray-600 mt-2">创建您的训练计划账户</p>
    </div>

    <!-- 表单 -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <!-- 基本信息区域 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2">
          基本信息
        </h3>

        <!-- 邮箱输入 -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            邮箱地址 <span class="text-red-500">*</span>
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

        <!-- 用户名输入 -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            用户名 <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="请输入用户名"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            class:border-red-500={usernameError}
            disabled={loading || isSubmitting}
          />
          {#if usernameError}
            <p class="mt-1 text-sm text-red-600">{usernameError}</p>
          {/if}
        </div>

        <!-- 全名输入 -->
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
            真实姓名 <span class="text-gray-400">(可选)</span>
          </label>
          <input
            id="fullName"
            type="text"
            bind:value={fullName}
            placeholder="请输入真实姓名"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading || isSubmitting}
          />
        </div>

        <!-- 密码输入 -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            密码 <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="请输入密码（至少6个字符）"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            class:border-red-500={passwordError}
            disabled={loading || isSubmitting}
          />
          {#if passwordError}
            <p class="mt-1 text-sm text-red-600">{passwordError}</p>
          {/if}
        </div>

        <!-- 确认密码输入 -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            确认密码 <span class="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            bind:value={confirmPassword}
            placeholder="请再次输入密码"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            class:border-red-500={confirmPasswordError}
            disabled={loading || isSubmitting}
          />
          {#if confirmPasswordError}
            <p class="mt-1 text-sm text-red-600">{confirmPasswordError}</p>
          {/if}
        </div>
      </div>

      <!-- 可选身体数据区域 -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-700">
            身体数据 <span class="text-gray-400">(可选)</span>
          </h3>
          <button
            type="button"
            on:click={toggleExtendedForm}
            class="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {showExtendedForm ? '收起' : '展开'}
          </button>
        </div>

        {#if showExtendedForm}
          <div class="space-y-4 bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">
              填写这些信息可以帮助我们为您提供更个性化的训练计划。您也可以稍后在个人资料中完善这些信息。
            </p>

            <!-- 身高体重行 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="height" class="block text-sm font-medium text-gray-700 mb-1">
                  身高 (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  bind:value={height}
                  placeholder="170"
                  min="100"
                  max="250"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading || isSubmitting}
                />
              </div>

              <div>
                <label for="weight" class="block text-sm font-medium text-gray-700 mb-1">
                  体重 (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  bind:value={weight}
                  placeholder="70"
                  min="30"
                  max="200"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading || isSubmitting}
                />
              </div>
            </div>

            <!-- 年龄性别行 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="age" class="block text-sm font-medium text-gray-700 mb-1">
                  年龄
                </label>
                <input
                  id="age"
                  type="number"
                  bind:value={age}
                  placeholder="25"
                  min="13"
                  max="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading || isSubmitting}
                />
              </div>

              <div>
                <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">
                  性别
                </label>
                <select
                  id="gender"
                  bind:value={gender}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading || isSubmitting}
                >
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- 错误信息显示 -->
      {#if error}
        <div class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-sm text-red-800">{error}</p>
        </div>
      {/if}

      <!-- 提交按钮 -->
      <button
        type="submit"
        disabled={loading || isSubmitting}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {#if loading || isSubmitting}
          <div class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            注册中...
          </div>
        {:else}
          注册
        {/if}
      </button>
    </form>

    <!-- 切换到登录 -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        已有账户？
        <button
          on:click={switchToSignIn}
          class="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
          disabled={loading || isSubmitting}
        >
          立即登录
        </button>
      </p>
    </div>
  </div>
</div> 