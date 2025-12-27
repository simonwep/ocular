<template>
  <!-- Header -->
  <Button
    color="dimmed"
    :disabled="!allowDelete"
    :icon="RiCloseCircleLine"
    textual
    @click="removeBudgetGroup(group.id)"
  />

  <TextCell
    :class="[$style.top, $style.start]"
    :modelValue="group.name"
    :testId="`${testId}-name`"
    inline
    @update:model-value="setBudgetGroupName(group.id, $event)"
  />

  <span v-for="(total, index) of totals" :key="index" :class="$style.top">
    <Currency :value="total" :testId="`${testId}-month-${index}-total`" />
  </span>

  <span :class="$style.top">
    <span>{{ t('shared.total') }}</span>
  </span>

  <span :class="[$style.top, $style.end]">
    <span>{{ t('shared.average') }}</span>
  </span>

  <!-- Budgets -->
  <BudgetGroupBudgets ref="budgetGroupBudgets" :budgets="group.budgets" :testId="testId" :allowDelete="allowDelete" />

  <!-- Footer -->
  <span />
  <Button :icon="RiAddCircleLine" textual @click="addBudget(group.id)" />
  <span style="grid-column: 3 / 16" />
  <Currency :class="[$style.meta, $style.bold]" :value="totalAmount" />
  <Currency :class="[$style.meta, $style.bold]" :value="averageAmount" />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import TextCell from '@components/base/text-cell/TextCell.vue';
import BudgetGroupBudgets from '@components/feature/BudgetGroupBudgets.vue';
import { RiAddCircleLine, RiCloseCircleLine } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { BudgetGroup } from '@store/state/types';
import { average, sum } from '@utils/array/array.ts';
import { computed, DeepReadonly, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  group: DeepReadonly<BudgetGroup>;
  testId: string;
  allowDelete: boolean;
}>();

const { removeBudgetGroup, addBudget, setBudgetGroupName } = useDataStore();
const { t } = useI18n();
const budgetGroupBudgets = useTemplateRef('budgetGroupBudgets');

const totals = computed(() => {
  const totals: number[] = new Array(12).fill(0);

  for (const { values } of props.group.budgets) {
    for (let i = 0; i < values.length; i++) {
      totals[i] += values[i];
    }
  }

  return totals;
});

const totalAmount = computed(() => sum(totals.value));
const averageAmount = computed(() => average(totals.value));

defineExpose({
  currencyCells: computed(() => (budgetGroupBudgets.value?.currencyCells ?? []) as HTMLInputElement[])
});
</script>

<style lang="scss" module>
.header {
  font-style: italic;
  font-size: var(--input-field-font-size);
  font-weight: var(--font-weight-m);
}

.meta {
  font-size: var(--input-field-font-size);
  font-weight: var(--font-weight-m);
  padding: 0 10px;

  &.bold {
    position: relative;
    font-weight: var(--font-weight-l);
    text-decoration: underline;
  }
}

.top {
  display: inline-block;
  font-size: var(--input-field-font-size);
  font-weight: var(--font-weight-l);
  margin: 4px 0;
  padding: 5px 0;
  background: var(--grid-header-background);
  color: var(--grid-header-text);

  > span {
    display: inline-block;
    padding: 0 4px;
  }

  &.start {
    border-top-left-radius: var(--border-radius-l);
    border-bottom-left-radius: var(--border-radius-l);
    padding-left: 8px;
    cursor: text;
  }

  &.end {
    border-top-right-radius: var(--border-radius-l);
    border-bottom-right-radius: var(--border-radius-l);
    padding-right: 8px;
  }
}

.currencyCell {
  display: flex;
  align-items: center;
  background: var(--grid-background-odd);
  height: 100%;
  border-right: 1px solid var(--grid-border-color);
  border-bottom: 1px solid var(--grid-border-color);
  transition: background-color var(--input-field-transition);
  box-shadow: inset 0 0 0 1px transparent;

  &.firstRow {
    border-top: 1px solid var(--grid-border-color);
  }

  &.firstColumn {
    border-left: 1px solid var(--grid-border-color);
  }

  &.currentMonth {
    background: var(--grid-background-odd-active);
  }

  &:focus-within {
    box-shadow: 0 0 0 2px var(--c-primary) inset;
    border-radius: 1px;
  }

  &.even {
    background: var(--grid-background-even);

    &.currentMonth {
      background: var(--grid-background-even-active);
    }
  }

  &.tlc {
    border-top-left-radius: var(--grid-border-radius);
  }

  &.trc {
    border-top-right-radius: var(--grid-border-radius);
  }

  &.blc {
    border-bottom-left-radius: var(--grid-border-radius);
  }

  &.brc {
    border-bottom-right-radius: var(--grid-border-radius);
  }
}
</style>
