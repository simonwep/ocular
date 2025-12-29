<template>
  <StackedBarChart ref="chart" :percentages="percentages" :data="data" />
</template>

<script lang="ts" setup>
import {
  StackedBarChartBlock,
  StackedBarChartConfig,
  StackedBarChartType
} from '@components/charts/stacked-bar-chart/StackedBarChart.types.ts';
import StackedBarChart from '@components/charts/stacked-bar-chart/StackedBarChart.vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { sum } from '@utils/array/array.ts';
import { uuid } from '@utils/uuid.ts';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  highlight?: 'income' | 'expenses';
  percentages?: boolean;
  totalIncome: number;
  totalExpenses: number;
}>();

const { t, n } = useI18n();
const { state } = useDataStore();
const { state: settings } = useSettingsStore();

const color = (hue: number) => `hsl(${hue}, var(--chart-generic-saturation), var(--chart-generic-lightness))`;

const format = (value: number, type: StackedBarChartType) =>
  n(value, {
    style: type === 'absolute' ? 'currency' : 'percent',
    currency: state.currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });

const chart = useTemplateRef('chart');

const data = computed((): StackedBarChartConfig => {
  const incomeBlocks: StackedBarChartBlock[] = state.income.map((v) => {
    const value = sum(v.budgets.flatMap((v) => v.values));

    return {
      id: v.id,
      label: v.name,
      color: color(60 + (value / props.totalIncome) * 60),
      formatter: (num, type) => `${v.name} (${format(num, type)})`,
      muted: props.highlight === 'expenses',
      value
    };
  });

  if (settings.general.carryOver) {
    incomeBlocks.splice(0, 0, {
      id: uuid(),
      label: t('page.dashboard.lastYear'),
      color: color(60 + ((state.overallBalance ?? 0) / props.totalIncome) * 60),
      formatter: (num, type) => `${t('page.dashboard.lastYear')} (${format(num, type)})`,
      value: state.overallBalance ?? 0,
      muted: props.highlight === 'expenses'
    });
  }

  const expenseBlocks: StackedBarChartBlock[] = state.expenses.map((v) => {
    const value = sum(v.budgets.flatMap((v) => v.values));

    return {
      id: v.id,
      label: v.name,
      color: color((1 - value / props.totalExpenses) * 60),
      formatter: (num, type) => `${v.name} (${format(num, type)})`,
      muted: props.highlight === 'income',
      value
    };
  });

  if (props.totalIncome > props.totalExpenses) {
    expenseBlocks.push({
      id: uuid(),
      label: t('page.dashboard.surplus'),
      color: color(120),
      formatter: (num, type) => `${t('page.dashboard.surplus')} (${format(num, type)})`,
      muted: props.highlight === 'income',
      value: props.totalIncome - props.totalExpenses
    });
  } else if (props.totalExpenses > props.totalIncome) {
    incomeBlocks.push({
      id: uuid(),
      label: t('page.dashboard.deficit'),
      color: color(0),
      formatter: (num, type) => `${t('page.dashboard.deficit')} (${format(num, type)})`,
      muted: props.highlight === 'expenses',
      value: props.totalExpenses - props.totalIncome
    });
  }

  return {
    bars: [
      { label: 'Income', blocks: incomeBlocks },
      { label: 'Expenses', blocks: expenseBlocks }
    ]
  };
});

defineExpose({
  download: (name: string, type: 'png' | 'svg') => chart.value?.download(name, type)
});
</script>
