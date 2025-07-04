<!-- 个人资料表单组件 -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { calculateBMI, getBMIStatus } from '$lib/utils';
  import type { Profile } from '$lib/types';

  // 事件派发器
  const dispatch = createEventDispatcher();

  // 表单数据
  export let profile: Partial<Profile> = {};
  
  // 表单状态
  let loading = false;
  let errors: Record<string, string> = {};

  // 表单字段
  let formData = {
    username: profile.username || '',
    full_name: profile.full_name || '',
    height_cm: profile.height_cm || '',
    weight_kg: profile.weight_kg || '',
    age: profile.age || '',
    gender: profile.gender || '',
    standing_reach_cm: profile.standing_reach_cm || '',
    max_touch_height_cm: profile.max_touch_height_cm || '',
    bench_press_kg: profile.bench_press_kg || '',
    squat_kg: profile.squat_kg || '',
    deadlift_kg: profile.deadlift_kg || '',
    target_touch_height_cm: profile.target_touch_height_cm || ''
  };

  // 计算属性
  $: bmi = formData.height_cm && formData.weight_kg ? 
    calculateBMI(Number(formData.weight_kg), Number(formData.height_cm)) : 0;
  
  $: bmiStatus = bmi ? getBMIStatus(bmi) : '';
  
  $: verticalJump = formData.max_touch_height_cm && formData.standing_reach_cm ? 
    Number(formData.max_touch_height_cm) - Number(formData.standing_reach_cm) : 0;
  
  $: targetImprovement = formData.target_touch_height_cm && formData.max_touch_height_cm ? 
    Number(formData.target_touch_height_cm) - Number(formData.max_touch_height_cm) : 0;

  /**
   * 验证表单数据
   */
  function validateForm(): boolean {
    errors = {};
    
    // 基本信息验证
    if (!formData.username?.trim()) {
      errors.username = '用户名不能为空';
    } else if (formData.username.length < 2) {
      errors.username = '用户名至少需要2个字符';
    }

    // 身体数据验证
    if (formData.height_cm && (Number(formData.height_cm) < 100 || Number(formData.height_cm) > 250)) {
      errors.height_cm = '身高应在100-250cm之间';
    }
    
    if (formData.weight_kg && (Number(formData.weight_kg) < 30 || Number(formData.weight_kg) > 200)) {
      errors.weight_kg = '体重应在30-200kg之间';
    }
    
    if (formData.age && (Number(formData.age) < 10 || Number(formData.age) > 100)) {
      errors.age = '年龄应在10-100岁之间';
    }

    // 弹跳数据验证
    if (formData.standing_reach_cm && Number(formData.standing_reach_cm) < 150) {
      errors.standing_reach_cm = '站立摸高应大于150cm';
    }
    
    if (formData.max_touch_height_cm && formData.standing_reach_cm && 
        Number(formData.max_touch_height_cm) <= Number(formData.standing_reach_cm)) {
      errors.max_touch_height_cm = '最大摸高应大于站立摸高';
    }

    // 力量数据验证
    if (formData.bench_press_kg && Number(formData.bench_press_kg) < 0) {
      errors.bench_press_kg = '卧推重量不能为负数';
    }
    
    if (formData.squat_kg && Number(formData.squat_kg) < 0) {
      errors.squat_kg = '深蹲重量不能为负数';
    }
    
    if (formData.deadlift_kg && Number(formData.deadlift_kg) < 0) {
      errors.deadlift_kg = '硬拉重量不能为负数';
    }

    // 目标数据验证
    if (formData.target_touch_height_cm && formData.max_touch_height_cm && 
        Number(formData.target_touch_height_cm) <= Number(formData.max_touch_height_cm)) {
      errors.target_touch_height_cm = '目标摸高应大于当前最大摸高';
    }

    return Object.keys(errors).length === 0;
  }

  /**
   * 提交表单
   */
  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    loading = true;
    
    try {
      // 准备提交数据，只提交有值的字段
      const submitData: any = {};
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          // 数值字段转换为数字
          if (['height_cm', 'weight_kg', 'age', 'standing_reach_cm', 'max_touch_height_cm', 
               'bench_press_kg', 'squat_kg', 'deadlift_kg', 'target_touch_height_cm'].includes(key)) {
            submitData[key] = Number(value);
          } else {
            submitData[key] = value;
          }
        }
      });

      // 派发提交事件
      dispatch('submit', submitData);
      
    } catch (error) {
      console.error('表单提交失败:', error);
    } finally {
      loading = false;
    }
  }

  /**
   * 重置表单
   */
  function handleReset() {
    formData = {
      username: profile.username || '',
      full_name: profile.full_name || '',
      height_cm: profile.height_cm || '',
      weight_kg: profile.weight_kg || '',
      age: profile.age || '',
      gender: profile.gender || '',
      standing_reach_cm: profile.standing_reach_cm || '',
      max_touch_height_cm: profile.max_touch_height_cm || '',
      bench_press_kg: profile.bench_press_kg || '',
      squat_kg: profile.squat_kg || '',
      deadlift_kg: profile.deadlift_kg || '',
      target_touch_height_cm: profile.target_touch_height_cm || ''
    };
    errors = {};
  }
</script>

<!-- 个人资料表单 -->
<div class="max-w-4xl mx-auto">
  <form on:submit|preventDefault={handleSubmit} class="space-y-8">
    
    <!-- 基本信息 -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <span class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
          1
        </span>
        基本信息
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 用户名 -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            用户名 <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            bind:value={formData.username}
            class="input-field"
            placeholder="请输入用户名"
            required
          />
          {#if errors.username}
            <p class="text-red-500 text-sm mt-1">{errors.username}</p>
          {/if}
        </div>

        <!-- 全名 -->
        <div>
          <label for="full_name" class="block text-sm font-medium text-gray-700 mb-2">
            全名
          </label>
          <input
            type="text"
            id="full_name"
            bind:value={formData.full_name}
            class="input-field"
            placeholder="请输入全名"
          />
        </div>

        <!-- 年龄 -->
        <div>
          <label for="age" class="block text-sm font-medium text-gray-700 mb-2">
            年龄
          </label>
          <input
            type="number"
            id="age"
            bind:value={formData.age}
            class="input-field"
            placeholder="请输入年龄"
            min="10"
            max="100"
          />
          {#if errors.age}
            <p class="text-red-500 text-sm mt-1">{errors.age}</p>
          {/if}
        </div>

        <!-- 性别 -->
        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
            性别
          </label>
          <select
            id="gender"
            bind:value={formData.gender}
            class="input-field"
          >
            <option value="">请选择性别</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 身体数据 -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <span class="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
          2
        </span>
        身体数据
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 身高 -->
        <div>
          <label for="height_cm" class="block text-sm font-medium text-gray-700 mb-2">
            身高 (cm)
          </label>
          <input
            type="number"
            id="height_cm"
            bind:value={formData.height_cm}
            class="input-field"
            placeholder="请输入身高"
            min="100"
            max="250"
          />
          {#if errors.height_cm}
            <p class="text-red-500 text-sm mt-1">{errors.height_cm}</p>
          {/if}
        </div>

        <!-- 体重 -->
        <div>
          <label for="weight_kg" class="block text-sm font-medium text-gray-700 mb-2">
            体重 (kg)
          </label>
          <input
            type="number"
            id="weight_kg"
            bind:value={formData.weight_kg}
            class="input-field"
            placeholder="请输入体重"
            min="30"
            max="200"
            step="0.1"
          />
          {#if errors.weight_kg}
            <p class="text-red-500 text-sm mt-1">{errors.weight_kg}</p>
          {/if}
        </div>

        <!-- BMI显示 -->
        {#if bmi > 0}
          <div class="md:col-span-2">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">BMI指数</span>
                <div class="text-right">
                  <span class="text-lg font-semibold text-gray-900">{bmi}</span>
                  <span class="text-sm text-gray-500 ml-2">({bmiStatus})</span>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- 弹跳数据 -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <span class="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
          3
        </span>
        弹跳数据
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 站立摸高 -->
        <div>
          <label for="standing_reach_cm" class="block text-sm font-medium text-gray-700 mb-2">
            站立摸高 (cm)
          </label>
          <input
            type="number"
            id="standing_reach_cm"
            bind:value={formData.standing_reach_cm}
            class="input-field"
            placeholder="请输入站立摸高"
            min="150"
          />
          {#if errors.standing_reach_cm}
            <p class="text-red-500 text-sm mt-1">{errors.standing_reach_cm}</p>
          {/if}
        </div>

        <!-- 最大摸高 -->
        <div>
          <label for="max_touch_height_cm" class="block text-sm font-medium text-gray-700 mb-2">
            最大摸高 (cm)
          </label>
          <input
            type="number"
            id="max_touch_height_cm"
            bind:value={formData.max_touch_height_cm}
            class="input-field"
            placeholder="请输入最大摸高"
            min="150"
          />
          {#if errors.max_touch_height_cm}
            <p class="text-red-500 text-sm mt-1">{errors.max_touch_height_cm}</p>
          {/if}
        </div>

        <!-- 垂直跳跃显示 -->
        {#if verticalJump > 0}
          <div class="md:col-span-2">
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">当前垂直跳跃</span>
                <span class="text-lg font-semibold text-purple-600">{verticalJump} cm</span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- 力量数据 -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <span class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
          4
        </span>
        力量数据
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 卧推 -->
        <div>
          <label for="bench_press_kg" class="block text-sm font-medium text-gray-700 mb-2">
            卧推 (kg)
          </label>
          <input
            type="number"
            id="bench_press_kg"
            bind:value={formData.bench_press_kg}
            class="input-field"
            placeholder="请输入卧推重量"
            min="0"
            step="0.5"
          />
          {#if errors.bench_press_kg}
            <p class="text-red-500 text-sm mt-1">{errors.bench_press_kg}</p>
          {/if}
        </div>

        <!-- 深蹲 -->
        <div>
          <label for="squat_kg" class="block text-sm font-medium text-gray-700 mb-2">
            深蹲 (kg)
          </label>
          <input
            type="number"
            id="squat_kg"
            bind:value={formData.squat_kg}
            class="input-field"
            placeholder="请输入深蹲重量"
            min="0"
            step="0.5"
          />
          {#if errors.squat_kg}
            <p class="text-red-500 text-sm mt-1">{errors.squat_kg}</p>
          {/if}
        </div>

        <!-- 硬拉 -->
        <div>
          <label for="deadlift_kg" class="block text-sm font-medium text-gray-700 mb-2">
            硬拉 (kg)
          </label>
          <input
            type="number"
            id="deadlift_kg"
            bind:value={formData.deadlift_kg}
            class="input-field"
            placeholder="请输入硬拉重量"
            min="0"
            step="0.5"
          />
          {#if errors.deadlift_kg}
            <p class="text-red-500 text-sm mt-1">{errors.deadlift_kg}</p>
          {/if}
        </div>
      </div>
    </div>

    <!-- 目标设定 -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <span class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
          5
        </span>
        目标设定
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 目标摸高 -->
        <div>
          <label for="target_touch_height_cm" class="block text-sm font-medium text-gray-700 mb-2">
            目标摸高 (cm)
          </label>
          <input
            type="number"
            id="target_touch_height_cm"
            bind:value={formData.target_touch_height_cm}
            class="input-field"
            placeholder="请输入目标摸高"
            min="200"
          />
          {#if errors.target_touch_height_cm}
            <p class="text-red-500 text-sm mt-1">{errors.target_touch_height_cm}</p>
          {/if}
        </div>

        <!-- 需要提升显示 -->
        {#if targetImprovement > 0}
          <div class="flex items-end">
            <div class="bg-red-50 p-4 rounded-lg w-full">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">需要提升</span>
                <span class="text-lg font-semibold text-red-600">{targetImprovement} cm</span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="flex justify-end space-x-4">
      <button
        type="button"
        on:click={handleReset}
        class="btn-secondary"
        disabled={loading}
      >
        重置
      </button>
      
      <button
        type="submit"
        class="btn-primary"
        disabled={loading}
      >
        {#if loading}
          <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          保存中...
        {:else}
          保存资料
        {/if}
      </button>
    </div>
  </form>
</div> 