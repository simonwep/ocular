<template>
  <ChartPlaceholder v-if="isEmpty" />
  <SankeyChart v-else :class="[$style.distributionChart, classes]" :data="data" />
</template>

<script lang="ts" setup>
import {
  SankeyChartConfig,
  SankeyChartLabel,
  SankeyChartLink,
  SankeyChartType
} from './sankey-chart/SankeyChart.types';
import SankeyChart from './sankey-chart/SankeyChart.vue';
import ChartPlaceholder from '@components/feature/ChartPlaceholder.vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { sumOfBudgetGroups, totals } from '@store/state/utils/budgets';
import { sum } from '@utils/array/array.ts';
import { ClassNames } from '@utils/types.ts';
import { uuid } from '@utils/uuid.ts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
  highlight?: 'income' | 'expenses';
}>();

const classes = computed(() => props.class);
const { state: settings } = useSettingsStore();
const { state } = useDataStore();
const { n, t } = useI18n();

const totalIncome = computed(() =>
  settings.general.carryOver
    ? sumOfBudgetGroups(state.income) + (state.overallBalance ?? 0)
    : sumOfBudgetGroups(state.income)
);

const totalExpenses = computed(() => sum(totals(state.expenses)));

const isEmpty = computed(() => !totalIncome.value || !totalExpenses.value);

const data = computed((): SankeyChartConfig => {
  const format = (value: number, type: SankeyChartType) =>
    n(value, {
      style: type === 'absolute' ? 'currency' : 'percent',
      currency: state.currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });

  const endingBalance = state.overallBalance ?? 0;
  const labels: SankeyChartLabel[] = [];
  const links: SankeyChartLink[] = [];

  const color = (hue: number) => `hsl(${hue}, var(--chart-generic-saturation), var(--chart-generic-lightness))`;

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
      color: color(60 + 60 * (endingBalance / totalIncome.value)),
      muted: props.highlight === 'expenses'
    });

    labels.push({
      id: carryOverTarget,
      formatter: (value, type) => `${t('page.dashboard.surplus')} (${format(value, type)})`,
      color: color(60 + 60 * (endingBalance / totalIncome.value)),
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
      color: color(60 + 60 * (total / totalIncome.value)),
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
          color: color(60 + 60 * (total / totalIncome.value)),
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
      color: color(60 * (1 - total / totalExpenses.value)),
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
          color: color(60 * (1 - total / totalExpenses.value)),
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
      color: color(60 + 60 * (-endingBalance / totalIncome.value)),
      muted: props.highlight === 'income'
    });

    labels.push({
      id: deficitTarget,
      formatter: (value, type) => `${t('page.dashboard.deficit')} (${format(value, type)})`,
      color: color(60 + 60 * (-endingBalance / totalIncome.value)),
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
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.distributionChart {
  height: 100%;
  width: 100%;
}
</style>
