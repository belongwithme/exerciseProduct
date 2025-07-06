<script lang="ts">
  import { Radar } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    RadialLinearScale,
    Filler,
  } from 'chart.js';
  import type { ChartData, ChartOptions } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale, Filler);

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
</script>

<div class="chart-container" style="position: relative; height:300px; width:300px">
  <Radar {data} {options} />
</div> 