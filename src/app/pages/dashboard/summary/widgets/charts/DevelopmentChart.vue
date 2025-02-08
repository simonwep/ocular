<template>
  <ChartPlaceholder v-if="isEmpty" :class="classes" />
  <LineChart v-else :class="classes" :data="data" />
</template>

<script lang="ts" setup>
import { LineChartConfig } from './line-chart/LineChart.types';
import LineChart from './line-chart/LineChart.vue';
import ChartPlaceholder from '@components/feature/ChartPlaceholder.vue';
import { useMonthNames } from '@composables';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { aggregate, ClassNames, subtract, sum } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const { state } = useDataStore();
const { state: settings } = useSettingsStore();
const { t, locale } = useI18n();
const months = useMonthNames('long', () => settings.general.monthOffset);

const classes = computed(() => props.class);
const isEmpty = computed(() => {
  const totalIncome = sum(totals(state.income));
  const totalExpenses = sum(totals(state.expenses));
  return !totalIncome || !totalExpenses;
});

const data = computed((): LineChartConfig => {
  const income = totals(state.income);
  const expenses = totals(state.expenses);
  const endingBalance = aggregate(subtract(income, expenses));
  const formatter = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: state.currency,
    maximumFractionDigits: 0
  });

  return {
    labels: months.value,
    valueFormatter: (value) => formatter.format(value),
    series: [
      { name: t('page.dashboard.income'), color: 'var(--c-success-light-dimmed)', data: income },
      { name: t('page.dashboard.expenses'), color: 'var(--c-danger-light-dimmed)', data: expenses },
      { name: t('page.dashboard.endingBalance'), color: 'var(--c-primary-light-dimmed)', data: endingBalance }
    ]
  };
});
</script>
