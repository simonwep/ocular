<template>
  <SummaryTable :title="title">
    <div :class="$style.table">
      <!-- Header -->
      <span />
      <span
        v-for="(month, index) of months"
        :class="[$style.bold, { [$style.currentMonth]: isCurrentMonth(index) }]"
        :key="month"
      >
        {{ month }}
      </span>
      <span :class="$style.bold">{{ t('budget.total') }}</span>
      <span :class="$style.bold">{{ t('budget.average') }}</span>

      <!-- Groups -->
      <template v-for="(group, groupIndex) of flatted" :key="group.id">
        <span :class="$style.bold">{{ group.name }}</span>
        <span
          v-for="(amount, index) of group.totals"
          :class="{
            [$style.current]: isCurrentMonth(index),
            [$style.first]: groupIndex === 0,
            [$style.last]: groupIndex === flatted.length - 1
          }"
          :key="index"
          >{{ n(amount, 'currency') }}</span
        >
        <span :class="$style.bold">{{ n(sum(group.totals), 'currency') }}</span>
        <span :class="$style.bold">{{ n(average(group.totals), 'currency') }}</span>
      </template>
    </div>
  </SummaryTable>
</template>

<script lang="ts" setup>
import { useMonthNames } from '@composables';
import { BudgetGroup } from '@store/state/types';
import { flatten } from '@store/state/utils/budgets';
import { average, ClassNames, sum } from '@utils';
import { DeepReadonly } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SummaryTable from './SummaryTable.vue';
import { useDataStore } from '@store/state';

const props = defineProps<{
  class?: ClassNames;
  groups: DeepReadonly<BudgetGroup[]>;
  title: string;
}>();

const { t, n } = useI18n();
const { isCurrentMonth } = useDataStore();
const months = useMonthNames();

const flatted = computed(() => flatten(props.groups));
</script>

<style lang="scss" module>
@use 'shared';

.table {
  display: grid;
  grid-template: auto / var(--grid-layout);
  font-size: var(--font-size-xs);
}
</style>
