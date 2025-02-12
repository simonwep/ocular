<template>
  <SummaryTable :title="title">
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

      <!-- Groups -->
      <template v-for="(group, groupIndex) of flatted" :key="group.id">
        <span :class="$style.bold">{{ group.name }}</span>
        <span
          v-for="(amount, index) of group.totals"
          :key="index"
          :class="{
            [$style.current]: isCurrentMonth(index),
            [$style.first]: groupIndex === 0,
            [$style.last]: groupIndex === flatted.length - 1
          }"
        >
          {{ n(amount, 'currency') }}
        </span>
        <span :class="$style.bold">{{ n(sum(group.totals), 'currency') }}</span>
        <span :class="$style.bold">{{ n(average(group.totals), 'currency') }}</span>
      </template>

      <!-- Totals -->
      <template v-if="flatted.length > 1">
        <span :class="$style.bold">{{ t('shared.total') }}</span>
        <span v-for="(month, index) of months" :key="month" :class="$style.bold">
          {{ n(sum(flatted.map((v) => v.totals[index])), 'currency') }}
        </span>
        <span :class="$style.underline">
          {{ n(sum(add(...flatted.map((v) => v.totals))), 'currency') }}
        </span>
        <span :class="$style.underline">
          {{ n(average(add(...flatted.map((v) => v.totals))), 'currency') }}
        </span>
      </template>
    </div>
  </SummaryTable>
</template>

<script lang="ts" setup>
import SummaryTable from './SummaryTable.vue';
import { useMonthNames } from '@composables';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { BudgetGroup } from '@store/state/types';
import { flatten } from '@store/state/utils/budgets';
import { average, ClassNames, sum, add } from '@utils';
import { DeepReadonly, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
  groups: DeepReadonly<BudgetGroup[]>;
  title: string;
}>();

const { t, n } = useI18n();
const { isCurrentMonth } = useDataStore();
const { state: settings } = useSettingsStore();
const months = useMonthNames('long', () => settings.general.monthOffset);

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
