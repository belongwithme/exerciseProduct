<!-- 训练日志记录器组件 -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let isOpen = false;
  
     // 表单数据
   let workoutData = {
     date: new Date().toISOString().split('T')[0],
     exercises: [] as any[],
     duration: 0,
     notes: '',
     type: 'strength'
   };
  
  // 当前添加的运动
  let currentExercise = {
    name: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  };
  
  let isSaving = false;
  let error = '';
  
  // 预设运动列表
  const exercisePresets = [
    '深蹲', '硬拉', '卧推', '引体向上', '俯卧撑',
    '跳跃训练', '冲刺跑', '平板支撑', '弓步蹲', '臀桥'
  ];
  
  function addExercise() {
    if (!currentExercise.name.trim()) {
      error = '请输入运动名称';
      return;
    }
    
    workoutData.exercises.push({
      ...currentExercise,
      id: Date.now()
    });
    
    // 重置当前运动
    currentExercise = {
      name: '',
      sets: '',
      reps: '',
      weight: '',
      notes: ''
    };
    
    error = '';
  }
  
     function removeExercise(exerciseId: any) {
     workoutData.exercises = workoutData.exercises.filter(ex => ex.id !== exerciseId);
   }
   
   function selectPresetExercise(exerciseName: string) {
     currentExercise.name = exerciseName;
   }
  
  async function saveWorkout() {
    try {
      isSaving = true;
      error = '';
      
      // 验证
      if (workoutData.exercises.length === 0) {
        error = '请至少添加一个运动';
        return;
      }
      
      if (!workoutData.duration || workoutData.duration <= 0) {
        error = '请输入有效的训练时长';
        return;
      }
      
      // 模拟保存到数据库
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 触发保存事件
      dispatch('save', {
        ...workoutData,
        id: Date.now(),
        created_at: new Date().toISOString(),
        exercises_count: workoutData.exercises.length,
        total_sets: workoutData.exercises.reduce((total, ex) => total + parseInt(ex.sets || '0'), 0)
      });
      
      // 重置表单
      workoutData = {
        date: new Date().toISOString().split('T')[0],
        exercises: [],
        duration: 0,
        notes: '',
        type: 'strength'
      };
      
      isOpen = false;
      
    } catch (err) {
      error = '保存失败，请重试';
    } finally {
      isSaving = false;
    }
  }
  
  function closeModal() {
    isOpen = false;
    dispatch('close');
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">记录训练</h2>
          <button
            on:click={closeModal}
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {#if error}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-red-700 text-sm">{error}</p>
          </div>
        {/if}

        <form on:submit|preventDefault={saveWorkout} class="space-y-6">
          <!-- 基本信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                训练日期
              </label>
              <input
                id="date"
                type="date"
                bind:value={workoutData.date}
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                训练时长 (分钟)
              </label>
              <input
                id="duration"
                type="number"
                bind:value={workoutData.duration}
                min="1"
                max="300"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="60"
                required
              />
            </div>
          </div>

          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              训练类型
            </label>
            <select
              id="type"
              bind:value={workoutData.type}
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="strength">力量训练</option>
              <option value="cardio">有氧训练</option>
              <option value="flexibility">柔韧性训练</option>
              <option value="sports">运动训练</option>
            </select>
          </div>

          <!-- 添加运动 -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">添加运动</h3>
            
            <!-- 预设运动快捷选择 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                常用运动
              </label>
              <div class="flex flex-wrap gap-2">
                {#each exercisePresets as preset}
                  <button
                    type="button"
                    on:click={() => selectPresetExercise(preset)}
                    class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {preset}
                  </button>
                {/each}
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label for="exercise-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  运动名称 *
                </label>
                <input
                  id="exercise-name"
                  type="text"
                  bind:value={currentExercise.name}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="深蹲"
                />
              </div>
              
              <div>
                <label for="sets" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  组数
                </label>
                <input
                  id="sets"
                  type="number"
                  bind:value={currentExercise.sets}
                  min="1"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="3"
                />
              </div>
              
              <div>
                <label for="reps" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  重复次数
                </label>
                <input
                  id="reps"
                  type="text"
                  bind:value={currentExercise.reps}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="12"
                />
              </div>
              
              <div>
                <label for="weight" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  重量 (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  bind:value={currentExercise.weight}
                  min="0"
                  step="0.5"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="60"
                />
              </div>
            </div>
            
            <div class="mb-4">
              <label for="exercise-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                运动备注
              </label>
              <input
                id="exercise-notes"
                type="text"
                bind:value={currentExercise.notes}
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="感觉、技巧提醒等"
              />
            </div>
            
            <button
              type="button"
              on:click={addExercise}
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              添加运动
            </button>
          </div>

          <!-- 已添加的运动列表 -->
          {#if workoutData.exercises.length > 0}
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">训练内容</h3>
              <div class="space-y-3">
                {#each workoutData.exercises as exercise}
                  <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div class="flex-1">
                      <div class="font-medium text-gray-900 dark:text-white">{exercise.name}</div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        {#if exercise.sets && exercise.reps}
                          {exercise.sets} 组 × {exercise.reps} 次
                        {/if}
                        {#if exercise.weight}
                          · {exercise.weight}kg
                        {/if}
                        {#if exercise.notes}
                          · {exercise.notes}
                        {/if}
                      </div>
                    </div>
                    <button
                      type="button"
                      on:click={() => removeExercise(exercise.id)}
                      class="text-red-500 hover:text-red-700 ml-3"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- 训练备注 -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              训练备注
            </label>
            <textarea
              id="notes"
              bind:value={workoutData.notes}
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="记录今天的训练感受、遇到的问题等..."
            ></textarea>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              on:click={closeModal}
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              取消
            </button>
            <button
              type="submit"
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
                保存训练记录
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
