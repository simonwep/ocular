<template>
  <EChart ref="chart" :classes="classes" :options="options" />
</template>

<script lang="ts" setup>
import { StackedBarChartConfig } from './StackedBarChart.types.ts';
import EChart from '@components/charts/echart/EChart.vue';
import { sum } from '@utils/array/array.ts';
import { ClassNames } from '@utils/types.ts';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { GridComponent, GridComponentOption } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed, useTemplateRef } from 'vue';

const BORDER_RADIUS = 8;

echarts.use([GridComponent, BarChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

const props = defineProps<{
  class?: ClassNames;
  data: StackedBarChartConfig;
  percentages?: boolean;
}>();

const chart = useTemplateRef('chart');

const classes = computed(() => props.class);

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = computed((): EChartsOption => {
  const maxBlocks = Math.max(...props.data.bars.map((v) => v.blocks.length));
  const categories = props.data.bars.map((v) => v.label);
  const categorySums = props.data.bars.map((bar) => sum(bar.blocks.map((v) => v.value)));

  return {
    animation: false,
    silent: true,
    grid: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 10
    },
    xAxis: {
      show: false,
      max: (value) => value.max
    },
    yAxis: {
      data: categories,
      show: false
    },
    series: Array.from({ length: maxBlocks }).map((_, blockIndex) => {
      const data: BarSeriesOption['data'] = categories.map((_, rowIndex) => {
        const block = props.data.bars[rowIndex]?.blocks[blockIndex];

        if (!block?.value) {
          return { value: 0, label: { show: false } };
        }

        const lastIndex = props.data.bars[rowIndex].blocks.length - 1;
        const value = props.percentages ? block.value / categorySums[rowIndex] : block.value;

        return {
          value,
          label: {
            show: true,
            rotate: 45,
            offset: blockIndex % 2 ? [0, 5] : [5, 0],
            align: blockIndex % 2 ? 'right' : 'left',
            position: blockIndex % 2 ? 'bottom' : 'top',
            textBorderWidth: 0,
            color: 'var(--chart-label)',
            shadowColor: 'transparent',
            textBorderColor: 'transparent',
            fontWeight: 'var(--font-weight-l)' as any,
            fontFamily: 'var(--font-family)',
            formatter: () => block.formatter(value, props.percentages ? 'percentage' : 'absolute')
          },
          itemStyle: {
            color: block.color,
            opacity: block.muted ? 0.25 : 1,
            borderWidth: 2,
            borderColor: 'transparent',
            borderRadius:
              blockIndex === 0
                ? [BORDER_RADIUS, 0, 0, BORDER_RADIUS]
                : blockIndex === lastIndex
                  ? [0, BORDER_RADIUS, BORDER_RADIUS, 0]
                  : 0
          }
        } as const;
      });

      return {
        name: `block-${blockIndex}`,
        type: 'bar',
        stack: 'total',
        barMaxWidth: '40%',
        data
      };
    })
  };
});

defineExpose({
  download: (name: string, type: 'png' | 'svg') => chart.value?.download(name, type)
});
</script>
