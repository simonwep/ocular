<template>
  <!-- Header -->
  <Button :icon="open ? 'arrow-down-s-line' : 'arrow-right-s-line'" color="dimmed" textual @click="open = !open" />

  <TextCell
    :class="[$style.top, $style.start]"
    :model-value="group.name"
    inline
    @update:model-value="setBudgetGroupName(group.id, $event)"
  />

  <span v-for="(total, index) of totals" :key="index" :class="$style.top">
    <span>
      <Currency :value="total" />
    </span>
  </span>

  <span :class="$style.top">
    <span>{{ t('budget.total') }}</span>
  </span>

  <span :class="[$style.top, $style.end]">
    <span>{{ t('budget.average') }}</span>
  </span>

  <!-- Budgets -->
  <template v-if="open">
    <template v-for="(budget, index) of group.budgets" :key="budget.id + index">
      <span />
      <Button color="dimmed" icon="close-circle" textual @click="removeBudget(budget.id)" />

      <span :class="$style.header">
        <TextCell :model-value="budget.name" @update:model-value="setBudgetName(budget.id, $event)" />
      </span>

      <span
        v-for="(_, month) of budget.values"
        :class="[
          $style.currencyCell,
          {
            [$style.even]: index % 2,
            [$style.firstRow]: index === 0,
            [$style.firstColumn]: month === 0,
            [$style.currentMonth]: isCurrentMonth(month),
            [$style.tlc]: index === 0 && month === 0,
            [$style.trc]: index === 0 && month === 11,
            [$style.blc]: index === group.budgets.length - 1 && month === 0,
            [$style.brc]: index === group.budgets.length - 1 && month === 11
          }
        ]"
        :key="budget.id + month"
      >
        <CurrencyCell :model-value="budget.values[month]" @update:model-value="setBudget(budget.id, month, $event)" />
      </span>

      <span :class="$style.meta">
        <Currency :value="sum(budget.values)" />
      </span>

      <span :class="$style.meta">
        <Currency :value="average(budget.values)" />
      </span>
    </template>

    <!-- Footer -->
    <span />
    <Button icon="plus" :class="$style.addBudgetBtn" textual @click="addBudget(group.id)" color="success" />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
  </template>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import CurrencyCell from '@components/base/currency-cell/CurrencyCell.vue';
import Currency from '@components/base/currency/Currency.vue';
import TextCell from '@components/base/text-cell/TextCell.vue';
import { useDataStore } from '@store/state';
import { BudgetGroup } from '@store/state/types';
import { average, sum } from '@utils';
import { DeepReadonly } from 'vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  group: DeepReadonly<BudgetGroup>;
}>();

const { addBudget, setBudgetName, setBudgetGroupName, setBudget, removeBudget, isCurrentMonth } = useDataStore();

const { t } = useI18n();
const open = ref(true);

const totals = computed(() => {
  const totals: number[] = new Array(12).fill(0);

  for (const { values } of props.group.budgets) {
    for (let i = 0; i < values.length; i++) {
      totals[i] += values[i];
    }
  }

  return totals;
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
}

.top {
  display: inline-block;
  font-size: var(--input-field-font-size);
  font-weight: var(--font-weight-l);
  margin: 4px 0;
  padding: 5px 0;
  background: var(--grid-header-backround);
  color: var(--grid-header-text);

  > span {
    display: inline-block;
    padding: 0 4px;
  }

  &.start {
    border-top-left-radius: var(--border-radius-m);
    border-bottom-left-radius: var(--border-radius-m);
    padding-left: 8px;
    cursor: text;
  }

  &.end {
    border-top-right-radius: var(--border-radius-m);
    border-bottom-right-radius: var(--border-radius-m);
    padding-right: 8px;
  }
}

.currencyCell {
  background: var(--grid-background-odd);
  height: 100%;
  border-right: 1px solid var(--grid-border-color);
  border-bottom: 1px solid var(--grid-border-color);
  transition: all var(--input-field-transition);
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
