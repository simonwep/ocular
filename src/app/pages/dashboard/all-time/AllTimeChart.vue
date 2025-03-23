<template>
  <ChartPlaceholder v-if="isEmpty" />
  <StackedLineChart v-else :data="data" />
</template>

<script lang="ts" setup>
import { StackedLineChartConfig } from './stacked-line-chart/StackedLineChart.types';
import StackedLineChart from './stacked-line-chart/StackedLineChart.vue';
import ChartPlaceholder from '@components/feature/ChartPlaceholder.vue';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { sum } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const { state } = useDataStore();

const allIncomes = computed(() => state.years.flatMap((v) => totals(v.income)));
const allExpenses = computed(() => state.years.flatMap((v) => totals(v.expenses)));

const isEmpty = computed(() => !sum(allIncomes.value) && !sum(allExpenses.value));

const data = computed((): StackedLineChartConfig => {
  const totalMonths = state.years.length * 12;
  const formatter = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: state.currency,
    maximumFractionDigits: 0
  });

  return {
    valueFormatter: (value) => formatter.format(value),
    labels: Array.from({ length: totalMonths }, (_, i) => {
      const year = Math.floor(i / 12) + state.years[0].year;
      const month = (i % 12) + 1;
      return `${year}-${month.toString().padStart(2, '0')}`;
    }),
    series: [
      {
        name: t('page.dashboard.income'),
        trendName: t('page.dashboard.incomeTrend'),
        data: allIncomes.value,
        color: 'var(--c-success-light-dimmed)'
      },
      {
        name: t('page.dashboard.expenses'),
        trendName: t('page.dashboard.expensesTrend'),
        data: allExpenses.value,
        color: 'var(--c-danger-light-dimmed)'
      }
    ]
  };
});
</script>
