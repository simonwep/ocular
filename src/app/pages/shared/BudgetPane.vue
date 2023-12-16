<template>
  <Pane :amount="amount" :title="title">
    <template #header>
      <MiniChart :class="$style.miniChart" :values="total" />
    </template>
    <BudgetGroups :type="type" />
  </Pane>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import MiniChart from '@components/charts/mini-chart/MiniChart.vue';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import BudgetGroups from './BudgetGroups.vue';
import Pane from './Pane.vue';

const props = defineProps<{
  title: string;
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
</style>
