<template>
  <div :class="classes" @animationend="animationsDone++">
    <SummaryPanel
      :values="income"
      :value="incomeSum + startingBalance"
      color="success"
      to="/income"
      testId="income"
      :tooltip="t('page.dashboard.jumpToIncome', { year: state.activeYear })"
      :title="t('page.dashboard.income')"
      :hoverable="appSize !== 'mobile'"
      @pointer-enter="emit('hoveredPanel', 'income')"
      @pointer-leave="emit('hoveredPanel')"
    >
      <template v-if="startingBalance" #subTitle>
        <RiAddCircleFill v-if="startingBalance > 0" size="16px" />
        <RiIndeterminateCircleFill v-else size="16px" />
        <span>{{ n(Math.abs(startingBalance), { key: 'currency', currency: state.currency }) }}</span>
      </template>
    </SummaryPanel>

    <SummaryPanel
      :subTitle="n(expensePercentage, 'percent')"
      to="/expenses"
      testId="expenses"
      :tooltip="t('page.dashboard.jumpToExpenses', { year: state.activeYear })"
      :values="expenses"
      :value="expenseSum"
      color="warning"
      :title="t('page.dashboard.expenses')"
      :hoverable="appSize !== 'mobile'"
      @pointer-enter="emit('hoveredPanel', 'expenses')"
      @pointer-leave="emit('hoveredPanel')"
    />

    <SummaryPanel
      :subTitle="n(endingBalanceSum ? 1 - expensePercentage : 0, 'percent')"
      :values="endingBalance"
      :value="endingBalanceSum"
      color="primary"
      testId="ending-balance"
      :title="t('page.dashboard.endingBalance')"
    />

    <SummaryPanel
      :subTitle="n(remainingBalancePercentage, 'percent')"
      :alt="
        currentMonthIndex < startOfCycle
          ? t('page.dashboard.yearInThePast')
          : currentMonthIndex > endOfCycle
            ? t('page.dashboard.yearInTheFuture')
            : currentMonthIndex + 1 === endOfCycle
              ? t('page.dashboard.yearEnding')
              : undefined
      "
      :value="remainingBalance"
      color="secondary"
      testId="remaining-balance"
      :title="t('page.dashboard.remainingBalance', { year: startOfNextYear })"
    />
  </div>
</template>

<script lang="ts" setup>
import SummaryPanel from './SummaryPanel.vue';
import { useAppSize } from '@composables/app-size/useAppSize.ts';
import { useMonthNames } from '@composables/time/useMonthNames.ts';
import { useTime } from '@composables/time/useTime.ts';
import { RiAddCircleFill, RiIndeterminateCircleFill } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { aggregate, subtract, sum } from '@utils/array/array.ts';
import { ClassNames } from '@utils/types.ts';
import { computed, ref, useCssModule } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  hoveredPanel: [panel?: 'income' | 'expenses'];
}>();

const props = defineProps<{
  class?: ClassNames;
}>();

const monthNames = useMonthNames('long');
const { state: settings } = useSettingsStore();
const { state } = useDataStore();
const { t, n } = useI18n();
const time = useTime();
const appSize = useAppSize();

const animationsDone = ref(0);
const styles = useCssModule();

const currentMonthIndex = computed(() => time.year.value * 12 + time.month.value);
const startOfCycle = computed(() => time.year.value * 12 + settings.general.monthOffset);
const endOfCycle = computed(() => startOfCycle.value + 12);

const classes = computed(() => [
  props.class,
  styles.summaryPanels,
  {
    [styles.unAnimated]: animationsDone.value >= 3
  }
]);

const startOfNextYear = computed(() =>
  settings.general.monthOffset
    ? `${monthNames.value[settings.general.monthOffset]} ${state.activeYear + 1}`
    : state.activeYear + 1
);

const startingBalance = computed(() => (!settings.general.carryOver ? 0 : (state.overallBalance ?? 0)));

const incomeTotals = computed(() => totals(state.income));
const expensesTotals = computed(() => totals(state.expenses));

const income = computed(() => aggregate(incomeTotals.value));
const expenses = computed(() => aggregate(expensesTotals.value));
const endingBalance = computed(() => subtract(incomeTotals.value, expensesTotals.value));

const incomeSum = computed(() => sum(incomeTotals.value));
const expenseSum = computed(() => sum(expensesTotals.value));
const endingBalanceSum = computed(() => sum(endingBalance.value) + startingBalance.value);

const expensePercentage = computed(() => {
  const expenses = sum(expensesTotals.value);
  const income = sum(incomeTotals.value) + startingBalance.value;
  return income ? expenses / income : 0;
});

const remainingBalance = computed(() => {
  const monthOffset = time.year.value === state.activeYear ? time.month.value - settings.general.monthOffset + 1 : 0;
  const nextMonth = monthOffset % 12;

  return sum(subtract(incomeTotals.value.slice(nextMonth), expensesTotals.value.slice(nextMonth)));
});

const remainingBalancePercentage = computed(() =>
  endingBalanceSum.value ? remainingBalance.value / endingBalanceSum.value : 0
);
</script>

<style lang="scss" module>
@use '@styles/globals.scss';
@use 'sass:math';

.summaryPanels {
  --panels: 4;
  display: grid;
  grid-template: 1fr / repeat(var(--panels), 1fr);
  width: 100%;
  gap: 10px;

  @include globals.onMobileDevices {
    grid-template: repeat(var(--panels), 1fr) / 1fr;
    height: auto;
    padding: 0 6px 6px;
  }

  > * {
    opacity: 0;
    animation: var(--animation-fade-in-right) var(--transition-m) forwards;
  }

  &.unAnimated > * {
    transform: none;
    animation: none;
    opacity: 1;
  }

  @for $i from 1 through 4 {
    > *:nth-child(#{$i}) {
      animation-delay: calc(var(--transition-s) * #{math.div($i, 4)});
    }
  }
}
</style>
