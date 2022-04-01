<template>
  <LineChart :class="$style.summary" :data="data"/>
</template>

<script lang="ts" setup>
import {LineChartConfig} from '@components/charts/line-chart/LineChart.types';
import LineChart from '@components/charts/line-chart/LineChart.vue';
import {useStore} from '@state/index';
import {totals} from '@state/utils/budgets';
import {sum} from '@utils';
import {computed} from 'vue';

const props = withDefaults(defineProps<{
  class?: any;
  locale?: string;
}>(), {
  locale: 'en-us'
});

const {state} = useStore();
const data = computed((): LineChartConfig => {
  const months = new Array(12)
      .fill(0)
      .map((_, index) => new Date(0, index).toLocaleDateString(props.locale, {month: 'short'}));

  const income = totals(state.income);
  const expenses = totals(state.expenses);
  const endingBalance = income.map((v, index) => sum(income.slice(0, index)) - sum(expenses.slice(0, index)));

  return {
    legend: months,
    series: [
      {name: 'Income', color: '--c-success-light-dimmed', data: income},
      {name: 'Expenses', color: '--c-warning-light-dimmed', data: expenses},
      {name: 'Ending Balance', color: '--c-primary-light-dimmed', data: endingBalance},
    ]
  };
});

</script>

<style lang="scss" module>

.summary {
  width: 100%;
  height: 250px;
}

</style>
