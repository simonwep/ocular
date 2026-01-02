<template>
  <template v-for="(budget, index) of budgets" :key="budget.id + index">
    <Draggable
      :id="budget.id"
      :target="['budget-group', 'budget-groups']"
      name="budget-group"
      :text="buildDraggableText"
      @drop="reorder"
    />

    <Button
      color="dimmed"
      :disabled="!allowDelete"
      :testId="`${testId}-delete-${index}`"
      :icon="RiCloseCircleLine"
      textual
      @click="removeBudget(budget.id)"
    />

    <span :class="$style.header">
      <TextCell
        :testId="`${testId}-budget-${index}-name`"
        :modelValue="budget.name"
        @update:model-value="setBudgetName(budget.id, $event)"
      />
    </span>

    <span
      v-for="(_, month) of budget.values"
      :key="budget.id + month"
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
      @focusin="focused = budget.id"
      @focusout="focused = undefined"
    >
      <CellMenu
        :actions="[
          { id: 'fill', label: t('feature.budgetPane.fillRow') },
          { id: 'fill-to-right', label: t('feature.budgetPane.fillRowToRight') }
        ]"
        @action="performAction($event, budget.id, month, budget.values[month])"
      >
        <CurrencyCell
          :ref="onRefCallback"
          :testId="`${testId}-budget-${index}-${month}`"
          :modelValue="budget.values[month]"
          @update:model-value="setBudget(budget.id, month, $event)"
        />
      </CellMenu>
    </span>

    <Currency :testId="`${testId}-budget-${index}-total`" :class="$style.meta" :value="sum(budget.values)" />
    <Currency :testId="`${testId}-budget-${index}-average`" :class="$style.meta" :value="average(budget.values)" />
  </template>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { CellMenuActionId } from '@components/base/cell-menu/CellMenu.types';
import CellMenu from '@components/base/cell-menu/CellMenu.vue';
import Currency from '@components/base/currency/Currency.vue';
import CurrencyCell from '@components/base/currency-cell/CurrencyCell.vue';
import { ReorderEvent } from '@components/base/draggable/Draggable.types';
import Draggable from '@components/base/draggable/Draggable.vue';
import { DraggableStore } from '@components/base/draggable/store';
import TextCell from '@components/base/text-cell/TextCell.vue';
import { useOrderedTemplateRefs } from '@composables/ordered-template-refs/useOrderedTemplateRefs.ts';
import { useStateUtils } from '@composables/state-utils/useStateUtils.ts';
import { RiCloseCircleLine } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { Budget } from '@store/state/types';
import { average, sum } from '@utils/array/array.ts';
import { computed, DeepReadonly, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  budgets: DeepReadonly<Budget[]>;
  testId: string;
  allowDelete: boolean;
}>();

const { moveBudget, getBudget, getBudgetGroup, setBudgetName, setBudget, fillBudget, removeBudget } = useDataStore();

const { isCurrentMonth } = useStateUtils();
const { t } = useI18n();
const { onRefCallback, value: currencyCells } = useOrderedTemplateRefs<InstanceType<typeof CurrencyCell>>();
const focused = ref<string>();

const buildDraggableText = (store: DraggableStore) => {
  const [srcGroup, src] = store.source ? (getBudget(store.source) ?? []) : [];
  const [dstGroup, dst] = store.target ? (getBudget(store.target) ?? []) : [];
  const otherDist = store.target ? getBudgetGroup(store.target) : undefined;

  if (src && srcGroup) {
    if (dst && dstGroup) {
      const sameGroup = srcGroup.id === dstGroup.id;
      const srcLabel = sameGroup ? src.name : `${srcGroup.name} » ${src.name}`;
      const dstLabel = sameGroup ? dst.name : `${dstGroup.name} » ${dst.name}`;

      return store.type === 'before'
        ? t('feature.budgetPane.prepend', { from: srcLabel, to: dstLabel })
        : t('feature.budgetPane.append', { from: srcLabel, to: dstLabel });
    }

    if (otherDist) {
      return t('feature.budgetPane.moveInto', { from: src.name, to: otherDist.name });
    }

    return t('feature.budgetPane.move', { from: src.name });
  }
};

const reorder = (evt: ReorderEvent) => {
  moveBudget(evt.source, evt.target, evt.type === 'after');
};

const performAction = (action: CellMenuActionId, budgetId: string, month: number, value: number) => {
  switch (action) {
    case 'fill':
      return fillBudget(budgetId, value);
    case 'fill-to-right':
      return fillBudget(budgetId, value, month);
  }
};

defineExpose({
  currencyCells: computed(() => currencyCells.map((v) => v.input).filter((v) => !!v) as HTMLInputElement[])
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
