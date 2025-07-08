<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { supabase } from '$lib/utils/supabaseClient';
	import { Plus, Trash2 } from 'lucide-svelte';

	// 类型定义
	type Exercise = {
		exercise_id: string;
		exercises?: { name: string }; // 'exercises' is optional as it's for display
		target_sets: number;
		target_reps: number;
		target_weight_kg: number;
		notes: string;
		exercise_order: number;
		day_of_week: number;
	};

	type Plan = {
		id: string;
		name: string;
		description: string;
		plan_exercises: Exercise[];
	};

	type FormData = {
		id: string | null;
		name: string;
		description: string;
	};

    export let plan: Plan | null = null; // 接受一个 plan 对象，如果为 null 则为新建模式

    const dispatch = createEventDispatcher();

    let formData: FormData;
    let exercises: Exercise[] = [];
    let allExercises: {id: string, name: string, muscle_group?: string, difficulty_level?: string, type?: string}[] = [];
    let isLoading = false;
    let errorMessage = '';

    onMount(async () => {
        // 初始化表单数据
        if (plan) {
            formData = {
                id: plan.id,
                name: plan.name,
                description: plan.description
            };
            // 深拷贝，避免直接修改 prop
            exercises = JSON.parse(JSON.stringify(plan.plan_exercises || []));
        } else {
            resetForm();
        }

        // 获取所有可选的训练动作，包含新增字段
        const { data, error } = await supabase.from('exercises').select('id, name, muscle_group, difficulty_level, type');
        if (error) {
            console.error('获取动作列表失败:', error);
        } else {
            allExercises = data;
        }
    });

    function resetForm() {
        formData = { id: null, name: '', description: '' };
        exercises = [];
    }

    function addExercise() {
        exercises = [
            ...exercises,
            {
                exercise_id: '',
				exercises: { name: '请选择动作' }, // 用于显示
                target_sets: 3,
                target_reps: 12,
                target_weight_kg: 0,
                notes: '',
				exercise_order: exercises.length + 1,
				day_of_week: 1, // 简化处理，所有动作都在第一天
            }
        ];
    }

    function removeExercise(index: number) {
        exercises = exercises.filter((_, i) => i !== index);
    }

    async function handleSubmit() {
        isLoading = true;
        errorMessage = '';

        // 验证是否有动作被选择
        const validExercises = exercises.filter(ex => ex.exercise_id);
        if (validExercises.length === 0) {
            errorMessage = '请至少添加一个训练动作';
            isLoading = false;
            return;
        }

        const planData = {
            ...formData,
            exercises: validExercises.map((ex, index) => ({
                exercise_id: ex.exercise_id,
                target_sets: ex.target_sets,
                target_reps: ex.target_reps,
                target_weight_kg: ex.target_weight_kg || null,
                notes: ex.notes,
				exercise_order: index + 1,
				day_of_week: ex.day_of_week || 1
            }))
        };

        let response;
        if (planData.id) {
            // 更新现有计划
            response = await fetch(`/api/plans/${planData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData)
            });
        } else {
            // 创建新计划
            response = await fetch('/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData)
            });
        }

        if (response.ok) {
            const savedPlan = await response.json();
            
            // 【版本管理功能集成】如果是更新操作，创建版本快照
            if (planData.id) {
                try {
                    // 构造计划内容的 JSON 快照
                    const planContent = {
                        plan_name: savedPlan.name,
                        plan_description: savedPlan.description,
                        exercises: validExercises.map((ex, index) => ({
                            exercise_id: parseInt(ex.exercise_id),
                            target_sets: ex.target_sets,
                            target_reps: ex.target_reps,
                            target_weight_kg: ex.target_weight_kg || null,
                            notes: ex.notes || '',
                            exercise_order: index + 1,
                            day_of_week: ex.day_of_week || 1
                        })),
                        snapshot_created_at: new Date().toISOString(),
                        snapshot_type: 'manual_save'
                    };

                    // 调用 create_plan_version RPC 函数创建版本快照
                    const { data: versionData, error: versionError } = await supabase.rpc('create_plan_version', {
                        p_plan_id: parseInt(planData.id),
                        p_content: planContent
                    });

                    if (versionError) {
                        console.error('创建计划版本快照失败:', versionError);
                        // 版本创建失败不应阻止主要保存流程，但应给用户提示
                        errorMessage = `计划保存成功，但版本快照创建失败: ${versionError.message}`;
                    } else {
                        console.log(`成功创建计划版本快照，版本号: ${versionData}`);
                    }
                } catch (versionError) {
                    console.error('版本管理操作异常:', versionError);
                    // 同样，这不应阻止主流程
                }
            }
            
            dispatch('save', savedPlan);
            close();
        } else {
            const result = await response.json();
            errorMessage = result.error || '保存失败，请重试。';
        }

        isLoading = false;
    }

    function close() {
        dispatch('close');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="p-6 border-b">
            <h2 class="text-xl font-bold">{plan ? '编辑' : '新建'}训练计划</h2>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="p-6 overflow-y-auto">
            <div class="mb-4">
                <label for="plan-name" class="block text-sm font-medium mb-1">计划名称</label>
                <input type="text" id="plan-name" bind:value={formData.name} class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required>
            </div>
            <div class="mb-6">
                <label for="plan-description" class="block text-sm font-medium mb-1">计划描述</label>
                <textarea id="plan-description" bind:value={formData.description} rows="3" class="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>

            <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">训练动作</h3>
                <div class="space-y-4">
                    {#each exercises as ex, index (index)}
                        <div class="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                            <!-- 动作选择 -->
                            <div class="col-span-12 md:col-span-4">
                                <select bind:value={ex.exercise_id} class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500" required>
                                    <option value="" disabled>选择一个动作</option>
                                    {#each allExercises as exercise}
                                        <option value={exercise.id}>
                                            {exercise.name}
                                            {#if exercise.muscle_group}
                                                - {exercise.muscle_group}
                                            {/if}
                                            {#if exercise.difficulty_level}
                                                ({exercise.difficulty_level})
                                            {/if}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                            <!-- 组/次 -->
                            <div class="col-span-6 md:col-span-2">
                                <input type="number" placeholder="组" bind:value={ex.target_sets} class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500" min="1">
                            </div>
                            <div class="col-span-6 md:col-span-2">
                                <input type="number" placeholder="次" bind:value={ex.target_reps} class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500" min="1">
                            </div>
                             <!-- 重量 -->
                            <div class="col-span-6 md:col-span-2">
                                <input type="number" placeholder="重量(kg)" bind:value={ex.target_weight_kg} class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500" min="0">
                            </div>
                            <!-- 删除按钮 -->
							<div class="col-span-6 md:col-span-2 flex justify-end">
								<button type="button" on:click={() => removeExercise(index)} class="text-red-500 hover:text-red-700 p-2">
									<Trash2 class="w-5 h-5" />
								</button>
							</div>
                        </div>
                    {/each}
                </div>
                <button type="button" on:click={addExercise} class="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700">
                    <Plus class="w-4 h-4 mr-2" />
                    添加动作
                </button>
            </div>
             {#if errorMessage}
                <p class="text-red-500 text-sm mb-4">{errorMessage}</p>
            {/if}
        </form>

        <div class="p-6 border-t flex justify-end space-x-4">
            <button type="button" on:click={close} class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500" disabled={isLoading}>
                取消
            </button>
            <button type="submit" on:click={handleSubmit} class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400" disabled={isLoading}>
                {isLoading ? '保存中...' : '保存'}
            </button>
        </div>
    </div>
</div> 