<template>
  <div :class="$style.container">
    <EChart ref="chart" :class="[$style.sankeyChart, classes]" :options="options" />

    <ContextMenu v-if="chart" position="top-end" :class="$style.downloadMenu">
      <button type="button" :class="$style.downloadBtn">
        <RiDownloadCloud2Line size="18" />
      </button>

      <template #options>
        <ContextMenuButton :icon="RiLandscapeLine" :text="t('page.dashboard.downloadAsPNG')" @click="downloadPNG" />
        <ContextMenuButton :icon="RiImageLine" :text="t('page.dashboard.downloadAsSVG')" @click="downloadSVG" />
      </template>
    </ContextMenu>
  </div>
</template>

<script lang="ts" setup>
import { RiDownloadCloud2Line, RiImageLine, RiLandscapeLine } from '@remixicon/vue';
import { SankeySeriesOption } from 'echarts';
import { SankeyChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import EChart from '@components/charts/echart/EChart.vue';
import { ClassNames, downloadBlob } from '@utils';
import { SankeyChartConfig } from './SankeyChart.types';

echarts.use([SankeyChart, SVGRenderer]);

type EChartsOption = echarts.ComposeOption<SankeySeriesOption>;

const props = defineProps<{
  class?: ClassNames;
  data: SankeyChartConfig;
}>();

const { t } = useI18n();
const chart = ref<InstanceType<typeof EChart>>();

const classes = computed(() => props.class);

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = computed(
  (): EChartsOption => ({
    animation: false,
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
      })),
      silent: true
    }
  })
);

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
  position: relative;

  &:hover .downloadMenu {
    opacity: 1;
  }
}

.downloadMenu {
  position: absolute;
  inset: auto 0 10px auto;
  transition: opacity var(--transition-m);
  opacity: 0;

  .downloadBtn {
    all: unset;
    display: flex;
    padding: 6px;
    border-radius: var(--border-radius-m);
    background: var(--c-primary);
    color: var(--c-primary-text);
    cursor: pointer;
    transition: var(--transition-m) background;

    &:hover {
      background: var(--c-primary-hover);
      color: var(--c-primary-text-hover);
    }
  }
}
</style>
