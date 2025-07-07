<script lang="ts">
  import { Line } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale,
    TimeScale,
  } from 'chart.js';
  import type { ChartData, ChartOptions, Point } from 'chart.js';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale,
    TimeScale
  );

  /**
   * Chart.js data object for the line chart.
   * @type {ChartData<'line', (number | Point)[], unknown>}
   */
  export let data: ChartData<'line', (number | Point)[], unknown>;

  /**
   * Chart.js options object for the line chart.
   * @type {ChartOptions<'line'>}
   */
  export let options: ChartOptions<'line'> | undefined = undefined;
</script>

<div class="chart-container" style="position: relative; min-height: 300px; width: 100%;">
  <Line {data} {options} />
</div> 