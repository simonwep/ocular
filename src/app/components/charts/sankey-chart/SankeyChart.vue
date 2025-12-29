<template>
  <EChart ref="chart" :options="options" />
</template>

<script lang="ts" setup>
import { SankeyChartConfig } from './SankeyChart.types';
import { transformSankeyChart } from './SankeyChart.utils.ts';
import EChart from '@components/charts/echart/EChart.vue';
import { ClassNames } from '@utils/types.ts';
import { SankeyChart, SankeySeriesOption } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed, useTemplateRef } from 'vue';

echarts.use([SankeyChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<SankeySeriesOption>;

const props = defineProps<{
  class?: ClassNames;
  percentages?: boolean;
  data: SankeyChartConfig;
}>();

const chart = useTemplateRef('chart');

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = computed((): EChartsOption => {
  const transformedConfig = transformSankeyChart(props.data, props.percentages ? 'percentage' : 'absolute');

  return {
    animation: false,
    silent: true,
    series: {
      type: 'sankey',
      label: {
        formatter: '{b}',
        textBorderWidth: 0,
        fontWeight: 'var(--font-weight-l)' as any,
        fontFamily: 'var(--font-family)',
        color: 'var(--chart-label)'
      },
      lineStyle: {
        color: 'source',
        curveness: 0.5
      },
      nodeGap: 10,
      nodeWidth: 7,
      layoutIterations: 0,
      left: 0,
      right: 0,
      top: 5,
      bottom: 5,
      links: transformedConfig.links.map((v) => ({
        ...v,
        animation: true,
        lineStyle: { opacity: v.muted ? 0.05 : 0.25 }
      })),
      data: transformedConfig.labels.map((v) => ({
        name: v.name,
        id: v.id,
        itemStyle: {
          color: v.color,
          opacity: v.muted ? 0.25 : 1
        },
        label:
          v.align === 'left'
            ? {
                align: 'right',
                opacity: v.muted ? 0.65 : 1,
                padding: [0, 20, 0, 0]
              }
            : { opacity: v.muted ? 0.65 : 1 }
      }))
    }
  };
});

defineExpose({
  download: (name: string, type: 'png' | 'svg') => chart.value?.download(name, type)
});
</script>
