<template>
  <StackedLineChart :data="data" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { StackedLineChartConfig } from './stacked-line-chart/StackedLineChart.types';
import StackedLineChart from './stacked-line-chart/StackedLineChart.vue';

const { t, locale } = useI18n();
const { state } = useDataStore();

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
        name: t('page.dashboard.expenses'),
        trendName: t('page.dashboard.expensesTrend'),
        data: state.years.flatMap((v) => totals(v.expenses)),
        color: 'var(--c-danger-light-dimmed)'
      },
      {
        name: t('page.dashboard.income'),
        trendName: t('page.dashboard.incomeTrend'),
        data: state.years.flatMap((v) => totals(v.income)),
        color: 'var(--c-success-light-dimmed)'
      }
    ]
  };
});
</script>
