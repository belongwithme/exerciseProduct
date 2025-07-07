<script lang="ts">
  import { Doughnut } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';
  import type { ChartData, ChartOptions } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

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
</script>

<div class="chart-container" style="position: relative; height:300px; width:300px">
  <Doughnut {data} {options} />
</div> 