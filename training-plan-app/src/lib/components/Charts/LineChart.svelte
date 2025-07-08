<script lang="ts">
  // TODO: svelte-chartjs is not compatible with Svelte 5. This component needs to be updated or replaced.
  // import { Line } from 'svelte-chartjs';
  // import {
  //   Chart as ChartJS,
  //   Title,
  //   Tooltip,
  //   Legend,
  //   PointElement,
  //   LineElement,
  //   CategoryScale,
  //   LinearScale,
  //   TimeScale,
  // } from 'chart.js';
  // import type { ChartData, ChartOptions, Point } from 'chart.js';

  // ChartJS.register(
  //   Title,
  //   Tooltip,
  //   Legend,
  //   PointElement,
  //   LineElement,
  //   CategoryScale,
  //   LinearScale,
  //   TimeScale
  // );

  /**
   * Chart.js data object for the line chart.
   * @type {ChartData<'line', (number | Point)[], unknown>}
   */
  // export let data: ChartData<'line', (number | Point)[], unknown>;
  export let data: any;

  /**
   * Chart.js options object for the line chart.
   * @type {ChartOptions<'line'>}
   */
  // export let options: ChartOptions<'line'> | undefined = undefined;
  export let options: any;
</script>

<div class="chart-container" style="position: relative; min-height: 300px; width: 100%;">
  <!-- <Line {data} {options} /> -->
  <div>Chart is temporarily disabled due to dependency issues.</div>
</div> 