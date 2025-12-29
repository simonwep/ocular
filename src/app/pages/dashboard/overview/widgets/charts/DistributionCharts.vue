<template>
  <div :class="$style.container">
    <ChartPlaceholder v-if="isEmpty" />

    <ComponentTransition v-else>
      <DistributionChartBar v-if="showBarChart" ref="chart" v-bind="chartProps" />
      <DistributionChartSankey v-else ref="chart" v-bind="chartProps" />
    </ComponentTransition>

    <div :class="$style.controls">
      <Switch
        v-model="showPercentages"
        testId="show-percentages"
        :class="$style.switch"
        :iconOn="RiPercentFill"
        :iconOff="RiNumber9"
      />
      <Switch
        v-model="showBarChart"
        testId="show-bar-chart"
        :class="$style.switch"
        :iconOn="RiBarChartHorizontalLine"
        :iconOff="RiGitMergeLine"
      />

      <ContextMenu position="top-end">
        <template #default="{ toggle }">
          <button type="button" :class="$style.downloadBtn" @click="toggle">
            <RiDownload2Line size="14" />
          </button>
        </template>

        <template #options>
          <ContextMenuButton
            :icon="RiLandscapeLine"
            :text="t('page.dashboard.downloadAsPNG')"
            @click="chart?.download(fileName, 'png')"
          />
          <ContextMenuButton
            :icon="RiImageLine"
            :text="t('page.dashboard.downloadAsSVG')"
            @click="chart?.download(fileName, 'svg')"
          />
        </template>
      </ContextMenu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DistributionChartBar from '@app/pages/dashboard/overview/widgets/charts/DistributionChartBar.vue';
import DistributionChartSankey from '@app/pages/dashboard/overview/widgets/charts/DistributionChartSankey.vue';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import Switch from '@components/base/switch/Switch.vue';
import ChartPlaceholder from '@components/feature/chart-placeholder/ChartPlaceholder.vue';
import ComponentTransition from '@components/misc/component-transition/ComponentTransition.vue';
import {
  RiBarChartHorizontalLine,
  RiDownload2Line,
  RiGitMergeLine,
  RiImageLine,
  RiLandscapeLine,
  RiNumber9,
  RiPercentFill
} from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { sumOfBudgetGroups, totals } from '@store/state/utils/budgets.ts';
import { sum } from '@utils/array/array.ts';
import { useLocalStorage } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  highlight?: 'income' | 'expenses';
  percentages?: boolean;
}>();

const { t } = useI18n();
const { state: settings } = useSettingsStore();
const { state } = useDataStore();

const chart = useTemplateRef('chart');
const showBarChart = useLocalStorage('dashboard/show-bar-chart', false);
const showPercentages = useLocalStorage('dashboard/show-percentages', false);

const totalIncome = computed(() =>
  settings.general.carryOver
    ? sumOfBudgetGroups(state.income) + (state.overallBalance ?? 0)
    : sumOfBudgetGroups(state.income)
);

const totalExpenses = computed(() => sum(totals(state.expenses)));

const isEmpty = computed(() => !totalIncome.value || !totalExpenses.value);

const chartProps = computed(() => ({
  totalIncome: totalIncome.value,
  totalExpenses: totalExpenses.value,
  highlight: props.highlight,
  percentages: showPercentages.value
}));

const fileName = computed(() => {
  const chartType = showBarChart.value ? 'bar-chart' : 'sankey-chart';
  const percentageType = showPercentages.value ? 'percentages' : 'absolute';
  return `${chartType}-${percentageType}`;
});
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.controls {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  gap: 10px;
  height: 26px;
  margin: 10px 0;
}

.downloadBtn {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
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

.switch {
  height: 100%;
  width: 50px;
}
</style>
