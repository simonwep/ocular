<template>
  <EChart :class="[$style.sankeyChart, classes]" :options="options" />
</template>

<script lang="ts" setup>
import EChart from '@components/charts/echart/EChart.vue';
import { SankeyChartConfig } from '@components/charts/sankey-chart/SankeyChart.types';
import { ClassNames } from '@utils';
import { SankeySeriesOption } from 'echarts';
import { SankeyChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed } from 'vue';

echarts.use([SankeyChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<SankeySeriesOption>;

const props = defineProps<{
  class?: ClassNames;
  data: SankeyChartConfig;
}>();

const classes = computed(() => props.class);

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = computed(
  (): EChartsOption => ({
    series: {
      type: 'sankey',
      animation: false,
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
      left: 0,
      right: 0,
      links: props.data.links,
      data: props.data.labels.map((v) => ({
        name: v.name,
        id: v.id,
        itemStyle: { color: v.color },
        label:
          v.align === 'left'
            ? {
                align: 'right',
                padding: [0, 20, 0, 0]
              }
            : undefined
      }))
    }
  })
);
</script>

<style lang="scss" module>
.sankeyChart {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
