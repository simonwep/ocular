<template>
  <EChart :class="classes" :options="options"/>
</template>

<script lang="ts" setup>
import EChart from '@components/charts/e-chart/EChart.vue';
import {LineChartConfig} from '@components/charts/line-chart/LineChart.types';
import {GridComponentOption, LineSeriesOption} from 'echarts';
import {LineChart} from 'echarts/charts';
import {GridComponent, LegendComponent, TooltipComponent} from 'echarts/components';
import * as echarts from 'echarts/core';
import {SVGRenderer} from 'echarts/renderers';
import {LegendOption, TooltipOption} from 'echarts/types/dist/shared';
import {computed} from 'vue';

echarts.use([
  GridComponent,
  LegendComponent,
  LineChart,
  TooltipComponent,
  SVGRenderer
]);

type EChartsOption = echarts.ComposeOption<LegendOption | TooltipOption | GridComponentOption | LineSeriesOption>;

const props = defineProps<{
  class?: any;
  data: LineChartConfig
}>();

const classes = computed(() => props.class);
const options = computed((): EChartsOption => ({
  legend: {
    data: props.data.series.map(v => v.name),
    textStyle: {color: 'var(--chart-legend)'}
  },
  tooltip: {
    trigger: 'axis',
    transitionDuration: 0,
    backgroundColor: 'var(--chart-tooltip)',
    textStyle: {
      color: 'var(--chart-tooltip-text)',
      fontFamily: 'var(--font-family)',
      fontWeight: 'normal'
    },
    axisPointer: {
      type: 'cross',
      crossStyle: {color: 'var(--chart-tooltip-pointer-cross)'},
      lineStyle: {color: 'var(--chart-tooltip-pointer-cross)'},
      label: {
        backgroundColor: 'var(--chart-tooltip-pointer-background)',
        color: 'var(--chart-tooltip-pointer)',
        fontFamily: 'var(--font-family)'
      }
    }
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '0',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data.legend,
    axisLabel: {color: 'var(--chart-label)', fontFamily: 'var(--font-family)'},
    axisLine: {lineStyle: {color: 'var(--chart-axis-line)'}}
  },
  yAxis: {
    type: 'value',
    axisLabel: {color: 'var(--chart-label)', fontFamily: 'var(--font-family)'},
    splitLine: {lineStyle: {color: 'var(--chart-axis-line)'}}
  },
  series: props.data.series.map((v, index): LineSeriesOption => ({
    name: v.name,
    type: 'line',
    data: v.data,
    smooth: true,
    showSymbol: false,
    color: v.color ? `var(${v.color})` : `var(--chart-series-${String(index).padStart(2, '0')})`,
    lineStyle: {
      width: 5,
      cap: 'round'
    },
    emphasis: {
      lineStyle: {
        color: v.color ? `var(${v.color})` : `var(--chart-series-${String(index).padStart(2, '0')})`,
      }
    }
  }))
}));

</script>
