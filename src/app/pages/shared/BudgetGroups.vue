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
    <span :class="$style.sum">{{ t('shared.totals') }}</span>
    <Currency v-for="(sum, index) of totals" :key="index" :value="sum" :class="$style.sum" />
    <span />
    <span />

    <!-- Body -->
    <template v-for="group of groups" :key="group.id">
      <Draggable
        :id="group.id"
        :icon="buildDraggableIcon"
        :text="buildDraggableText"
        name="budget-groups"
        @drop="reorder"
      />
      <BudgetGroup :group="group" />
    </template>

    <!-- Footer -->
    <span />
    <Button :class="$style.addGroupBtn" icon="plus" :text="t('shared.addGroup')" @click="addBudgetGroup(type)" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import { ReorderEvent } from '@components/base/draggable/Draggable.types';
import Draggable from '@components/base/draggable/Draggable.vue';
import { DraggableStore } from '@components/base/draggable/store';
import { AppIcon } from '@components/base/icon/Icon.types';
import { useMonthNames } from '@composables';
import { useDataStore } from '@store/state';
import BudgetGroup from './BudgetGroup.vue';

const props = defineProps<{
  type: 'expenses' | 'income';
}>();

const { state, moveBudgetGroup, moveBudgetIntoGroup, addBudgetGroup, getBudgetGroup, isCurrentMonth } = useDataStore();
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

const buildDraggableIcon = (store: DraggableStore): AppIcon | undefined => {
  return store.group === 'budget-group' ? 'skip-down-line' : undefined;
};

const buildDraggableText = (store: DraggableStore) => {
  const src = store.source ? getBudgetGroup(store.source) : undefined;
  const dst = store.target ? getBudgetGroup(store.target) : undefined;

  if (src) {
    if (dst) {
      return store.type === 'before'
        ? t('shared.prepend', { from: src.name, to: dst.name })
        : t('shared.append', { from: src.name, to: dst.name });
    }

    return t('shared.move', { from: src.name });
  }
};

const reorder = (evt: ReorderEvent) => {
  if (evt.group === 'budget-group') {
    moveBudgetIntoGroup(evt.source, evt.target);
  } else {
    moveBudgetGroup(evt.source, evt.target, evt.type === 'after');
  }
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
