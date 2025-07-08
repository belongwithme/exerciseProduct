<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		LinearScale,
		DoughnutController
	} from 'chart.js';
	import type { Chart, ChartData, ChartOptions } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, DoughnutController);

	/**
	 * Chart.js data object for the doughnut chart.
	 * @type {ChartData<'doughnut'>}
	 */
	export let data: ChartData<'doughnut'>;

	/**
	 * Chart.js options object for the doughnut chart.
	 * @type {ChartOptions<'doughnut'>}
	 */
	export let options: ChartOptions<'doughnut'> | undefined = undefined;

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	// Reactive statement to handle chart creation and updates
	$: {
		if (chart) {
			chart.destroy();
		}
		if (canvas && data) {
			chart = new ChartJS(canvas, {
				type: 'doughnut',
				data,
				options
			});
		}
	}

	onMount(() => {
		// The reactive block above handles chart creation.
		// We just need to handle destruction on component unmount.
		return () => {
			chart?.destroy();
		};
	});
</script>

<div class="chart-container" style="position: relative; height: 300px; width: 300px">
	<canvas bind:this={canvas}></canvas>
</div> 