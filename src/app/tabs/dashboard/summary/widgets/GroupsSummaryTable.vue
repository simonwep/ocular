<template>
  <SummaryTable :title="title">
    <div :class="$style.table">
      <!-- Header -->
      <span />
      <span :class="$style.bold" v-for="month of months" :key="month">{{ month }}</span>
      <span :class="$style.bold">{{ t('budget.total') }}</span>
      <span :class="$style.bold">{{ t('budget.average') }}</span>

      <!-- Groups -->
      <template v-for="group of flatted" :key="group.id">
        <span :class="$style.bold">{{ group.name }}</span>
        <span v-for="(amount, index) of group.totals" :key="index">{{ n(amount, 'currency') }}</span>
        <span :class="$style.bold">{{ n(sum(group.totals), 'currency') }}</span>
        <span :class="$style.bold">{{ n(average(group.totals), 'currency') }}</span>
      </template>
    </div>
  </SummaryTable>
</template>

<script lang="ts" setup>
import { BudgetGroup } from '@store/data/types';
import { flatten } from '@store/data/utils/budgets';
import { average, ClassNames, sum } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SummaryTable from './SummaryTable.vue';

const props = defineProps<{
  class?: ClassNames;
  groups: BudgetGroup[];
  title: string;
}>();

const { d, t, n } = useI18n();

const months = computed(() => {
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    months.push(d(new Date(0, i), 'month'));
  }

  return months;
});

const flatted = computed(() => flatten(props.groups));
</script>

<style lang="scss" module>
.table {
  display: grid;
  grid-template: auto / repeat(15, minmax(max-content, 1fr));
  grid-gap: 10px;
  width: 100%;
  font-size: var(--font-size-xs);

  .bold {
    font-weight: var(--font-weight-l);
  }
}
</style>
