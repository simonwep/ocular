<template>
  <ChartPlaceholder v-if="isEmpty" />
  <SankeyChart v-else :class="[$style.distributionChart, classes]" :data="data" />
</template>

<script lang="ts" setup>
import ChartPlaceholder from '@app/pages/shared/ChartPlaceholder.vue';
import {
  SankeyChartConfig,
  SankeyChartLabel,
  SankeyChartLink
} from '@components/charts/sankey-chart/SankeyChart.types';
import SankeyChart from '@components/charts/sankey-chart/SankeyChart.vue';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { ClassNames, sum, uuid } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
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

    labels.push({
      id: group.id,
      name: `${group.name} (${format(total)})`,
      color: color(60 + 60 * (total / totalIncome))
    });

    links.push({
      target: income.id,
      source: group.id,
      value: total
    });

    for (let i = 0; i < group.budgets.length; i++) {
      const budget = group.budgets[i];
      const total = sum(budget.values);

      if (total) {
        labels.push({
          id: budget.id,
          name: `${budget.name} (${format(total)})`,
          color: color(60 + 60 * (total / totalIncome))
        });

        links.push({
          target: group.id,
          source: budget.id,
          value: total
        });
      }
    }
  }

  for (const group of state.expenses) {
    const total = sum(group.budgets.flatMap((v) => v.values));
    labels.push({
      id: group.id,
      name: `${group.name} (${format(total)})`,
      color: color(60 * (1 - total / totalExpenses))
    });

    links.push({
      target: group.id,
      source: income.id,
      value: total
    });

    for (let i = 0; i < group.budgets.length; i++) {
      const budget = group.budgets[i];
      const total = sum(budget.values);

      if (total) {
        labels.push({
          id: budget.id,
          name: `${budget.name} (${format(total)})`,
          color: color(60 * (1 - total / totalExpenses)),
          align: 'left'
        });

        links.push({
          target: budget.id,
          source: group.id,
          value: total
        });
      }
    }
  }

  return { labels, links };
});
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.distributionChart {
  height: 100%;
  width: 100%;
}
</style>
