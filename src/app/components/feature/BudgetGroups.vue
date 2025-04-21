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
      :data-testid="`month-${index}-name`"
      :class="[
        $style.month,
        {
          [$style.current]: isCurrentMonth(index),
          [$style.start]: index === 0,
          [$style.end]: index === 11
        }
      ]"
    >
      <span>{{ month }}</span>
    </span>
    <span />
    <span />

    <!-- Sums -->
    <span />
    <Button
      :color="allowDelete ? 'danger' : 'success'"
      :icon="allowDelete ? RiLockUnlockLine : RiLockLine"
      textual
      @click="allowDelete = !allowDelete"
    />
    <span :class="[$style.sum, $style.totals]">{{ t('shared.totals') }}</span>
    <Currency
      v-for="(sum, index) of totals"
      :key="index"
      :testId="`month-${index}-total`"
      :value="sum"
      :class="$style.sum"
    />
    <span />
    <span />

    <!-- Body -->
    <template v-for="(group, index) of groups" :key="group.id">
      <Draggable
        :id="group.id"
        :icon="buildDraggableIcon"
        :text="buildDraggableText"
        name="budget-groups"
        @drop="reorder"
      />
      <BudgetGroup :allowDelete="allowDelete" :group="group" :testId="`group-${index}`" />
    </template>

    <!-- Footer -->
    <span />
    <Button
      :class="$style.addGroupBtn"
      size="s"
      :icon="RiAddCircleLine"
      :text="t('shared.addGroup')"
      @click="addBudgetGroup(type)"
    />
  </div>
</template>

<script lang="ts" setup>
import BudgetGroup from './BudgetGroup.vue';
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import { ReorderEvent } from '@components/base/draggable/Draggable.types';
import Draggable from '@components/base/draggable/Draggable.vue';
import { DraggableStore } from '@components/base/draggable/store';
import { useMonthNames, useStateUtils } from '@composables';
import { RiAddCircleLine, RiLockLine, RiLockUnlockLine, RiSkipDownLine } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Component } from 'vue';

const props = defineProps<{
  type: 'expenses' | 'income';
}>();

const months = useMonthNames('long', () => settings.general.monthOffset);
const { isCurrentMonth } = useStateUtils();
const { state, moveBudgetGroup, moveBudgetIntoGroup, addBudgetGroup, getBudgetGroup } = useDataStore();
const { state: settings } = useSettingsStore();
const { t } = useI18n();

const allowDelete = ref(false);

const groups = computed(() => state[props.type]);

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

const buildDraggableIcon = (store: DraggableStore): Component | undefined =>
  store.group === 'budget-group' ? RiSkipDownLine : undefined;

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
@use '@styles/globals.scss';

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

  &.totals {
    margin-left: 5px;
  }
}

.month {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-m);
  padding-right: 20px;
  padding-bottom: 5px;

  position: sticky;
  position: -webkit-sticky;
  top: 0;
  background: var(--app-background);
  border: 2px var(--app-background);

  &.current > span {
    color: var(--c-text-light);
    display: inline-block;
    position: relative;
    z-index: 0;

    &::before {
      content: '';
      position: absolute;
      inset: -3px -8px;
      border-radius: 100px;
      background: var(--c-primary);
      z-index: -1;
    }
  }

  > span {
    display: inline-block;

    @include globals.onMobileDevices {
      position: static;
      margin-top: 0;
    }
  }

  &.start {
    border-bottom-left-radius: var(--border-radius-l);
    padding-left: 8px;
  }

  &.end {
    border-bottom-right-radius: var(--border-radius-l);
    padding-right: 8px;
  }
}

.addGroupBtn {
  margin-top: 20px;
  grid-area: auto / 2 / auto / 4;
}
</style>
