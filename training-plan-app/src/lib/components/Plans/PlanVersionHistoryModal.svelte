<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { supabase } from '$lib/utils/supabaseClient';
	import { History, RotateCcw, X, Calendar, Hash, GitCompare } from 'lucide-svelte';

	// 类型定义
	type PlanVersion = {
		id: number;
		version_number: number;
		created_at: string;
	};

	// Props
	export let planId: string | number;
	export let planName: string = '';

	// 事件派发
	const dispatch = createEventDispatcher();

	// 组件状态
	let versions: PlanVersion[] = [];
	let isLoading = true;
	let isReverting = false;
	let errorMessage = '';
	let selectedVersionForCompare: number | null = null;
	let compareMode = false;

	/**
	 * 格式化日期显示
	 */
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	/**
	 * 获取版本历史列表
	 */
	async function loadVersionHistory() {
		isLoading = true;
		errorMessage = '';

		try {
			const response = await fetch(`/api/plans/${planId}/versions`);
			
			if (response.ok) {
				versions = await response.json();
			} else {
				const result = await response.json();
				errorMessage = result.error || '获取版本历史失败';
			}
		} catch (error) {
			console.error('加载版本历史时发生错误:', error);
			errorMessage = '网络错误，请稍后重试';
		} finally {
			isLoading = false;
		}
	}

	/**
	 * 查看特定版本的详情
	 */
	async function viewVersionDetails(versionNumber: number) {
		try {
			const response = await fetch(`/api/plans/${planId}/versions/${versionNumber}`);
			
			if (response.ok) {
				const versionContent = await response.json();
				// 派发事件，让父组件处理版本详情展示
				dispatch('viewVersion', {
					versionNumber,
					content: versionContent
				});
			} else {
				const result = await response.json();
				errorMessage = result.error || '获取版本详情失败';
			}
		} catch (error) {
			console.error('查看版本详情时发生错误:', error);
			errorMessage = '网络错误，请稍后重试';
		}
	}

	/**
	 * 恢复到指定版本
	 */
	async function revertToVersion(versionNumber: number) {
		if (!confirm(`确定要将计划恢复到版本 ${versionNumber} 吗？\n\n这将会：\n1. 备份当前版本\n2. 将计划内容恢复到版本 ${versionNumber}\n3. 创建新的版本记录\n\n此操作不可撤销。`)) {
			return;
		}

		isReverting = true;
		errorMessage = '';

		try {
			const { data, error } = await supabase.rpc('revert_to_plan_version', {
				p_plan_id: parseInt(planId.toString()),
				p_target_version_number: versionNumber
			});

			if (error) {
				throw error;
			}

			// 恢复成功，重新加载版本历史
			await loadVersionHistory();
			
			// 派发成功事件
			dispatch('revertSuccess', {
				message: `成功恢复到版本 ${versionNumber}`,
				newVersionNumber: data.new_version_number
			});

		} catch (error) {
			console.error('恢复版本时发生错误:', error);
			errorMessage = `恢复版本失败: ${error instanceof Error ? error.message : '未知错误'}`;
		} finally {
			isReverting = false;
		}
	}

	/**
	 * 开始对比模式
	 */
	function startCompareMode() {
		compareMode = true;
		selectedVersionForCompare = null;
	}

	/**
	 * 取消对比模式
	 */
	function cancelCompareMode() {
		compareMode = false;
		selectedVersionForCompare = null;
	}

	/**
	 * 选择版本进行对比
	 */
	function selectVersionForCompare(versionNumber: number) {
		if (!compareMode) return;
		
		if (selectedVersionForCompare === null) {
			selectedVersionForCompare = versionNumber;
		} else {
			// 已经选择了一个版本，现在选择第二个版本进行对比
			dispatch('compare', {
				version1: selectedVersionForCompare,
				version2: versionNumber
			});
			cancelCompareMode();
		}
	}

	/**
	 * 关闭模态框
	 */
	function close() {
		dispatch('close');
	}

	// 组件挂载时加载版本历史
	onMount(() => {
		loadVersionHistory();
	});
</script>

<!-- 模态框遮罩 -->
<div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
		
		<!-- 标题栏 -->
		<div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
			<div class="flex items-center space-x-3">
				<History class="w-6 h-6 text-blue-600" />
				<div>
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">版本历史</h2>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						{planName || `计划 #${planId}`}
					</p>
				</div>
			</div>
			<button
				on:click={close}
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
			>
				<X class="w-5 h-5" />
			</button>
		</div>

		<!-- 内容区域 -->
		<div class="flex-1 overflow-y-auto p-6">
			{#if errorMessage}
				<div class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
					<p class="text-red-800 dark:text-red-200 text-sm">{errorMessage}</p>
				</div>
			{/if}

			<!-- 对比模式提示 -->
			{#if compareMode}
				<div class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
					<div class="flex justify-between items-center">
						<div>
							<p class="text-blue-800 dark:text-blue-200 font-medium">对比模式</p>
							<p class="text-blue-600 dark:text-blue-300 text-sm">
								{#if selectedVersionForCompare === null}
									请选择第一个要对比的版本
								{:else}
									已选择版本 {selectedVersionForCompare}，请选择第二个版本进行对比
								{/if}
							</p>
						</div>
						<button
							on:click={cancelCompareMode}
							class="px-3 py-1.5 text-sm bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
						>
							取消对比
						</button>
					</div>
				</div>
			{/if}

			{#if isLoading}
				<div class="flex justify-center items-center py-12">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<span class="ml-3 text-gray-600 dark:text-gray-300">加载版本历史...</span>
				</div>
			{:else if versions.length === 0}
				<div class="text-center py-12">
					<History class="mx-auto h-12 w-12 text-gray-400" />
					<h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">暂无版本历史</h3>
					<p class="mt-1 text-gray-500 dark:text-gray-400">
						此计划还没有保存过任何版本。
					</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each versions as version (version.id)}
						<div 
							class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 transition-colors cursor-pointer
								{compareMode ? 'hover:bg-blue-100 dark:hover:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
								{compareMode && selectedVersionForCompare === version.version_number ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700' : ''}"
							on:click={() => compareMode ? selectVersionForCompare(version.version_number) : null}
						>
							<div class="flex justify-between items-start">
								<!-- 版本信息 -->
								<div class="flex-1">
									<div class="flex items-center space-x-3 mb-2">
										<div class="flex items-center space-x-2">
											<Hash class="w-4 h-4 text-blue-600" />
											<span class="font-semibold text-lg text-gray-800 dark:text-white">
												版本 {version.version_number}
											</span>
										</div>
										{#if version.version_number === Math.max(...versions.map(v => v.version_number))}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
												最新版本
											</span>
										{/if}
										{#if compareMode && selectedVersionForCompare === version.version_number}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
												已选择
											</span>
										{/if}
									</div>
									<div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
										<Calendar class="w-4 h-4" />
										<span>{formatDate(version.created_at)}</span>
									</div>
								</div>

								<!-- 操作按钮 -->
								{#if !compareMode}
									<div class="flex space-x-2">
										<button
											on:click={() => viewVersionDetails(version.version_number)}
											class="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
										>
											查看详情
										</button>
										{#if version.version_number !== Math.max(...versions.map(v => v.version_number))}
											<button
												on:click={() => revertToVersion(version.version_number)}
												disabled={isReverting}
												class="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
											>
												<RotateCcw class="w-3 h-3" />
												<span>{isReverting ? '恢复中...' : '恢复'}</span>
											</button>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- 底部操作栏 -->
		<div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
			<div>
				{#if !compareMode && versions.length >= 2}
					<button
						on:click={startCompareMode}
						class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
					>
						<GitCompare class="w-4 h-4" />
						<span>开始对比</span>
					</button>
				{/if}
			</div>
			<button
				on:click={close}
				class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
			>
				关闭
			</button>
		</div>
	</div>
</div> 