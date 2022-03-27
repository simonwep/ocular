<template>
  <Pane :class="$style.expenses" :sub-title="totalFormatted" title="Expenses">
    <template #header>
      <MiniChart :values="totals"/>
    </template>
    <BudgetGroups v-model:totals="totals" :groups="state.expenses"/>
  </Pane>
</template>

<script lang="ts" setup>
import BudgetGroups from '@components/budget-groups/BudgetGroups.vue';
import MiniChart from '@components/mini-chart/MiniChart.vue';
import {useCurrencyFormatter} from '@composables';
import {useState} from '@state/index';
import {computed} from 'vue';
import Pane from '../Pane.vue';

const state = useState();

const totals = computed(() => {
  const totals = (new Array(12)).fill(0);

  for (const {budgets} of state.expenses) {
    for (const {values} of budgets) {
      for (let i = 0; i < values.length; i++) {
        totals[i] += values[i];
      }
    }
  }

  return totals;
});

const totalFormatted = useCurrencyFormatter(
    computed(() => totals.value.reduce((a, b) => a + b, 0))
);

</script>

<style lang="scss" module>

.expenses {

}

</style>
