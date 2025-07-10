<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { supabase } from '$lib/utils/supabaseClient';
	import { Plus, Trash2, Search, GripVertical, Filter } from 'lucide-svelte';
	import { notifications } from '$lib/stores/notifications';

	// 类型定义
	type Exercise = {
		exercise_id: string;
		exercises?: { 
			name: string;
			muscle_group?: string;
			equipment?: string;
			difficulty_level?: string;
		}; 
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

	type ExerciseOption = {
		id: string;
		name: string;
		muscle_group?: string;
		difficulty_level?: string;
		equipment?: string;
		type?: string;
	};

    export let plan: Plan | null = null; // 接受一个 plan 对象，如果为 null 则为新建模式

    const dispatch = createEventDispatcher();

    let formData: FormData;
    let exercises: Exercise[] = [];
    let allExercises: ExerciseOption[] = [];
    let filteredExercises: ExerciseOption[] = [];
    let isLoading = false;
    let exerciseSearchTerm = '';
    let selectedMuscleGroup = '';
    let selectedDifficulty = '';
    let selectedEquipment = '';
    let showExerciseFilters = false;

    // 从动作列表中提取筛选选项
    let muscleGroups: string[] = [];
    let difficulties: string[] = [];
    let equipments: string[] = [];

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

        // 获取所有可选的训练动作
        await loadExercises();
    });

    async function loadExercises() {
        const { data, error } = await supabase
            .from('exercises')
            .select('id, name, muscle_group, difficulty_level, equipment, type')
            .order('name');
            
        if (error) {
            console.error('获取动作列表失败:', error);
            notifications.error('加载失败', '获取动作列表失败，请刷新重试');
        } else {
            allExercises = data;
            filteredExercises = data;
            
            // 提取筛选选项
            muscleGroups = [...new Set(data.map(ex => ex.muscle_group).filter(Boolean))];
            difficulties = [...new Set(data.map(ex => ex.difficulty_level).filter(Boolean))];
            equipments = [...new Set(data.map(ex => ex.equipment).filter(Boolean))];
        }
    }

    // 动作筛选逻辑
    $: {
        let filtered = allExercises;

        // 搜索筛选
        if (exerciseSearchTerm) {
            const term = exerciseSearchTerm.toLowerCase();
            filtered = filtered.filter(ex => 
                ex.name.toLowerCase().includes(term) ||
                ex.muscle_group?.toLowerCase().includes(term) ||
                ex.equipment?.toLowerCase().includes(term)
            );
        }

        // 肌群筛选
        if (selectedMuscleGroup) {
            filtered = filtered.filter(ex => ex.muscle_group === selectedMuscleGroup);
        }

        // 难度筛选
        if (selectedDifficulty) {
            filtered = filtered.filter(ex => ex.difficulty_level === selectedDifficulty);
        }

        // 器材筛选
        if (selectedEquipment) {
            filtered = filtered.filter(ex => ex.equipment === selectedEquipment);
        }

        filteredExercises = filtered;
    }

    function resetForm() {
        formData = { id: null, name: '', description: '' };
        exercises = [];
        exerciseSearchTerm = '';
        selectedMuscleGroup = '';
        selectedDifficulty = '';
        selectedEquipment = '';
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
        // 重新排序
        exercises.forEach((ex, i) => {
            ex.exercise_order = i + 1;
        });
    }

    function moveExercise(fromIndex: number, toIndex: number) {
        if (toIndex < 0 || toIndex >= exercises.length) return;
        
        const newExercises = [...exercises];
        const [moved] = newExercises.splice(fromIndex, 1);
        newExercises.splice(toIndex, 0, moved);
        
        // 重新排序
        newExercises.forEach((ex, i) => {
            ex.exercise_order = i + 1;
        });
        
        exercises = newExercises;
    }

    function duplicateExercise(index: number) {
        const original = exercises[index];
        const duplicate = {
            ...original,
            exercise_order: exercises.length + 1
        };
        exercises = [...exercises, duplicate];
    }

    function onExerciseSelect(exerciseIndex: number, exerciseId: string) {
        const selectedExercise = allExercises.find(ex => ex.id === exerciseId);
        if (selectedExercise) {
            exercises[exerciseIndex].exercise_id = exerciseId;
            exercises[exerciseIndex].exercises = {
                name: selectedExercise.name,
                muscle_group: selectedExercise.muscle_group,
                equipment: selectedExercise.equipment,
                difficulty_level: selectedExercise.difficulty_level
            };
        }
    }

    function clearFilters() {
        exerciseSearchTerm = '';
        selectedMuscleGroup = '';
        selectedDifficulty = '';
        selectedEquipment = '';
    }

    async function handleSubmit() {
        isLoading = true;

        // 验证基本信息
        if (!formData.name.trim()) {
            notifications.error('验证失败', '请输入计划名称');
            isLoading = false;
            return;
        }

        // 验证是否有动作被选择
        const validExercises = exercises.filter(ex => ex.exercise_id);
        if (validExercises.length === 0) {
            notifications.error('验证失败', '请至少添加一个训练动作');
            isLoading = false;
            return;
        }

        // 验证动作配置
        for (let i = 0; i < validExercises.length; i++) {
            const ex = validExercises[i];
            if (ex.target_sets < 1 || ex.target_reps < 1) {
                notifications.error('验证失败', `第 ${i + 1} 个动作的组数和次数必须大于0`);
                isLoading = false;
                return;
            }
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

        try {
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
                            notifications.warning('版本快照创建失败', versionError.message);
                            notifications.success('计划保存成功', '训练计划已成功更新');
                    } else {
                        console.log(`成功创建计划版本快照，版本号: ${versionData}`);
                            notifications.success('计划保存成功', `已创建版本快照 v${versionData}`);
                    }
                } catch (versionError) {
                    console.error('版本管理操作异常:', versionError);
                    // 同样，这不应阻止主流程
                }
                } else {
                    notifications.success('计划创建成功', '新的训练计划已创建');
            }
            
                // 立即关闭模态框
            dispatch('save', savedPlan);
            close();
        } else {
            const result = await response.json();
                notifications.error('保存失败', result.error || '请重试');
            }
        } catch (error) {
            console.error('保存计划时发生错误:', error);
            notifications.error('网络错误', '请检查连接后重试');
        }

        isLoading = false;
    }

    function close() {
        dispatch('close');
    }
</script>

<div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        <div class="p-6 border-b">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                {plan ? '编辑' : '新建'}训练计划
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {plan ? '修改计划详情和包含的训练动作' : '创建一个新的训练计划'}
            </p>
        </div>

        <form on:submit|preventDefault={handleSubmit} class="flex-1 overflow-hidden flex flex-col">
            <div class="p-6 overflow-y-auto flex-1">
                <!-- 基本信息 -->
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label for="plan-name" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            计划名称 <span class="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="plan-name" 
                            bind:value={formData.name} 
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                            placeholder="例如：增肌训练计划"
                            required
                        >
                    </div>
                    <div>
                        <label for="plan-description" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            计划描述
                        </label>
                        <textarea 
                            id="plan-description" 
                            bind:value={formData.description} 
                            rows="4" 
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="描述这个训练计划的目标和特点..."
                        ></textarea>
                    </div>
                </div>

                <!-- 训练动作部分 -->
                <div class="border-t pt-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                            训练动作 ({exercises.length})
                        </h3>
                        <button 
                            type="button" 
                            on:click={addExercise} 
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus class="w-4 h-4 mr-2" />
                            添加动作
                        </button>
                    </div>

                    <!-- 动作筛选工具栏 -->
                    {#if exercises.length > 0}
                        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
                            <div class="flex flex-col md:flex-row gap-4">
                                <!-- 搜索框 -->
                                <div class="flex-1 relative">
                                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="搜索动作..."
                                        bind:value={exerciseSearchTerm}
                                        class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
            </div>

                                <!-- 筛选按钮 -->
                                <button
                                    type="button"
                                    on:click={() => showExerciseFilters = !showExerciseFilters}
                                    class="inline-flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
                                >
                                    <Filter class="w-4 h-4 mr-2" />
                                    筛选
                                </button>
            </div>

                            <!-- 展开的筛选选项 -->
                            {#if showExerciseFilters}
                                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div class="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                肌群
                                            </label>
                                            <select 
                                                bind:value={selectedMuscleGroup}
                                                class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">全部肌群</option>
                                                {#each muscleGroups as group}
                                                    <option value={group}>{group}</option>
                                                {/each}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                难度
                                            </label>
                                            <select 
                                                bind:value={selectedDifficulty}
                                                class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">全部难度</option>
                                                {#each difficulties as difficulty}
                                                    <option value={difficulty}>{difficulty}</option>
                                                {/each}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                器材
                                            </label>
                                            <select 
                                                bind:value={selectedEquipment}
                                                class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="">全部器材</option>
                                                {#each equipments as equipment}
                                                    <option value={equipment}>{equipment}</option>
                                                {/each}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <button
                                            type="button"
                                            on:click={clearFilters}
                                            class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        >
                                            清除所有筛选
                                        </button>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/if}

                    <!-- 动作列表 -->
                <div class="space-y-4">
                    {#each exercises as ex, index (index)}
                            <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div class="grid grid-cols-12 gap-4 items-start">
                                    <!-- 拖拽句柄和序号 -->
                                    <div class="col-span-1 flex flex-col items-center">
                                        <button
                                            type="button"
                                            class="text-gray-400 hover:text-gray-600 p-1 cursor-move"
                                            title="拖拽排序"
                                        >
                                            <GripVertical class="w-4 h-4" />
                                        </button>
                                        <span class="text-xs text-gray-500 mt-1">{index + 1}</span>
                                    </div>

                            <!-- 动作选择 -->
                                    <div class="col-span-11 md:col-span-4">
                                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            动作名称 <span class="text-red-500">*</span>
                                        </label>
                                        <select 
                                            bind:value={ex.exercise_id}
                                            on:change={(e) => onExerciseSelect(index, e.currentTarget.value)}
                                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                                            required
                                        >
                                    <option value="" disabled>选择一个动作</option>
                                            {#each filteredExercises as exercise}
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
                                        {#if ex.exercises?.muscle_group}
                                            <div class="flex gap-1 mt-1">
                                                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-300">
                                                    {ex.exercises.muscle_group}
                                                </span>
                                                {#if ex.exercises.difficulty_level}
                                                    <span class="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded dark:bg-orange-900 dark:text-orange-300">
                                                        {ex.exercises.difficulty_level}
                                                    </span>
                                                {/if}
                                            </div>
                                        {/if}
                            </div>

                                    <!-- 组数 -->
                            <div class="col-span-6 md:col-span-2">
                                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            组数
                                        </label>
                                        <input 
                                            type="number" 
                                            bind:value={ex.target_sets} 
                                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                                            min="1" 
                                            max="20"
                                        >
                            </div>

                                    <!-- 次数 -->
                            <div class="col-span-6 md:col-span-2">
                                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            次数/时间
                                        </label>
                                        <input 
                                            type="number" 
                                            bind:value={ex.target_reps} 
                                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                                            min="1"
                                        >
                            </div>

                             <!-- 重量 -->
                            <div class="col-span-6 md:col-span-2">
                                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            重量(kg)
                                        </label>
                                        <input 
                                            type="number" 
                                            bind:value={ex.target_weight_kg} 
                                            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                                            min="0" 
                                            step="0.5"
                                            placeholder="可选"
                                        >
                                    </div>

                                    <!-- 操作按钮 -->
                                    <div class="col-span-6 md:col-span-1 flex flex-col gap-1">
                                        <button 
                                            type="button" 
                                            on:click={() => duplicateExercise(index)} 
                                            class="text-blue-500 hover:text-blue-700 p-1 text-xs"
                                            title="复制动作"
                                        >
                                            复制
                                        </button>
                                        <button 
                                            type="button" 
                                            on:click={() => removeExercise(index)} 
                                            class="text-red-500 hover:text-red-700 p-1"
                                            title="删除动作"
                                        >
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <!-- 备注 -->
                                <div class="mt-3">
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        备注
                                    </label>
                                    <input 
                                        type="text" 
                                        bind:value={ex.notes} 
                                        class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm" 
                                        placeholder="可选：动作要点、注意事项等"
                                    >
                            </div>

                                <!-- 排序按钮 -->
                                <div class="mt-2 flex gap-2">
                                    <button
                                        type="button"
                                        on:click={() => moveExercise(index, index - 1)}
                                        disabled={index === 0}
                                        class="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
                                    >
                                        上移
                                    </button>
                                    <button
                                        type="button"
                                        on:click={() => moveExercise(index, index + 1)}
                                        disabled={index === exercises.length - 1}
                                        class="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
                                    >
                                        下移
								</button>
							</div>
                        </div>
                    {/each}

                        {#if exercises.length === 0}
                            <div class="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <h4 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    暂无训练动作
                                </h4>
                                <p class="text-gray-500 dark:text-gray-400 mb-4">
                                    点击"添加动作"按钮开始构建你的训练计划
                                </p>
                                <button 
                                    type="button" 
                                    on:click={addExercise} 
                                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Plus class="w-4 h-4 mr-2" />
                                    添加第一个动作
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>


            </div>

            <!-- 底部按钮 -->
            <div class="p-6 border-t flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    {#if exercises.length > 0}
                        已添加 {exercises.length} 个动作
                    {:else}
                        请至少添加一个训练动作
            {/if}
                </div>
                <div class="flex space-x-4">
                    <button 
                        type="button" 
                        on:click={close} 
                        class="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-colors" 
                        disabled={isLoading}
                    >
                取消
            </button>
                    <button 
                        type="submit" 
                        class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center" 
                        disabled={isLoading}
                    >
                        {#if isLoading}
                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {/if}
                        {isLoading ? '保存中...' : '保存计划'}
            </button>
        </div>
            </div>
        </form>
    </div>
</div> 