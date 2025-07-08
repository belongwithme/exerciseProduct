<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		PointElement,
		LineElement,
		RadialLinearScale,
		Filler,
		RadarController
	} from 'chart.js';
	import type { Chart, ChartData, ChartOptions } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale, Filler, RadarController);

	/**
	 * Chart.js data object for the radar chart.
	 * @type {ChartData<'radar', number[], string>}
	 */
	export let data: ChartData<'radar', number[], string>;

	/**
	 * Chart.js options object for the radar chart.
	 * @type {ChartOptions<'radar'>}
	 */
	export let options: ChartOptions<'radar'> | undefined = undefined;

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	// Reactive statement to handle chart creation and updates
	$: {
		if (chart) {
			chart.destroy();
		}
		if (canvas && data) {
			chart = new ChartJS(canvas, {
				type: 'radar',
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