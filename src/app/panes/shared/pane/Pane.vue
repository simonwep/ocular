<template>
  <div :class="$style.pane">
    <div :class="$style.header">
      <h1>{{ title }} - {{ totalFormatted }}</h1>
      <MiniChart :values="totals"/>
    </div>
    <BudgetGroups v-model:totals="totals" :type="type"/>
  </div>
</template>

<script lang="ts" setup>
import MiniChart from '@components/mini-chart/MiniChart.vue';
import {useCurrencyFormatter} from '@composables';
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

<style lang="scss" module>

.pane {
  padding: 20px;
  padding-top: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  background: var(--app-backround);
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  padding: 5px 0;
  background: var(--app-backround);

  > h1 {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-l);
    margin-right: auto;
  }
}

</style>
