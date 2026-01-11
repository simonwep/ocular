<template>
  <!-- Header -->
  <span ref="budgetHeader" style="grid-column: 1 / -1" />

  <Draggable
    :id="group.id"
    :icon="buildDraggableIcon"
    :text="buildDraggableText"
    :testId="`group-${index}-dragger`"
    name="budget-groups"
    @drop="reorder"
  />

  <Button
    color="dimmed"
    :testId="`${testId}-delete`"
    :disabled="!allowDelete"
    :icon="RiCloseCircleLine"
    textual
    @click="removeBudgetGroup(group.id)"
  />

  <span :class="[$style.groupName, $style.top, $style.start]">
    <TextCell
      :modelValue="group.name"
      :testId="`${testId}-name`"
      inline
      @update:modelValue="setBudgetGroupName(group.id, $event ?? '')"
    />
    <button
      :data-testid="`${testId}-collapse`"
      :class="$style.toggle"
      type="button"
      @click="toggleBudgetGroupCollapse(group.id)"
    >
      <RiEyeLine v-if="group.collapsed" size="15" />
      <RiEyeCloseLine v-else size="15" />
    </button>
  </span>

  <span v-for="(total, idx) of totals" :key="idx" :class="$style.top">
    <Currency :value="total" :testId="`${testId}-month-${idx}-total`" />
  </span>

  <span :class="$style.top">
    <span>{{ t('feature.budgetPane.total') }}</span>
  </span>

  <span :class="[$style.top, $style.end]">
    <span>{{ t('feature.budgetPane.average') }}</span>
  </span>

  <template v-if="!budgetGroupBudgetsVisible">
    <!-- Skeletons -->
    <span v-for="n of group.budgets.length + 1" :key="n" style="grid-column: 1 / -1" :class="$style.skeleton" />
  </template>

  <template v-else-if="!group.collapsed">
    <!-- Budgets -->
    <BudgetGroupBudgets ref="budgetGroupBudgets" :budgets="group.budgets" :testId="testId" :allowDelete="allowDelete" />

    <!-- Footer -->
    <span />
    <Button :icon="RiAddCircleLine" textual @click="addBudget(group.id, t('feature.budgetGroup.newCategory'))" />
    <span style="grid-column: 3 / 16" />
    <Currency :testId="`${testId}-total`" :class="[$style.meta, $style.bold]" :value="totalAmount" />
    <Currency :testId="`${testId}-average`" :class="[$style.meta, $style.bold]" :value="averageAmount" />
  </template>

  <span v-else :data-testid="`${testId}-placeholder`" :class="$style.collapsedPlaceholder">
    {{ t('feature.budgetGroup.budgetGroupsHidden', group.budgets.length) }}
  </span>

  <span ref="budgetFooter" style="grid-column: 1 / -1" />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import { ReorderEvent } from '@components/base/draggable/Draggable.types.ts';
import Draggable from '@components/base/draggable/Draggable.vue';
import { DraggableStore } from '@components/base/draggable/store.ts';
import TextCell from '@components/base/text-cell/TextCell.vue';
import BudgetGroupBudgets from '@components/feature/budget-pane/BudgetGroupBudgets.vue';
import { useDataStore } from '@store/state';
import { BudgetGroup } from '@store/state/types';
import { average, sum } from '@utils/array/array.ts';
import { RiAddCircleLine, RiCloseCircleLine, RiEyeCloseLine, RiEyeLine, RiSkipDownLine } from '@remixicon/vue';
import { useElementVisibility } from '@vueuse/core';
import { type Component, computed, DeepReadonly, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  visible: [];
  hidden: [];
}>();

const props = defineProps<{
  group: DeepReadonly<BudgetGroup>;
  index: number;
  testId: string;
  allowDelete: boolean;
}>();

const {
  removeBudgetGroup,
  toggleBudgetGroupCollapse,
  getBudgetGroup,
  moveBudgetGroup,
  moveBudgetIntoGroup,
  addBudget,
  setBudgetGroupName
} = useDataStore();

const { t } = useI18n();
const budgetGroupBudgets = useTemplateRef('budgetGroupBudgets');
const budgetHeader = useTemplateRef('budgetHeader');
const budgetFooter = useTemplateRef('budgetFooter');

const budgetHeaderVisible = useElementVisibility(budgetHeader);
const budgetFooterVisible = useElementVisibility(budgetFooter);

const budgetGroupBudgetsVisible = computed(() => budgetHeaderVisible.value || budgetFooterVisible.value);

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

const buildDraggableIcon = (store: DraggableStore): Component | undefined =>
  store.group === 'budget-group' ? RiSkipDownLine : undefined;

const buildDraggableText = (store: DraggableStore) => {
  const src = store.source ? getBudgetGroup(store.source) : undefined;
  const dst = store.target ? getBudgetGroup(store.target) : undefined;

  if (src) {
    if (dst) {
      return store.type === 'before'
        ? t('feature.budgetPane.prepend', { from: src.name, to: dst.name })
        : t('feature.budgetPane.append', { from: src.name, to: dst.name });
    }

    return t('feature.budgetPane.move', { from: src.name });
  }
};

const reorder = (evt: ReorderEvent) => {
  if (evt.group === 'budget-group') {
    moveBudgetIntoGroup(evt.source, evt.target);
  } else {
    moveBudgetGroup(evt.source, evt.target, evt.type === 'after');
  }
};

watch(budgetGroupBudgetsVisible, (value) => (value ? emit('visible') : emit('hidden')));

defineExpose({
  currencyCells: computed(() => (budgetGroupBudgets.value?.currencyCells ?? []) as HTMLInputElement[])
});
</script>

<style lang="scss" module>
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

  &.groupName {
    display: flex;
    margin-left: 3px;

    .toggle {
      all: unset;
      display: flex;
      cursor: pointer;
    }
  }
}

.collapsedPlaceholder {
  font-size: var(--input-field-font-size);
  color: var(--c-text-dimmed);
  font-style: italic;
  grid-column: 1 / -1;
  text-align: center;
}

.skeleton {
  grid-column: 4 / -3;
  height: 16px;
  margin: 3px 0;
  background: var(--grid-background-skeleton);
  border-radius: var(--border-radius-m);
}
</style>
