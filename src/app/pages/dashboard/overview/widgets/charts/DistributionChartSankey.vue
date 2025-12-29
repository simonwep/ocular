<template>
  <SankeyChart ref="chart" :percentages="percentages" :data="data" />
</template>

<script lang="ts" setup>
import {
  SankeyChartConfig,
  SankeyChartLabel,
  SankeyChartLink,
  SankeyChartType
} from '@components/charts/sankey-chart/SankeyChart.types';
import SankeyChart from '@components/charts/sankey-chart/SankeyChart.vue';
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

const { state: settings } = useSettingsStore();
const { state } = useDataStore();
const { n, t } = useI18n();

const chart = useTemplateRef('chart');

const color = (hue: number) => `hsl(${hue}, var(--chart-generic-saturation), var(--chart-generic-lightness))`;

const format = (value: number, type: SankeyChartType) =>
  n(value, {
    style: type === 'absolute' ? 'currency' : 'percent',
    currency: state.currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });

const data = computed((): SankeyChartConfig => {
  const endingBalance = state.overallBalance ?? 0;
  const labels: SankeyChartLabel[] = [];
  const links: SankeyChartLink[] = [];

  const income: SankeyChartLabel = {
    id: uuid(),
    formatter: (value, type) =>
      type === 'percentage' ? t('page.dashboard.income') : `${t('page.dashboard.income')} (${format(value, type)})`,
    color: color(120)
  };

  labels.push(income);

  if (settings.general.carryOver && endingBalance > 0) {
    const carryOverSource = uuid();
    const carryOverTarget = uuid();

    labels.push({
      id: carryOverSource,
      formatter: (value, type) => `${t('page.dashboard.lastYear')} (${format(value, type)})`,
      color: color(60 + 60 * (endingBalance / props.totalIncome)),
      muted: props.highlight === 'expenses'
    });

    labels.push({
      id: carryOverTarget,
      formatter: (value, type) => `${t('page.dashboard.surplus')} (${format(value, type)})`,
      color: color(60 + 60 * (endingBalance / props.totalIncome)),
      muted: props.highlight === 'expenses'
    });

    links.push({
      id: uuid(),
      target: carryOverTarget,
      source: carryOverSource,
      value: endingBalance,
      muted: props.highlight === 'expenses'
    });

    links.push({
      id: uuid(),
      target: income.id,
      source: carryOverTarget,
      value: endingBalance,
      muted: props.highlight === 'expenses'
    });
  }

  for (const group of state.income) {
    const total = sum(group.budgets.flatMap((v) => v.values));

    if (!total) {
      continue;
    }

    labels.push({
      id: group.id,
      formatter: (value, type) => `${group.name} (${format(value, type)})`,
      color: color(60 + 60 * (total / props.totalIncome)),
      muted: props.highlight === 'expenses'
    });

    links.push({
      id: uuid(),
      target: income.id,
      source: group.id,
      value: total,
      muted: props.highlight === 'expenses'
    });

    for (let i = 0; i < group.budgets.length; i++) {
      const budget = group.budgets[i];
      const total = sum(budget.values);

      if (total) {
        labels.push({
          id: budget.id,
          formatter: (value, type) => `${budget.name} (${format(value, type)})`,
          color: color(60 + 60 * (total / props.totalIncome)),
          muted: props.highlight === 'expenses'
        });

        links.push({
          id: uuid(),
          target: group.id,
          source: budget.id,
          value: total,
          muted: props.highlight === 'expenses'
        });
      }
    }
  }

  for (const group of state.expenses) {
    const total = sum(group.budgets.flatMap((v) => v.values));

    if (!total) {
      continue;
    }

    labels.push({
      id: group.id,
      formatter: (value, type) => `${group.name} (${format(value, type)})`,
      color: color(60 * (1 - total / props.totalExpenses)),
      muted: props.highlight === 'income'
    });

    links.push({
      id: uuid(),
      target: group.id,
      source: income.id,
      value: total,
      muted: props.highlight === 'income'
    });

    for (let i = 0; i < group.budgets.length; i++) {
      const budget = group.budgets[i];
      const total = sum(budget.values);

      if (total) {
        labels.push({
          id: budget.id,
          formatter: (value, type) => `${budget.name} (${format(value, type)})`,
          color: color(60 * (1 - total / props.totalExpenses)),
          align: 'left',
          muted: props.highlight === 'income'
        });

        links.push({
          id: uuid(),
          target: budget.id,
          source: group.id,
          value: total,
          muted: props.highlight === 'income'
        });
      }
    }
  }

  if (settings.general.carryOver && endingBalance < 0) {
    const deficitSource = uuid();
    const deficitTarget = uuid();

    labels.push({
      id: deficitSource,
      formatter: (value, type) => `${t('page.dashboard.lastYear')} (${format(value, type)})`,
      color: color(60 + 60 * (-endingBalance / props.totalIncome)),
      muted: props.highlight === 'income'
    });

    labels.push({
      id: deficitTarget,
      formatter: (value, type) => `${t('page.dashboard.deficit')} (${format(value, type)})`,
      color: color(60 + 60 * (-endingBalance / props.totalIncome)),
      muted: props.highlight === 'income',
      align: 'left'
    });

    links.push({
      id: uuid(),
      target: deficitSource,
      source: income.id,
      value: -endingBalance,
      muted: props.highlight === 'income'
    });

    links.push({
      id: uuid(),
      target: deficitTarget,
      source: deficitSource,
      value: -endingBalance,
      muted: props.highlight === 'income'
    });
  }

  return { labels, links };
});

defineExpose({
  download: (name: string, type: 'png' | 'svg') => chart.value?.download(name, type)
});
</script>
