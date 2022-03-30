<template>
  <Pane :sub-title="totalFormatted" :title="title">
    <template #header>
      <MiniChart :values="totals"/>
    </template>
    <BudgetGroups v-model:totals="totals" :type="type"/>
  </Pane>
</template>

<script lang="ts" setup>
import MiniChart from '@components/mini-chart/MiniChart.vue';
import {useCurrencyFormatter} from '@composables';
import Pane from '@shared/Pane.vue';
import BudgetGroups from '@shared/pane/budget-groups/BudgetGroups.vue';
import {useStore} from '@state/index';
import {computed} from 'vue';

const props = defineProps<{
  title: string;
  type: 'expenses' | 'income';
}>();

const {state} = useStore();
const groups = computed(() => state[props.type]);

const totals = computed(() => {
  const totals = (new Array(12)).fill(0);

  for (const {budgets} of groups.value) {
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
