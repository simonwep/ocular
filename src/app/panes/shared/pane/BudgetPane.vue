<template>
  <Pane :sub-title="totalFormatted" :title="title">
    <template #header>
      <MiniChart :values="total"/>
    </template>
    <BudgetGroups v-model:totals="total" :type="type"/>
  </Pane>
</template>

<script lang="ts" setup>
import MiniChart from '@components/charts/mini-chart/MiniChart.vue';
import {useCurrencyFormatter} from '@composables';
import Pane from '@shared/Pane.vue';
import BudgetGroups from '@shared/pane/budget-groups/BudgetGroups.vue';
import {useStore} from '@state/index';
import {totals} from '@state/utils/budgets';
import {computed} from 'vue';

const props = defineProps<{
  title: string;
  type: 'expenses' | 'income';
}>();

const {state} = useStore();
const total = computed(() => totals(state[props.type]));

const totalFormatted = useCurrencyFormatter(
    computed(() => total.value.reduce((a, b) => a + b, 0))
);

</script>
