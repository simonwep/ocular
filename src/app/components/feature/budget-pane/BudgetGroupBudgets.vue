<template>
  <template v-for="(budget, index) of budgets" :key="budget.id + index">
    <div v-if="dropLine?.target === budget.id && dropLine.type === 'before'" :class="$style.reOrderLine" />

    <Draggable
      :id="budget.id"
      :testId="`${testId}-budget-${index}-dragger`"
      :target="['budget-group']"
      name="budget-group"
      :text="buildDraggableText"
      @drop="reorder"
      @dragover="(target) => (dropLine = target)"
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
        @update:modelValue="setBudgetName(budget.id, $event ?? '')"
      />
    </span>

    <BudgetGroupBudgetCell
      v-for="(_, month) of budget.values"
      :key="budget.id + month"
      :budgets="budgets"
      :budget="budget"
      :index="index"
      :month="month"
      :testId="testId"
      @cellRendered="onRefCallback"
    />

    <Currency :testId="`${testId}-budget-${index}-total`" :class="$style.meta" :value="sum(budget.values)" />
    <Currency :testId="`${testId}-budget-${index}-average`" :class="$style.meta" :value="average(budget.values)" />

    <div v-if="dropLine?.target === budget.id && dropLine.type === 'after'" :class="$style.reOrderLine" />
  </template>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import CurrencyCell from '@components/base/currency-cell/CurrencyCell.vue';
import { DropOrder, ReorderEvent } from '@components/base/draggable/Draggable.types';
import Draggable from '@components/base/draggable/Draggable.vue';
import { DraggableStore } from '@components/base/draggable/store';
import TextCell from '@components/base/text-cell/TextCell.vue';
import BudgetGroupBudgetCell from '@components/feature/budget-pane/BudgetGroupBudgetCell.vue';
import { useOrderedTemplateRefs } from '@composables/ordered-template-refs/useOrderedTemplateRefs.ts';
import { useDataStore } from '@store/state';
import { Budget } from '@store/state/types';
import { average, sum } from '@utils/array/array.ts';
import { RiCloseCircleLine } from '@remixicon/vue';
import { computed, DeepReadonly, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  budgets: DeepReadonly<Budget[]>;
  testId: string;
  allowDelete: boolean;
}>();

const { moveBudget, getBudget, getBudgetGroup, setBudgetName, removeBudget } = useDataStore();
const { onRefCallback, value: currencyCells } = useOrderedTemplateRefs<InstanceType<typeof CurrencyCell>>();
const { t } = useI18n();

const dropLine = shallowRef<{ type: DropOrder; target: string } | undefined>();

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

.reOrderLine {
  grid-column: 1 / -1;
  width: 100%;
  border-top: 2px solid var(--c-primary);
  margin-top: -1px;
  margin-bottom: -1px;
  z-index: 1;
}
</style>
