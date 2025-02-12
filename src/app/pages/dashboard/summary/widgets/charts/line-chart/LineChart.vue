<template>
  <EChart :class="[$style.stackedLineChart, classes]" :options="options" />
</template>

<script lang="ts" setup>
import { LineChartConfig } from './LineChart.types';
import EChart from '@components/charts/echart/EChart.vue';
import { ClassNames } from '@utils';
import { LineSeriesOption } from 'echarts/charts';
import {
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed } from 'vue';

echarts.use([SVGRenderer, LegendComponent, GridComponent, TooltipComponent]);

type EChartsOption = echarts.ComposeOption<
  LineSeriesOption | TooltipComponentOption | GridComponentOption | LegendComponentOption
>;

const props = defineProps<{
  class?: ClassNames;
  data: LineChartConfig;
}>();

const classes = computed(() => props.class);

const options = computed(
  (): EChartsOption => ({
    animation: false,
    legend: {
      data: props.data.series.map((v) => v.name),
      textStyle: { color: 'var(--chart-label)' },
      lineStyle: { width: 2, cap: 'round' },
      itemStyle: { opacity: 0 }
    },
    grid: {
      left: 0,
      right: '3%',
      bottom: 0,
      top: '30px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.labels,
      axisTick: { lineStyle: { color: 'var(--chart-line-color)' } },
      axisLine: { lineStyle: { color: 'var(--chart-line-color)' } },
      axisLabel: { color: 'var(--chart-label)' }
    },
    yAxis: {
      type: 'value',
      axisTick: { lineStyle: { color: 'var(--chart-line-color)' } },
      axisLine: { lineStyle: { color: 'var(--chart-line-color)' } },
      axisLabel: {
        color: 'var(--chart-label)',
        formatter: props.data.valueFormatter
      },
      splitLine: { lineStyle: { color: 'var(--chart-line-color)' } }
    },
    series: props.data.series.map((v) => ({
      name: v.name,
      type: 'line',
      data: v.data,
      color: v.color,
      silent: true
    }))
  })
);
</script>

<style lang="scss" module>
.stackedLineChart {
  width: 100%;
  height: 100%;
}

.chartTooltip {
  font-family: var(--font-family);
  color: var(--c-primary-text);
  background: var(--c-primary);
}
</style>
