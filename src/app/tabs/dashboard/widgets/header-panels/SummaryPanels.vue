<template>
  <div :class="[$style.summaryPanels, classes]">
    <SummaryPanel
      :values="income"
      color="--c-success"
      :title="t('dashboard.income')"
    />

    <SummaryPanel
      :sub-title="`~${Math.round(expensePercentage * 100)} %`"
      :values="expenses"
      color="--c-warning"
      :title="t('dashboard.expenses')"
    />

    <SummaryPanel
      :sub-title="`~${Math.round(
        expensePercentage ? (1 - expensePercentage) * 100 : 0
      )} %`"
      :values="endingBalance"
      color="--c-primary"
      :title="t('dashboard.endingBalance')"
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
const { t } = useI18n();

const incomeTotals = computed(() => totals(state.income));
const expensesTotals = computed(() => totals(state.expenses));

const income = computed(() => aggregate(incomeTotals.value));
const expenses = computed(() => aggregate(expensesTotals.value));
const endingBalance = computed(() => subtract(income.value, expenses.value));

const expensePercentage = computed(() => {
  const expenses = sum(expensesTotals.value);
  const income = sum(incomeTotals.value);
  return income ? expenses / income : 0;
});
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.summaryPanels {
  display: grid;
  grid-template: 1fr / 1fr 1fr 1fr;
  width: 100%;
  height: 150px;
  grid-gap: 10px;

  @include globals.onMobileDevices {
    grid-template: 1fr 1fr 1fr / 1fr;
    height: 100%;
  }
}
</style>
