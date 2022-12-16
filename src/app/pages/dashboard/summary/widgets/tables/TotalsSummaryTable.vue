<template>
  <SummaryTable :title="title">
    <div :class="$style.table">
      <!-- Header -->
      <span />
      <span
        v-for="(month, index) of months"
        :class="[$style.bold, { [$style.currentMonth]: isCurrentMonth(index) }]"
        :key="month"
        >{{ month }}</span
      >
      <span :class="$style.bold">{{ t('budget.total') }}</span>
      <span :class="$style.bold">{{ t('budget.average') }}</span>

      <!-- Income -->
      <span :class="[$style.bold, $style.muted]">{{ t('dashboard.income') }}</span>
      <span
        v-for="(amount, index) of income"
        :class="[$style.muted, $style.first, $style.income, { [$style.current]: isCurrentMonth(index) }]"
        :key="index"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span :class="$style.muted">{{ n(sum(income), 'currency') }}</span>
      <span :class="$style.muted">{{ n(average(income), 'currency') }}</span>

      <!-- Expenses -->
      <span :class="[$style.bold, $style.muted]">{{ t('dashboard.expenses') }}</span>
      <span
        v-for="(amount, index) of expenses"
        :class="[$style.muted, $style.expense, { [$style.current]: isCurrentMonth(index) }]"
        :key="index"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span :class="$style.muted">{{ n(sum(expenses), 'currency') }}</span>
      <span :class="$style.muted">{{ n(average(expenses), 'currency') }}</span>

      <!-- Net savings  -->
      <span :class="[$style.bold, $style.muted]">{{ t('dashboard.netSavings') }}</span>
      <span
        v-for="(amount, index) of netSavings"
        :class="[$style.muted, { [$style.current]: isCurrentMonth(index) }]"
        :key="index"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span :class="$style.muted">{{ n(sum(netSavings), 'currency') }}</span>
      <span :class="$style.muted">{{ n(average(netSavings), 'currency') }}</span>

      <!-- Ending balance  -->
      <span :class="$style.bold">{{ t('dashboard.endingBalance') }}</span>
      <span
        :class="[$style.bold, $style.last, { [$style.current]: isCurrentMonth(index) }]"
        v-for="(amount, index) of endingBalance"
        :key="index"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span />
      <span :class="$style.bold">{{ n(average(endingBalance), 'currency') }}</span>
    </div>
  </SummaryTable>
</template>

<script lang="ts" setup>
import { useMonthNames } from '@composables';
import { aggregate, average, subtract, sum } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SummaryTable from './SummaryTable.vue';
import { useDataStore } from '@store/state';

const props = withDefaults(
  defineProps<{
    income?: number[];
    expenses?: number[];
    title: string;
  }>(),
  {
    income: () => [],
    expenses: () => []
  }
);

const { t, n } = useI18n();
const { isCurrentMonth } = useDataStore();
const months = useMonthNames();

const netSavings = computed(() => subtract(props.income, props.expenses));
const endingBalance = computed(() => aggregate(netSavings.value));
</script>

<style lang="scss" module>
@use 'shared';

.table {
  display: grid;
  grid-template: auto / var(--grid-layout);
  font-size: var(--font-size-xs);
}

.current {
  &.income {
    color: var(--c-success-pure);
  }

  &.expense {
    color: var(--c-danger-pure);
  }
}
</style>
