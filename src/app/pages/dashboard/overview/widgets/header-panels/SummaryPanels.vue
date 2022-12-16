<template>
  <div :class="classes" @animationend="animationsDone++">
    <SummaryPanel :values="income" color="--c-success" to="/income" :title="t('dashboard.income')" />

    <SummaryPanel
      :sub-title="n(expensePercentage, 'percent')"
      to="/expenses"
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
      v-if="currentYear === state.activeYear"
      :sub-title="n(remainingBalancePercentage, 'percent')"
      :values="remainingBalance"
      color="--c-secondary"
      :title="t('dashboard.remainingBalance', { year: currentYear + 1 })"
    />
  </div>
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { aggregate, ClassNames, subtract, sum } from '@utils';
import { computed, ref, useCssModule } from 'vue';
import { useI18n } from 'vue-i18n';
import SummaryPanel from './SummaryPanel.vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const currentYear = new Date().getFullYear();

const { state } = useDataStore();
const { t, n } = useI18n();
const animationsDone = ref(0);

const styles = useCssModule();
const classes = computed(() => [
  props.class,
  styles.summaryPanels,
  {
    [styles.reduced]: state.activeYear !== currentYear,
    [styles.unAnimated]: animationsDone.value >= 3
  }
]);

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
  const nextMonth = new Date().getMonth() + 1;
  return sum(subtract(incomeTotals.value.slice(nextMonth), expensesTotals.value.slice(nextMonth)));
});

const remainingBalancePercentage = computed(() => {
  const endBalance = endingBalance.value[endingBalance.value.length - 1];
  return endBalance ? remainingBalance.value / endBalance : 0;
});
</script>

<style lang="scss" module>
@use 'src/styles/globals';
@use 'sass:math';

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

  &.reduced {
    --panels: 3;
  }

  > * {
    opacity: 0;
    animation: var(--animation-fade-in-right) var(--transition-m) forwards;
  }

  &.unAnimated > * {
    animation: none;
    opacity: 1;
    transform: none;
  }

  @for $i from 1 through 4 {
    > *:nth-child(#{$i}) {
      animation-delay: calc(var(--transition-s) * #{math.div($i, 4)});
    }
  }
}
</style>
