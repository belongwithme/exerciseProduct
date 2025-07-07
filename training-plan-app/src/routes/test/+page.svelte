<!-- 测试页面 - 用于调试认证问题 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/utils/supabaseClient';
  import { authLoading, authError, user, session } from '$lib/stores/auth';

  let testResults = {
    supabaseConnection: '未测试',
    authSession: '未测试',
    envVars: '未测试'
  };

  onMount(async () => {
    await runTests();
  });

  async function runTests() {
    // 测试环境变量
    testResults.envVars = import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY 
      ? '✅ 环境变量已设置' 
      : '❌ 环境变量未设置';

    // 测试 Supabase 连接
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        testResults.supabaseConnection = `❌ 连接失败: ${error.message}`;
      } else {
        testResults.supabaseConnection = '✅ Supabase 连接成功';
      }
    } catch (error) {
      testResults.supabaseConnection = `❌ 连接异常: ${error}`;
    }

    // 测试认证会话
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        testResults.authSession = `❌ 会话获取失败: ${error.message}`;
      } else {
        testResults.authSession = session 
          ? '✅ 用户已登录' 
          : '✅ 用户未登录（正常）';
      }
    } catch (error) {
      testResults.authSession = `❌ 会话获取异常: ${error}`;
    }

    // 触发重新渲染
    testResults = { ...testResults };
  }

  async function testLogin() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'test123'
      });
      
      if (error) {
        console.log('测试登录失败（预期）:', error.message);
        alert(`测试登录失败（预期）: ${error.message}`);
      } else {
        console.log('测试登录成功:', data);
        alert('测试登录成功');
      }
    } catch (error) {
      console.error('测试登录异常:', error);
      alert(`测试登录异常: ${error}`);
    }
  }
</script>

<svelte:head>
  <title>认证测试页面</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">认证功能测试</h1>

    <!-- 测试结果 -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">测试结果</h2>
      
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">环境变量:</span>
          <span class="font-mono text-sm">{testResults.envVars}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Supabase 连接:</span>
          <span class="font-mono text-sm">{testResults.supabaseConnection}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-gray-600">认证会话:</span>
          <span class="font-mono text-sm">{testResults.authSession}</span>
        </div>
      </div>
    </div>

    <!-- 当前状态 -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">当前状态</h2>
      
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">加载状态:</span>
          <span class="font-mono text-sm">{$authLoading ? '正在加载' : '加载完成'}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-gray-600">用户状态:</span>
          <span class="font-mono text-sm">{$user ? '已登录' : '未登录'}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-gray-600">错误信息:</span>
          <span class="font-mono text-sm text-red-600">{$authError || '无错误'}</span>
        </div>
      </div>
    </div>

    <!-- 测试按钮 -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">测试操作</h2>
      
      <div class="space-y-4">
        <button
          on:click={runTests}
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          重新运行测试
        </button>
        
        <button
          on:click={testLogin}
          class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          测试登录功能
        </button>
        
        <a
          href="/auth"
          class="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 text-center"
        >
          返回认证页面
        </a>
      </div>
    </div>

    <!-- 环境变量信息 -->
    <div class="bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">环境变量信息</h2>
      
      <div class="space-y-2 text-sm">
        <div>
          <span class="text-gray-600">PUBLIC_SUPABASE_URL:</span>
          <span class="font-mono ml-2">{import.meta.env.PUBLIC_SUPABASE_URL ? '已设置' : '未设置'}</span>
        </div>
        <div>
          <span class="text-gray-600">PUBLIC_SUPABASE_ANON_KEY:</span>
          <span class="font-mono ml-2">{import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置'}</span>
        </div>
      </div>
    </div>
  </div>
</div> 