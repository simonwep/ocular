<template>
  <EChart :class="[$style.stackedLineChart, classes]" :options="options" />
</template>

<script lang="ts" setup>
import { GridComponentOption, LegendComponentOption, LineSeriesOption, TooltipComponentOption } from 'echarts';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed } from 'vue';
import EChart from '@components/charts/echart/EChart.vue';
import { ClassNames, rollingAverage } from '@utils';
import { StackedLineChartConfig } from './StackedLineChart.types';

echarts.use([LineChart, SVGRenderer, LegendComponent, GridComponent, TooltipComponent]);

type EChartsOption = echarts.ComposeOption<
  LineSeriesOption | TooltipComponentOption | GridComponentOption | LegendComponentOption
>;

const props = defineProps<{
  class?: ClassNames;
  data: StackedLineChartConfig;
}>();

const classes = computed(() => props.class);

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = computed(
  (): EChartsOption => ({
    animation: false,
    legend: {
      data: props.data.series.flatMap((v) => [v.name, v.trendName]),
      textStyle: { color: 'var(--chart-label)' },
      lineStyle: { width: 2, cap: 'round' },
      itemStyle: { opacity: 0 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '35px',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      transitionDuration: 0,
      backgroundColor: 'var(--chart-tooltip-background-color)',
      borderColor: 'var(--chart-tooltip-border-color)',
      textStyle: {
        color: 'var(--chart-tooltip-color)',
        fontFamily: 'var(--font-family)',
        fontSize: 12
      },
      valueFormatter: (v) => props.data.valueFormatter?.(v as number) ?? String(v),
      axisPointer: {
        type: 'cross',
        label: {
          color: 'var(--c-primary-text)',
          backgroundColor: 'var(--chart-tooltip-axis-label-background)',
          formatter: (params) => {
            if (params.axisDimension === 'x' || !props.data.valueFormatter) {
              return ` ${params.value}`;
            } else {
              return props.data.valueFormatter(params.value as number);
            }
          }
        },
        lineStyle: {
          color: 'var(--chart-tooltip-cross-color)'
        },
        crossStyle: {
          color: 'var(--chart-tooltip-cross-color)'
        }
      }
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
    series: props.data.series.flatMap((s, seriesIndex, series) => {
      const areaGraph: EChartsOption['series'] = {
        name: s.name,
        type: 'line',
        data: s.data.map(
          (d, index) =>
            d - (seriesIndex ? series.slice(0, seriesIndex).reduce((acc, curr) => acc + curr.data[index], 0) : 0)
        ),
        color: s.color,
        silent: true,
        stack: 'Total',
        areaStyle: {
          color: s.color,
          opacity: 0.15
        },
        emphasis: {
          disabled: true
        }
      };

      const trendLine: EChartsOption['series'] = {
        name: s.trendName,
        type: 'line',
        data: rollingAverage(s.data, 6),
        color: s.color,
        showSymbol: false,
        silent: true,
        tooltip: {
          show: false
        },
        lineStyle: {
          width: 1,
          type: 'dashed',
          opacity: 0.25
        }
      };

      return [areaGraph, trendLine];
    })
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
