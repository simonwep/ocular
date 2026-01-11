<template>
  <Pane :testId="type" :headerClass="$style.header" :amount="amount" :title="title">
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template #header>
      <MiniChart :class="$style.miniChart" :values="total" />
    </template>
    <BudgetGroups :key="state.activeYear" :type="type" />
  </Pane>
</template>

<script lang="ts" setup>
import BudgetGroups from '@components/feature/budget-pane/BudgetGroups.vue';
import MiniChart from '@components/feature/mini-chart/MiniChart.vue';
import Pane from '@components/feature/pane/Pane.vue';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { computed } from 'vue';

const props = defineProps<{
  title?: string;
  type: 'expenses' | 'income';
}>();

const { state } = useDataStore();
const total = computed(() => totals(state[props.type]));
const amount = computed(() => total.value.reduce((a, b) => a + b, 0));
</script>

<style lang="scss" module>
.miniChart {
  width: 75px;
  height: 100%;
  cursor: default;
}

.header {
  padding-bottom: 24px;
}
</style>
