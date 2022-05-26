<template>
  <ChartPlaceholder v-if="isEmpty" :class="classes" />
  <LineChart v-else :class="classes" :data="data" />
</template>

<script lang="ts" setup>
import ChartPlaceholder from '@app/pages/shared/ChartPlaceholder.vue';
import { LineChartConfig } from '@components/charts/line-chart/LineChart.types';
import LineChart from '@components/charts/line-chart/LineChart.vue';
import { useMonthNames } from '@composables';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { aggregate, ClassNames, subtract, sum } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const months = useMonthNames();
const { state } = useDataStore();
const { t } = useI18n();

const isEmpty = computed(() => {
  const totalIncome = sum(totals(state.income));
  const totalExpenses = sum(totals(state.expenses));
  return !totalIncome || !totalExpenses;
});

const data = computed((): LineChartConfig => {
  const income = totals(state.income);
  const expenses = totals(state.expenses);
  const endingBalance = aggregate(subtract(income, expenses));

  return {
    labels: months.value,
    series: [
      { name: t('dashboard.income'), color: 'var(--c-success-light-dimmed)', data: income },
      { name: t('dashboard.expenses'), color: 'var(--c-danger-light-dimmed)', data: expenses },
      { name: t('dashboard.endingBalance'), color: 'var(--c-primary-light-dimmed)', data: endingBalance }
    ]
  };
});
</script>
