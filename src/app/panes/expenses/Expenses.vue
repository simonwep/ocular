<template>
  <Pane :class="$style.expenses" :sub-title="totalFormatted" title="Expenses">
    <template #header>
      <MiniChart :values="totals"/>
    </template>
    <BudgetGroups v-model:totals="totals"
                  :groups="state.expenses"
                  type="expenses"/>
  </Pane>
</template>

<script lang="ts" setup>
import MiniChart from '@components/mini-chart/MiniChart.vue';
import {useCurrencyFormatter} from '@composables';
import BudgetGroups from '@shared/budget-groups/BudgetGroups.vue';
import Pane from '@shared/Pane.vue';
import {useStore} from '@state/index';
import {computed} from 'vue';

const {state} = useStore();

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
