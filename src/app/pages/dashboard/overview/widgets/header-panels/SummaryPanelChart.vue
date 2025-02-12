<template>
  <EChart :class="[$style.summaryPanelChart, classes]" :options="options" />
</template>

<script lang="ts" setup>
import EChart from '@components/charts/echart/EChart.vue';
import { ClassNames } from '@utils';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { GridComponentOption, GridComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  color: string;
  values: number[];
}>();

echarts.use([GridComponent, LineChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>;

const classes = computed(() => props.class);
const options = computed(
  (): EChartsOption => ({
    animation: false,
    xAxis: {
      type: 'category',
      show: false
    },
    yAxis: {
      type: 'value',
      show: false,
      min: Math.min(...props.values)
    },
    grid: {
      top: '5%',
      left: '5%',
      bottom: '5%',
      right: '5%'
    },
    series: [
      {
        data: props.values,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 5,
          cap: 'round',
          color: props.color
        }
      }
    ]
  })
);
</script>

<style lang="scss" module>
.summaryPanelChart {
  overflow: visible;
  pointer-events: none;
}
</style>
