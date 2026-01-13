<template>
  <span
    :class="[
      $style.currencyCell,
      {
        [$style.even]: index % 2,
        [$style.firstRow]: index === 0,
        [$style.firstColumn]: month === 0,
        [$style.currentMonth]: isCurrentMonth(month),
        [$style.tlc]: index === 0 && month === 0,
        [$style.trc]: index === 0 && month === 11,
        [$style.blc]: index === budgets.length - 1 && month === 0,
        [$style.brc]: index === budgets.length - 1 && month === 11
      }
    ]"
  >
    <CellMenu
      :actions="
        () => [
          {
            id: 'fill-row',
            label: t('feature.budgetPane.fillRow'),
            handle: () => fillBudget(budget.id, budget.values[month])
          },
          {
            id: 'fill-to-right',
            label: t('feature.budgetPane.fillRowToRight'),
            handle: () => fillBudget(budget.id, budget.values[month], month)
          }
        ]
      "
    >
      <CurrencyCell
        :ref="(value) => emit('cellRendered', value as InstanceType<typeof CurrencyCell>)"
        :testId="`${testId}-budget-${index}-${month}`"
        :modelValue="budget.values[month]"
        @update:modelValue="setBudget(budget.id, month, $event ?? 0)"
      />
    </CellMenu>
  </span>
</template>

<script lang="ts" setup>
import CellMenu from '@components/base/cell-menu/CellMenu.vue';
import CurrencyCell from '@components/base/currency-cell/CurrencyCell.vue';
import { useStateUtils } from '@composables/state-utils/useStateUtils.ts';
import { useDataStore } from '@store/state';
import { Budget } from '@store/state/types';
import { DeepReadonly } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  cellRendered: [InstanceType<typeof CurrencyCell>];
}>();

defineProps<{
  index: number;
  month: number;
  testId: string;
  budgets: DeepReadonly<Budget[]>;
  budget: DeepReadonly<Budget>;
}>();

const { setBudget, fillBudget } = useDataStore();
const { isCurrentMonth } = useStateUtils();
const { t } = useI18n();
</script>

<style lang="scss" module>
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
