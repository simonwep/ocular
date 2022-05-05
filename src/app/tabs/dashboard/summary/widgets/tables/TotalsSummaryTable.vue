<template>
  <SummaryTable :title="title">
    <div :class="$style.table">
      <!-- Header -->
      <span />
      <span
        v-for="(month, index) of months"
        :class="[$style.bold, { [$style.currentMonth]: index === currentMonth }]"
        :key="month"
        >{{ month }}</span
      >
      <span :class="$style.bold">{{ t('budget.total') }}</span>
      <span :class="$style.bold">{{ t('budget.average') }}</span>

      <!-- Income -->
      <span :class="[$style.bold, $style.muted]">{{ t('dashboard.income') }}</span>
      <span
        v-for="(amount, index) of income"
        :class="[$style.muted, $style.first, { [$style.current]: index === currentMonth }]"
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
        :class="[$style.muted, { [$style.current]: index === currentMonth }]"
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
        :class="[$style.muted, { [$style.current]: index === currentMonth }]"
        :key="index"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span :class="$style.muted">{{ n(sum(netSavings), 'currency') }}</span>
      <span :class="$style.muted">{{ n(average(netSavings), 'currency') }}</span>

      <!-- Ending balance  -->
      <span :class="$style.bold">{{ t('dashboard.endingBalance') }}</span>
      <span
        :class="[$style.bold, $style.last, { [$style.current]: index === currentMonth }]"
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
import { aggregate, average, subtract, sum } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SummaryTable from './SummaryTable.vue';

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

const { d, t, n } = useI18n();

const months = computed(() => {
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    months.push(d(new Date(0, i), 'month'));
  }

  return months;
});

const currentMonth = new Date().getMonth();
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
</style>
