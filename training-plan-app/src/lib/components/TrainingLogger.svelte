<!--
  @component
  TrainingLogger
  ===============
  A component for manually logging workout sessions.
  It includes a form to add new logs and a list to display past logs.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/utils/supabaseClient';
  // import type { definitions } from '$lib/types/supabase'; // Type definitions not available, using 'any' for now.

  // State variables for exercises and logs
  let exercises: any[] = []; // Using any as type definitions are missing
  let logs: any[] = []; // Using any for now for simplicity on joined data
  let loading = true;
  let error: string | null = null;

  // Form data for a new log entry
  let newLog = {
    exercise_id: null,
    sets: null,
    reps: null,
    weight_kg: null,
    date: new Date().toISOString().slice(0, 10) // Default to today
  };

  /**
   * Fetches the list of available exercises from the database.
   */
  async function getExercises() {
    const { data, error: fetchError } = await supabase
      .from('exercises')
      .select('id, name')
      .order('name');
    
    if (fetchError) {
      error = fetchError.message;
      console.error('Error fetching exercises:', fetchError);
    } else {
      exercises = data || [];
    }
  }

  /**
   * Fetches the recent training logs from the database.
   * This version joins with exercises to get the name.
   */
  async function getLogs() {
    // For simplicity, we are fetching raw logged_sets and will enhance this later
    // to group by workout_logs.
    const { data, error: fetchError } = await supabase
      .from('logged_sets')
      .select(`
        *,
        exercises (name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (fetchError) {
      error = fetchError.message;
      console.error('Error fetching logs:', fetchError);
    } else {
      logs = data || [];
    }
  }

  /**
   * Handles the form submission to create a new workout log.
   */
  async function handleSubmit() {
    if (!newLog.exercise_id || !newLog.sets || !newLog.reps || !newLog.weight_kg) {
      alert('请填写所有字段');
      return;
    }

    loading = true;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("用户未登录");

      // Step 1: Create a workout_log entry
      const { data: logData, error: logError } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          date: newLog.date
        })
        .select('id')
        .single();

      if (logError) throw logError;
      if (!logData) throw new Error("Failed to create log entry.");

      // Step 2: Create logged_set entries for each set
      for (let i = 1; i <= newLog.sets; i++) {
        const { error: setError } = await supabase
          .from('logged_sets')
          .insert({
            log_id: (logData as any).id,
            exercise_id: newLog.exercise_id,
            set_number: i,
            reps: newLog.reps,
            weight_kg: newLog.weight_kg
          });
        
        if (setError) throw setError;
      }
      
      // Reset form and refresh logs
      newLog.exercise_id = null;
      newLog.sets = null;
      newLog.reps = null;
      newLog.weight_kg = null;
      
      await getLogs();
      alert('训练记录已成功添加！');

    } catch (e: any) {
      error = e.message;
      console.error('Error creating log:', e);
      alert('添加记录失败: ' + e.message);
    } finally {
      loading = false;
    }
  }

  // Fetch initial data when the component mounts
  onMount(async () => {
    loading = true;
    await Promise.all([getExercises(), getLogs()]);
    loading = false;
  });
</script>

<div class="p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4">记录训练</h2>
  
  {#if error}
    <div class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
      <span class="font-medium">错误:</span> {error}
    </div>
  {/if}

  <!-- Training Log Form -->
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="date" class="block text-sm font-medium text-gray-700">日期</label>
      <input type="date" id="date" bind:value={newLog.date} class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
    </div>
    
    <div>
      <label for="exercise" class="block text-sm font-medium text-gray-700">训练动作</label>
      <select id="exercise" bind:value={newLog.exercise_id} class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
        <option value={null} disabled>选择一个动作</option>
        {#each exercises as exercise}
          <option value={exercise.id}>{exercise.name}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="sets" class="block text-sm font-medium text-gray-700">组数</label>
      <input type="number" id="sets" bind:value={newLog.sets} class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required min="1">
    </div>

    <div>
      <label for="reps" class="block text-sm font-medium text-gray-700">每组次数</label>
      <input type="number" id="reps" bind:value={newLog.reps} class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required min="1">
    </div>

    <div>
      <label for="weight" class="block text-sm font-medium text-gray-700">重量 (kg)</label>
      <input type="number" id="weight" step="0.5" bind:value={newLog.weight_kg} class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required min="0">
    </div>

    <button type="submit" disabled={loading} class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
      {loading ? '正在添加...' : '添加记录'}
    </button>
  </form>

  <!-- Training History -->
  <div class="mt-8">
    <h3 class="text-xl font-bold mb-4">最近的训练历史</h3>
    {#if loading && logs.length === 0}
      <p>正在加载历史记录...</p>
    {:else if logs.length === 0}
      <p>没有找到训练记录。</p>
    {:else}
      <div class="space-y-2">
        {#each logs as log}
          <div class="p-3 bg-gray-100 rounded-md">
            <p class="font-semibold">
              {log.exercises.name}: {log.reps}次 @ {log.weight_kg}kg
            </p>
            <p class="text-sm text-gray-500">
              组号: {log.set_number} | {new Date(log.created_at).toLocaleString()}
            </p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div> 