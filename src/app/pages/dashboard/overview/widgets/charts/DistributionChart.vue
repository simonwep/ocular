<template>
  <ChartPlaceholder v-if="isEmpty" />
  <SankeyChart v-else :class="[$style.distributionChart, classes]" :data="data" />
</template>

<script lang="ts" setup>
import { SankeyChartConfig, SankeyChartLabel, SankeyChartLink } from './sankey-chart/SankeyChart.types';
import SankeyChart from './sankey-chart/SankeyChart.vue';
import ChartPlaceholder from '@components/feature/ChartPlaceholder.vue';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { ClassNames, sum, uuid } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
  highlight?: 'income' | 'expenses';
}>();

const classes = computed(() => props.class);
const { state } = useDataStore();
const { n } = useI18n();

const isEmpty = computed(() => {
  const totalIncome = sum(totals(state.income));
  const totalExpenses = sum(totals(state.expenses));
  return !totalIncome || !totalExpenses;
});

const data = computed((): SankeyChartConfig => {
  const format = (v: number) => n(v, 'currency');
  const totalIncome = sum(totals(state.income));
  const totalExpenses = sum(totals(state.expenses));
  const labels: SankeyChartLabel[] = [];
  const links: SankeyChartLink[] = [];

  const color = (hue: number) => `hsl(${hue}, var(--chart-generic-saturation), var(--chart-generic-lightness))`;

  const income = {
    id: uuid(),
    name: `Income (${format(totalIncome)})`,
    color: color(120)
  };

  labels.push(income);

  for (const group of state.income) {
    const total = sum(group.budgets.flatMap((v) => v.values));

    if (!total) {
      continue;
    }

    labels.push({
      id: group.id,
      name: `${group.name} (${format(total)})`,
      color: color(60 + 60 * (total / totalIncome)),
      muted: props.highlight === 'expenses'
    });

    links.push({
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
          name: `${budget.name} (${format(total)})`,
          color: color(60 + 60 * (total / totalIncome)),
          muted: props.highlight === 'expenses'
        });

        links.push({
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
      name: `${group.name} (${format(total)})`,
      color: color(60 * (1 - total / totalExpenses)),
      muted: props.highlight === 'income'
    });

    links.push({
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
          name: `${budget.name} (${format(total)})`,
          color: color(60 * (1 - total / totalExpenses)),
          align: 'left',
          muted: props.highlight === 'income'
        });

        links.push({
          target: budget.id,
          source: group.id,
          value: total,
          muted: props.highlight === 'income'
        });
      }
    }
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
