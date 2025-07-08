<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Filter, Search, Eye, Plus } from 'lucide-svelte';
	import type { Exercise, ExerciseFilterOptions } from '$lib/types/index.js';

	// 响应式数据
	let exercises: Exercise[] = [];
	let filterOptions: ExerciseFilterOptions = {
		muscle_groups: [],
		equipment: [],
		difficulty_levels: [],
		types: []
	};
	let isLoading = false;
	let error = '';
	let total = 0;
	let currentFilters = {
		muscle_group: '',
		equipment: '',
		difficulty_level: '',
		type: '',
		search: ''
	};
	let showFilters = false;
	let selectedExercise: Exercise | null = null;

	// 分页参数
	let limit = 24;
	let offset = 0;

	/**
	 * 从API获取动作列表
	 */
	async function fetchExercises() {
		isLoading = true;
		error = '';
		console.log('开始获取动作列表...');

		try {
			// 构建查询参数
			const params = new URLSearchParams();
			if (currentFilters.muscle_group) params.set('muscle_group', currentFilters.muscle_group);
			if (currentFilters.equipment) params.set('equipment', currentFilters.equipment);
			if (currentFilters.difficulty_level) params.set('difficulty_level', currentFilters.difficulty_level);
			if (currentFilters.type) params.set('type', currentFilters.type);
			params.set('limit', limit.toString());
			params.set('offset', offset.toString());
			
			console.log(`正在请求 API: /api/exercises?${params.toString()}`);
			const response = await fetch(`/api/exercises?${params.toString()}`);
			const data = await response.json();

			if (response.ok) {
				console.log('API 请求成功，接收到数据:', data);
				exercises = data.exercises || [];
				total = data.total || 0;
				filterOptions = data.filterOptions || filterOptions;
			} else {
				console.error('API 请求失败:', data.error);
				error = data.error || '获取动作列表失败';
			}
		} catch (err) {
			console.error('获取动作列表时发生严重错误:', err);
			error = '网络错误，请重试';
		} finally {
			isLoading = false;
			console.log('获取流程结束，isLoading 设置为 false');
		}
	}

	/**
	 * 应用筛选器
	 */
	function applyFilters() {
		offset = 0; // 重置分页
		fetchExercises();
		// 更新URL参数（可选）
		updateURL();
	}

	/**
	 * 清除所有筛选器
	 */
	function clearFilters() {
		currentFilters = {
			muscle_group: '',
			equipment: '',
			difficulty_level: '',
			type: '',
			search: ''
		};
		applyFilters();
	}

	/**
	 * 更新URL参数
	 */
	function updateURL() {
		const params = new URLSearchParams();
		Object.entries(currentFilters).forEach(([key, value]) => {
			if (value) params.set(key, value);
		});
		goto(`?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	/**
	 * 从URL恢复筛选参数
	 */
	function restoreFiltersFromURL() {
		const params = $page.url.searchParams;
		currentFilters.muscle_group = params.get('muscle_group') || '';
		currentFilters.equipment = params.get('equipment') || '';
		currentFilters.difficulty_level = params.get('difficulty_level') || '';
		currentFilters.type = params.get('type') || '';
		currentFilters.search = params.get('search') || '';
	}

	/**
	 * 搜索动作（前端搜索）
	 */
	function searchExercises() {
		if (!currentFilters.search) {
			applyFilters();
			return;
		}
		
		// 简单的前端搜索
		const searchTerm = currentFilters.search.toLowerCase();
		exercises = exercises.filter(ex => 
			ex.name.toLowerCase().includes(searchTerm) ||
			ex.description?.toLowerCase().includes(searchTerm) ||
			ex.muscle_group.toLowerCase().includes(searchTerm)
		);
	}

	/**
	 * 查看动作详情
	 */
	function viewExerciseDetail(exercise: Exercise) {
		selectedExercise = exercise;
	}

	/**
	 * 关闭动作详情模态框
	 */
	function closeExerciseDetail() {
		selectedExercise = null;
	}

	/**
	 * 获取难度等级的颜色
	 */
	function getDifficultyColor(level: string): string {
		switch (level) {
			case '初级': return 'bg-green-100 text-green-800';
			case '中级': return 'bg-yellow-100 text-yellow-800';
			case '高级': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	/**
	 * 获取动作类型的颜色
	 */
	function getTypeColor(type: string): string {
		switch (type) {
			case 'strength': return 'bg-blue-100 text-blue-800';
			case 'cardio': return 'bg-red-100 text-red-800';
			case 'flexibility': return 'bg-purple-100 text-purple-800';
			case 'plyometric': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	// 组件挂载时执行
	onMount(() => {
		restoreFiltersFromURL();
		fetchExercises();
	});
</script>

<div class="container mx-auto p-4 md:p-8">
	<!-- 页面标题和筛选按钮 -->
	<div class="flex justify-between items-center mb-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">动作库</h1>
			<p class="text-gray-600 dark:text-gray-400">
				{total > 0 ? `共 ${total} 个动作` : '正在加载...'}
			</p>
		</div>
		<div class="flex space-x-2">
			<button
				on:click={() => showFilters = !showFilters}
				class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
			>
				<Filter class="w-5 h-5 mr-2" />
				筛选
			</button>
			<!-- 预留：用户自定义动作按钮 -->
			<button
				class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 opacity-50 cursor-not-allowed"
				disabled
				title="即将推出"
			>
				<Plus class="w-5 h-5 mr-2" />
				自定义动作
			</button>
		</div>
	</div>

	<!-- 筛选器面板 -->
	{#if showFilters}
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<!-- 肌群筛选 -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						目标肌群
					</label>
					<select 
						bind:value={currentFilters.muscle_group}
						class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
					>
						<option value="">全部肌群</option>
						{#each filterOptions.muscle_groups as group}
							<option value={group}>{group}</option>
						{/each}
					</select>
				</div>

				<!-- 器械筛选 -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						所需器械
					</label>
					<select 
						bind:value={currentFilters.equipment}
						class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
					>
						<option value="">全部器械</option>
						{#each filterOptions.equipment as eq}
							<option value={eq}>{eq}</option>
						{/each}
					</select>
				</div>

				<!-- 难度等级筛选 -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						难度等级
					</label>
					<select 
						bind:value={currentFilters.difficulty_level}
						class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
					>
						<option value="">全部难度</option>
						{#each filterOptions.difficulty_levels as level}
							<option value={level}>{level}</option>
						{/each}
					</select>
				</div>

				<!-- 动作类型筛选 -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						动作类型
					</label>
					<select 
						bind:value={currentFilters.type}
						class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
					>
						<option value="">全部类型</option>
						{#each filterOptions.types as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- 搜索框 -->
			<div class="mb-4">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="搜索动作名称或描述..."
						bind:value={currentFilters.search}
						on:input={searchExercises}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>

			<!-- 筛选操作按钮 -->
			<div class="flex space-x-3">
				<button
					on:click={applyFilters}
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					应用筛选
				</button>
				<button
					on:click={clearFilters}
					class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
				>
					清除筛选
				</button>
			</div>
		</div>
	{/if}

	<!-- 加载状态 -->
	{#if isLoading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{/if}

	<!-- 错误提示 -->
	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
			{error}
		</div>
	{/if}

	<!-- 动作列表 -->
	{#if !isLoading && exercises.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each exercises as exercise (exercise.id)}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
					<!-- 动作图片或占位符 -->
					<div class="h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
						{#if exercise.image_url}
							<img src={exercise.image_url} alt={exercise.name} class="w-full h-full object-cover" />
						{:else if exercise.video_url}
							<div class="text-blue-600 dark:text-blue-400">
								<svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
									<path d="M8 5v10l7-5-7-5z"/>
								</svg>
							</div>
						{:else}
							<div class="text-gray-400 text-6xl">💪</div>
						{/if}
					</div>

					<!-- 动作信息 -->
					<div class="p-4">
						<h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">{exercise.name}</h3>
						
						<!-- 标签 -->
						<div class="flex flex-wrap gap-2 mb-3">
							<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
								{exercise.muscle_group}
							</span>
							{#if exercise.difficulty_level}
								<span class="px-2 py-1 text-xs rounded-full {getDifficultyColor(exercise.difficulty_level)}">
									{exercise.difficulty_level}
								</span>
							{/if}
							{#if exercise.type}
								<span class="px-2 py-1 text-xs rounded-full {getTypeColor(exercise.type)}">
									{exercise.type}
								</span>
							{/if}
						</div>

						<!-- 描述 -->
						{#if exercise.description}
							<p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
								{exercise.description}
							</p>
						{/if}

						<!-- 器械信息 -->
						{#if exercise.equipment}
							<p class="text-gray-500 dark:text-gray-500 text-xs mb-3">
								器械: {exercise.equipment}
							</p>
						{/if}

						<!-- 查看详情按钮 -->
						<button
							on:click={() => viewExerciseDetail(exercise)}
							class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
						>
							<Eye class="w-4 h-4 mr-2" />
							查看详情
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else if !isLoading}
		<div class="text-center py-12">
			<div class="text-gray-400 text-6xl mb-4">🔍</div>
			<h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">没有找到动作</h3>
			<p class="text-gray-500">尝试调整筛选条件或清除筛选器</p>
		</div>
	{/if}
</div>

<!-- 动作详情模态框 -->
{#if selectedExercise}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" on:click={closeExerciseDetail}>
		<div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
			<div class="p-6">
				<div class="flex justify-between items-start mb-4">
					<h2 class="text-2xl font-bold text-gray-800 dark:text-white">{selectedExercise.name}</h2>
					<button
						on:click={closeExerciseDetail}
						class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- 动作标签 -->
				<div class="flex flex-wrap gap-2 mb-4">
					<span class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
						{selectedExercise.muscle_group}
					</span>
					{#if selectedExercise.difficulty_level}
						<span class="px-3 py-1 text-sm rounded-full {getDifficultyColor(selectedExercise.difficulty_level)}">
							{selectedExercise.difficulty_level}
						</span>
					{/if}
					{#if selectedExercise.type}
						<span class="px-3 py-1 text-sm rounded-full {getTypeColor(selectedExercise.type)}">
							{selectedExercise.type}
						</span>
					{/if}
					{#if selectedExercise.equipment}
						<span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
							器械: {selectedExercise.equipment}
						</span>
					{/if}
				</div>

				<!-- 动作描述 -->
				{#if selectedExercise.description}
					<div class="mb-4">
						<h3 class="text-lg font-semibold mb-2">动作描述</h3>
						<p class="text-gray-600 dark:text-gray-400">{selectedExercise.description}</p>
					</div>
				{/if}

				<!-- 动作指导 -->
				{#if selectedExercise.instructions}
					<div class="mb-4">
						<h3 class="text-lg font-semibold mb-2">动作指导</h3>
						<div class="text-gray-600 dark:text-gray-400 whitespace-pre-line">{selectedExercise.instructions}</div>
					</div>
				{/if}

				<!-- 训练提示 -->
				{#if selectedExercise.tips}
					<div class="mb-4">
						<h3 class="text-lg font-semibold mb-2">训练提示</h3>
						<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
							<p class="text-yellow-800 dark:text-yellow-200">{selectedExercise.tips}</p>
						</div>
					</div>
				{/if}

				<!-- 视频链接 -->
				{#if selectedExercise.video_url}
					<div class="mb-4">
						<h3 class="text-lg font-semibold mb-2">演示视频</h3>
						<a 
							href={selectedExercise.video_url} 
							target="_blank" 
							rel="noopener noreferrer"
							class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path d="M8 5v10l7-5-7-5z"/>
							</svg>
							观看演示
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style> 