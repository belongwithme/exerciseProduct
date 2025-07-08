<!-- 能力分析页面 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, userProfile } from '$lib/stores/auth';
  import { analyzeJumpAbility, assessStrengthStructure } from '$lib/utils/analysis';
  import JumpAnalysisChart from '$lib/components/Charts/JumpAnalysisChart.svelte';
  import StrengthRadarChart from '$lib/components/Charts/StrengthRadarChart.svelte';
  import CoreProblemsAnalysis from '$lib/components/Analysis/CoreProblemsAnalysis.svelte';
  import { demoProfile, demoJumpAnalysis, demoStrengthAssessment } from '$lib/data/demo';
  import type { Profile, JumpAnalysis, StrengthAssessment } from '$lib/types';

  // 页面状态
  let loading = true;
  let error = '';
  let profile: Profile | null = null;
  let jumpAnalysis: JumpAnalysis | null = null;
  let strengthAssessment: StrengthAssessment | null = null;

  // 页面标题
  const pageTitle = "能力分析";

  /**
   * 加载用户档案和分析数据
   */
  function loadAnalysisData() {
    try {
      loading = true;
      error = '';

      // 如果用户已登录且有档案数据，使用真实数据
      if ($user && $userProfile && hasEnoughDataForAnalysis($userProfile)) {
        profile = $userProfile;
        jumpAnalysis = analyzeJumpAbility($userProfile);
        strengthAssessment = assessStrengthStructure($userProfile);
      } 
      // 如果用户已登录但数据不足，提示补充
      else if ($user && $userProfile && !hasEnoughDataForAnalysis($userProfile)) {
        error = '数据不足，请在个人资料中补充身高、体重、摸高和力量数据';
        loading = false;
        return;
      }
      // 如果用户已登录但没有档案，提示完善
      else if ($user && !$userProfile) {
        error = '无法获取用户档案数据，请先完善个人资料';
        loading = false;
        return;
      }
      // 如果用户未登录，使用演示数据
      else {
        profile = demoProfile;
        jumpAnalysis = demoJumpAnalysis;
        strengthAssessment = demoStrengthAssessment;
      }

    } catch (err) {
      console.error('加载分析数据失败:', err);
      error = '加载分析数据失败，请稍后重试';
    } finally {
      loading = false;
    }
  }

  /**
   * 检查是否有足够的数据进行分析
   */
  function hasEnoughDataForAnalysis(profile: Profile): boolean {
    // 基本身体数据：明确检查 null 和 undefined
    const hasBasicData = profile.height_cm != null && profile.weight_kg != null;
    
    // 弹跳相关数据：明确检查 null 和 undefined
    const hasJumpData = profile.standing_reach_cm != null && profile.max_touch_height_cm != null;
    
    // 力量数据（至少有一项）：明确检查 null 和 undefined
    const hasStrengthData = profile.bench_press_kg != null || profile.squat_kg != null || profile.deadlift_kg != null;

    return !!(hasBasicData && (hasJumpData || hasStrengthData));
  }

  /**
   * 跳转到个人资料页面
   */
  function goToProfile() {
    goto('/profile');
  }

  /**
   * 重新加载分析数据
   */
  function reloadAnalysis() {
    loadAnalysisData();
  }

  // 组件挂载时加载数据
  onMount(() => {
    loadAnalysisData();
  });

  // 监听用户状态变化，重新加载数据
  $: if ($user !== undefined) {
    loadAnalysisData();
  }
</script>

<!-- 页面头部 -->
<svelte:head>
  <title>{pageTitle} - 训练计划系统</title>
  <meta name="description" content="分析您的弹跳能力和力量结构，识别训练中的核心问题" />
</svelte:head>

<!-- 主要内容 -->
<main class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-7xl mx-auto px-4">
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">🎯 能力分析</h1>
      <p class="text-gray-600">基于您的身体数据和训练水平，提供专业的能力评估和训练建议</p>
      {#if !$user}
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-700">
            📊 当前显示的是演示数据。<a href="/auth" class="underline font-medium">登录</a>后可查看基于您个人数据的分析结果。
          </p>
        </div>
      {/if}
    </div>

    <!-- 加载状态 -->
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">正在分析您的能力数据...</span>
      </div>
    
    <!-- 错误状态 -->
    {:else if error}
      <div class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="text-red-500 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-red-800 mb-2">无法进行能力分析</h3>
          <p class="text-red-600 mb-4">{error}</p>
          <div class="flex justify-center space-x-4">
            <button
              on:click={goToProfile}
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              完善个人资料
            </button>
            <button
              on:click={reloadAnalysis}
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              重新分析
            </button>
          </div>
        </div>
      </div>
    
    <!-- 分析结果 -->
    {:else if profile && jumpAnalysis && strengthAssessment}
      <div class="space-y-8">
        <!-- 分析概览 -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 class="text-xl font-bold text-gray-800 mb-4">分析概览</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">
                {jumpAnalysis.current_jump}cm
              </div>
              <div class="text-sm text-gray-600">当前弹跳高度</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">
                {strengthAssessment.overall_score}分
              </div>
              <div class="text-sm text-gray-600">综合力量评分</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600 mb-2">
                {jumpAnalysis.improvement_needed}cm
              </div>
              <div class="text-sm text-gray-600">需要提升高度</div>
            </div>
          </div>
        </div>

        <!-- 图表分析区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 弹跳能力分析 -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <JumpAnalysisChart 
              {jumpAnalysis}
            />
          </div>

          <!-- 力量结构评估 -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <StrengthRadarChart 
              {strengthAssessment}
            />
          </div>
        </div>

        <!-- 核心问题分析 -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <CoreProblemsAnalysis {profile} />
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-center space-x-4">
          <button
            on:click={goToProfile}
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            更新个人资料
          </button>
          <button
            on:click={reloadAnalysis}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            重新分析
          </button>
        </div>
      </div>
    {/if}

    <!-- 返回按钮 -->
    <div class="mt-8 text-center">
      <button
        on:click={() => goto('/')}
        class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        ← 返回首页
      </button>
    </div>
  </div>
</main> 