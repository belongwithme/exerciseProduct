<script lang="ts">
	import type { PageData } from './$types';
	import jsPDF from 'jspdf';
	import html2canvas from 'html2canvas';

	export let data: PageData;
	$: plans = data.plans;

	let showNotification = false;
	let notificationMessage = '';
	let isExporting = false;

	async function exportToPdf(plan: any) {
		if (isExporting) return;
		isExporting = true;
		notificationMessage = `正在导出计划: ${plan.name}...`;
		showNotification = true;

		try {
			// 创建一个用于打印的临时HTML元素
			const printableElement = document.createElement('div');
			printableElement.style.position = 'absolute';
			printableElement.style.left = '-9999px';
			printableElement.style.width = '800px';
			printableElement.style.padding = '40px';
			printableElement.style.backgroundColor = 'white';
			printableElement.style.fontFamily = 'sans-serif';

			// 构建HTML内容
			let html = `
				<div style="text-align: center; margin-bottom: 40px;">
					<h1 style="font-size: 28px; font-weight: bold; margin-bottom: 16px; color: #1a202c;">
						${plan.name}
					</h1>
					<p style="font-size: 16px; color: #4a5568; margin-bottom: 8px;">
						${plan.description || '个人定制训练计划'}
					</p>
					<p style="font-size: 14px; color: #718096;">
						生成日期：${new Date().toLocaleDateString('zh-CN')}
					</p>
				</div>
			`;

			// 按照训练日分组
			const exercisesByDay: { [key: number]: any[] } = {};
			if (plan.plan_exercises && plan.plan_exercises.length > 0) {
				plan.plan_exercises.forEach((ex: any) => {
					const day = ex.day_of_week || 1;
					if (!exercisesByDay[day]) {
						exercisesByDay[day] = [];
					}
					exercisesByDay[day].push(ex);
				});

				// 为每个训练日生成内容
				for (const [day, exercises] of Object.entries(exercisesByDay)) {
					html += `
						<div style="margin-top: 32px; page-break-inside: avoid;">
							<h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
								训练日 ${day}
							</h2>
							<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
								<thead>
									<tr style="background-color: #f7fafc;">
										<th style="text-align: left; padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">动作名称</th>
										<th style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">组数</th>
										<th style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">次数</th>
										<th style="text-align: center; padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">重量(kg)</th>
										<th style="text-align: left; padding: 12px; border: 1px solid #e2e8f0; font-weight: 600;">备注</th>
									</tr>
								</thead>
								<tbody>
					`;

					exercises.sort((a, b) => (a.exercise_order || 0) - (b.exercise_order || 0));
					exercises.forEach((ex: any) => {
						html += `
							<tr>
								<td style="padding: 12px; border: 1px solid #e2e8f0;">
									<strong>${ex.exercises?.name || '未知动作'}</strong>
									${ex.exercises?.muscle_group ? `<br><small style="color: #718096;">肌群: ${ex.exercises.muscle_group}</small>` : ''}
								</td>
								<td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0;">${ex.target_sets || '-'}</td>
								<td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0;">${ex.target_reps || '-'}</td>
								<td style="text-align: center; padding: 12px; border: 1px solid #e2e8f0;">${ex.target_weight_kg || '-'}</td>
								<td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${ex.notes || '-'}</td>
							</tr>
						`;
					});

					html += `
								</tbody>
							</table>
						</div>
					`;
				}
			} else {
				html += '<p style="text-align: center; color: #718096; margin-top: 40px;">该计划暂无训练动作</p>';
			}

			// 添加页脚
			html += `
				<div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-size: 12px;">
					<p>此训练计划由训练计划管理系统生成</p>
				</div>
			`;

			printableElement.innerHTML = html;
			document.body.appendChild(printableElement);

			// 使用 html2canvas 和 jspdf 生成 PDF
			const canvas = await html2canvas(printableElement, {
				scale: 2,
				useCORS: true,
				logging: false
			});

			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'mm', 'a4');
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();
			const imgWidth = canvas.width;
			const imgHeight = canvas.height;
			const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
			const imgX = (pdfWidth - imgWidth * ratio) / 2;
			const imgY = 10;

			pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
			
			// 如果内容超过一页，添加新页面
			if (imgHeight * ratio > pdfHeight - 20) {
				const pageCount = Math.ceil((imgHeight * ratio) / (pdfHeight - 20));
				for (let i = 1; i < pageCount; i++) {
					pdf.addPage();
					pdf.addImage(
						imgData,
						'PNG',
						imgX,
						-(pdfHeight - 20) * i + imgY,
						imgWidth * ratio,
						imgHeight * ratio
					);
				}
			}

			// 保存PDF
			pdf.save(`训练计划-${plan.name}-${new Date().toISOString().split('T')[0]}.pdf`);

			// 清理
			document.body.removeChild(printableElement);
			notificationMessage = `计划 "${plan.name}" 已成功导出!`;
		} catch (error) {
			console.error('导出PDF失败:', error);
			notificationMessage = '导出失败，请稍后重试。';
		} finally {
			isExporting = false;
			setTimeout(() => {
				showNotification = false;
			}, 3000);
		}
	}
</script>

<div class="container mx-auto p-4 md:p-8">
	<a href="/tools" class="text-blue-600 hover:underline mb-6 inline-block">&larr; 返回工具箱</a>
	<h1 class="text-3xl font-bold mb-2">导出训练计划</h1>
	<p class="text-gray-600 dark:text-gray-400 mb-8">
		将你的训练计划导出为 PDF 文件，方便打印或离线查看。
	</p>

	{#if plans && plans.length > 0}
		<div class="space-y-4">
			{#each plans as plan}
				<div
					class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
				>
					<div class="flex justify-between items-start">
						<div class="flex-1">
							<h3 class="font-bold text-xl mb-2">{plan.name}</h3>
							<p class="text-gray-600 dark:text-gray-400 mb-3">{plan.description || '暂无描述'}</p>
							{#if plan.plan_exercises && plan.plan_exercises.length > 0}
								<p class="text-sm text-gray-500">
									包含 {plan.plan_exercises.length} 个训练动作
								</p>
							{:else}
								<p class="text-sm text-gray-500">暂无训练动作</p>
							{/if}
						</div>
						<button
							on:click={() => exportToPdf(plan)}
							disabled={isExporting}
							class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{#if isExporting}
								<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
								导出中...
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								导出为 PDF
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
			<svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<p class="text-gray-500 mb-4">你还没有任何训练计划可以导出。</p>
			<a href="/plans" class="text-blue-600 hover:underline">去创建训练计划 →</a>
		</div>
	{/if}
</div>

<!-- 浮动通知 -->
{#if showNotification}
	<div
		class="fixed bottom-5 right-5 bg-gray-900 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
		class:translate-y-0={showNotification}
		class:translate-y-20={!showNotification}
	>
		{#if notificationMessage.includes('正在')}
			<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
		{/if}
		{notificationMessage}
	</div>
{/if} 