<template>
  <EChart :class="[$style.stackedLineChart, classes]" :options="options" />
</template>

<script lang="ts" setup>
import EChart from '@components/charts/echart/EChart.vue';
import { LineChartConfig } from '@components/charts/line-chart/LineChart.types';
import { ClassNames } from '@utils';
import { GridComponentOption, LegendComponentOption, LineSeriesOption } from 'echarts';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed } from 'vue';

echarts.use([LineChart, SVGRenderer, LegendComponent, GridComponent]);

type EChartsOption = echarts.ComposeOption<LineSeriesOption | GridComponentOption | LegendComponentOption>;

const props = defineProps<{
  class?: ClassNames;
  data: LineChartConfig;
}>();

const classes = computed(() => props.class);

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = computed(
  (): EChartsOption => ({
    legend: {
      data: props.data.series.map((v) => v.name),
      textStyle: { color: 'var(--chart-label)' },
      lineStyle: { width: 2, cap: 'round' },
      itemStyle: { opacity: 0 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
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
      axisLabel: { color: 'var(--chart-label)' },
      splitLine: { lineStyle: { color: 'var(--chart-line-color)' } }
    },
    series: props.data.series.map((v) => ({
      name: v.name,
      type: 'line',
      data: v.data,
      color: v.color
    }))
  })
);
</script>

<style lang="scss" module>
.stackedLineChart {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
