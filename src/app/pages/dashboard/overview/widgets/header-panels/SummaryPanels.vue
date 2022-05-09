<template>
  <div :class="[$style.summaryPanels, classes]">
    <SummaryPanel :values="income" color="--c-success" :title="t('dashboard.income')" />

    <SummaryPanel
      :sub-title="n(expensePercentage, 'percent')"
      :values="expenses"
      color="--c-warning"
      :title="t('dashboard.expenses')"
    />

    <SummaryPanel
      :sub-title="n(endingBalanceTotal ? 1 - expensePercentage : 0, 'percent')"
      :values="endingBalance"
      color="--c-primary"
      :title="t('dashboard.endingBalance')"
    />

    <SummaryPanel
      :sub-title="n(remainingBalancePercentage, 'percent')"
      :values="remainingBalance"
      color="--c-secondary"
      :title="t('dashboard.remainingBalance')"
    />
  </div>
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/data';
import { totals } from '@store/data/utils/budgets';
import { aggregate, ClassNames, subtract, sum } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SummaryPanel from './SummaryPanel.vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const { state } = useDataStore();
const { t, n } = useI18n();

const incomeTotals = computed(() => totals(state.income));
const expensesTotals = computed(() => totals(state.expenses));

const income = computed(() => aggregate(incomeTotals.value));
const expenses = computed(() => aggregate(expensesTotals.value));
const endingBalance = computed(() => subtract(income.value, expenses.value));
const endingBalanceTotal = computed(() => sum(endingBalance.value));

const expensePercentage = computed(() => {
  const expenses = sum(expensesTotals.value);
  const income = sum(incomeTotals.value);
  return income ? expenses / income : 0;
});

const remainingBalance = computed(() => {
  const currentMonth = new Date().getMonth() + 1;

  return sum(subtract(incomeTotals.value.slice(currentMonth), expensesTotals.value.slice(currentMonth)));
});

const remainingBalancePercentage = computed(() => {
  const endBalance = endingBalance.value[endingBalance.value.length - 1];
  return endBalance ? remainingBalance.value / endBalance : 0;
});
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.summaryPanels {
  --panels: 4;
  display: grid;
  grid-template: 1fr / repeat(var(--panels), 1fr);
  width: 100%;
  height: 150px;
  grid-gap: 10px;

  @include globals.onMobileDevices {
    grid-template: repeat(var(--panels), 1fr) / 1fr;
    height: auto;
  }
}
</style>
