<template>
  <EChart :class="classes" :options="options" />
</template>

<script lang="ts" setup>
import EChart from '@components/charts/echart/EChart.vue';
import { ClassNames } from '@utils';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { GridComponentOption, GridComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed } from 'vue';

echarts.use([GridComponent, LineChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>;

const props = defineProps<{
  class?: ClassNames;
  values: number[];
}>();

const classes = computed(() => props.class);
const options = computed(
  (): EChartsOption => ({
    xAxis: { type: 'category', show: false },
    yAxis: {
      show: false,
      min: Math.min(...props.values)
    },
    grid: {
      top: '15%',
      left: 0,
      bottom: '20%',
      right: 0
    },
    series: [
      {
        data: props.values,
        type: 'line',
        smooth: true,
        showSymbol: false,
        silent: true
      }
    ]
  })
);
</script>
