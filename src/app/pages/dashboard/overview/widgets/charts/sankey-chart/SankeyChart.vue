<template>
  <div :class="$style.container">
    <EChart ref="chart" :class="[$style.sankeyChart, classes]" :options="options" />
    <div :class="$style.controls">
      <Switch v-model="showPercentages" :iconOn="RiPercentFill" :iconOff="RiNumber9" />
      <ContextMenu v-if="chart" position="top-end">
        <template #default="{ toggle }">
          <button type="button" :class="$style.downloadBtn" @click="toggle">
            <RiDownload2Line size="14" />
          </button>
        </template>

        <template #options>
          <ContextMenuButton :icon="RiLandscapeLine" :text="t('page.dashboard.downloadAsPNG')" @click="downloadPNG" />
          <ContextMenuButton :icon="RiImageLine" :text="t('page.dashboard.downloadAsSVG')" @click="downloadSVG" />
        </template>
      </ContextMenu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SankeyChartConfig } from './SankeyChart.types';
import { transformSankeyChart } from '@app/pages/dashboard/overview/widgets/charts/sankey-chart/SankeyChart.utils.ts';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import Switch from '@components/base/switch/Switch.vue';
import EChart from '@components/charts/echart/EChart.vue';
import { RiDownload2Line, RiImageLine, RiLandscapeLine, RiNumber9, RiPercentFill } from '@remixicon/vue';
import { downloadBlob } from '@utils/downloadFile.ts';
import { ClassNames } from '@utils/types.ts';
import { SankeyChart, SankeySeriesOption } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

echarts.use([SankeyChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<SankeySeriesOption>;

const props = defineProps<{
  class?: ClassNames;
  data: SankeyChartConfig;
}>();

const { t } = useI18n();
const chart = ref<InstanceType<typeof EChart>>();
const showPercentages = ref(true);

const classes = computed(() => props.class);

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = computed((): EChartsOption => {
  const transformedConfig = transformSankeyChart(props.data, showPercentages.value ? 'percentage' : 'absolute');

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

const downloadPNG = async () => {
  downloadBlob(await chart.value!.toPNG(), 'sankey-chart.png');
};

const downloadSVG = () => {
  downloadBlob(chart.value!.toSVG(), 'sankey-chart.svg');
};
</script>

<style lang="scss" module>
.container,
.sankeyChart {
  width: 100%;
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover .downloadMenu {
    opacity: 1;
  }
}

.controls {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 0;
}

.downloadBtn {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 100px;
  background: var(--c-primary);
  color: var(--c-primary-text);
  cursor: pointer;
  transition: var(--transition-m) background;

  &:hover {
    background: var(--c-primary-hover);
    color: var(--c-primary-text-hover);
  }
}
</style>
