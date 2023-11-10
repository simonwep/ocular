<template>
  <div :class="$style.budgetGroups">
    <!-- Header -->
    <span />
    <span />
    <span />

    <!-- Months -->
    <span
      v-for="(month, index) of months"
      :key="month"
      :class="[$style.month, { [$style.current]: isCurrentMonth(index) }]"
    >
      <span>{{ month }}</span>
    </span>
    <span />
    <span />
    <span />
    <span />

    <!-- Sums -->
    <span :class="$style.sum">{{ t('budget.totals') }}</span>
    <Currency v-for="(sum, index) of totals" :key="index" :value="sum" :class="$style.sum" />
    <span />
    <span />

    <!-- Body -->
    <template v-for="group of groups" :key="group.id">
      <Draggable :id="group.id" :text="buildDraggableText" name="budget-groups" @drop="reorder" />
      <BudgetGroup :group="group" />
    </template>

    <!-- Footer -->
    <span />
    <Button :class="$style.addGroupBtn" icon="plus" :text="t('budget.addGroup')" @click="addBudgetGroup(type)" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import { DraggableEvent, ReorderEvent } from '@components/base/draggable/Draggable.types';
import Draggable from '@components/base/draggable/Draggable.vue';
import { useMonthNames } from '@composables';
import { useDataStore } from '@store/state';
import BudgetGroup from './BudgetGroup.vue';

const props = defineProps<{
  type: 'expenses' | 'income';
}>();

const { state, moveBudgetGroup, addBudgetGroup, getBudgetGroup, isCurrentMonth } = useDataStore();
const { t } = useI18n();

const groups = computed(() => state[props.type]);
const months = useMonthNames();

const totals = computed(() => {
  const totals = new Array(12).fill(0);

  for (const { budgets } of groups.value) {
    for (const { values } of budgets) {
      for (let i = 0; i < values.length; i++) {
        totals[i] += values[i];
      }
    }
  }

  return totals;
});

const buildDraggableText = (store: DraggableEvent) => {
  const src = store.source ? getBudgetGroup(store.source) : undefined;
  const dst = store.target ? getBudgetGroup(store.target) : undefined;

  if (src) {
    if (dst) {
      return store.type === 'before'
        ? t('budget.prepend', { from: src.name, to: dst.name })
        : t('budget.append', { from: src.name, to: dst.name });
    }

    return t('budget.move', { from: src.name });
  }
};

const reorder = (evt: ReorderEvent) => {
  moveBudgetGroup(evt.source, evt.target, evt.type === 'after');
};
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.budgetGroups {
  display: grid;
  grid-template: auto / max-content max-content max-content repeat(12, 1fr) max-content max-content;
  align-items: center;
  padding-bottom: 20px;
}

.sum {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-l);
  padding-right: 10px;
  margin-bottom: 4px;
}

.month {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-m);
  padding-right: 20px;
  padding-bottom: 5px;

  &.current {
    font-weight: var(--font-weight-l);
  }

  > span {
    position: absolute;
    display: inline-block;
    margin-top: -20px;

    @include globals.onMobileDevices {
      position: static;
      margin-top: 0;
    }
  }
}

.addGroupBtn {
  margin-top: 20px;
  grid-area: auto / 2 / auto / 4;
}
</style>
