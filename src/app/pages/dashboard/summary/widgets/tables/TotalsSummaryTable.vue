<template>
  <SummaryTable>
    <div :class="$style.table">
      <!-- Header -->
      <span />
      <span
        v-for="(month, index) of months"
        :key="month"
        :class="[$style.bold, { [$style.currentMonth]: isCurrentMonth(index) }]"
      >
        <span>{{ month }}</span>
      </span>
      <span :class="$style.bold">{{ t('shared.total') }}</span>
      <span :class="$style.bold">{{ t('shared.average') }}</span>

      <!-- Income -->
      <span :class="[$style.bold, $style.muted]">{{ t('page.income.title') }}</span>
      <span
        v-for="(amount, index) of income"
        :key="index"
        :class="[$style.muted, $style.first, $style.income, { [$style.current]: isCurrentMonth(index) }]"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span :class="$style.muted">{{ n(sum(income), 'currency') }}</span>
      <span :class="$style.muted">{{ n(average(income), 'currency') }}</span>

      <!-- Expenses -->
      <span :class="[$style.bold, $style.muted]">{{ t('page.expenses.title') }}</span>
      <span
        v-for="(amount, index) of expenses"
        :key="index"
        :class="[$style.muted, $style.expense, { [$style.current]: isCurrentMonth(index) }]"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span :class="$style.muted">{{ n(sum(expenses), 'currency') }}</span>
      <span :class="$style.muted">{{ n(average(expenses), 'currency') }}</span>

      <!-- Net savings  -->
      <span :class="[$style.bold, $style.muted]">{{ t('page.dashboard.netSavings') }}</span>
      <span
        v-for="(amount, index) of netSavings"
        :key="index"
        :class="[$style.muted, { [$style.current]: isCurrentMonth(index), [$style.overdrawn]: amount < 0 }]"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span :class="$style.muted">{{ n(sum(netSavings), 'currency') }}</span>
      <span :class="$style.muted">{{ n(average(netSavings), 'currency') }}</span>

      <!-- Ending balance  -->
      <span :class="$style.bold">{{ t('page.dashboard.endingBalance') }}</span>
      <span
        v-for="(amount, index) of endingBalance"
        :key="index"
        :class="[$style.bold, $style.last, { [$style.current]: isCurrentMonth(index), [$style.overdrawn]: amount < 0 }]"
      >
        {{ n(amount, 'currency') }}
      </span>
      <span />
      <span />
    </div>
  </SummaryTable>
</template>

<script lang="ts" setup>
import SummaryTable from './SummaryTable.vue';
import { useMonthNames } from '@composables';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { aggregate, average, subtract, sum } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    income?: number[];
    expenses?: number[];
  }>(),
  {
    income: () => [],
    expenses: () => []
  }
);

const { t, n } = useI18n();
const { isCurrentMonth } = useDataStore();
const { state: settings } = useSettingsStore();
const months = useMonthNames('long', () => settings.general.monthOffset);

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

.overdrawn {
  color: var(--c-danger-pure);
}
</style>
