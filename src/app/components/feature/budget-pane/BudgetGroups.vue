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
      :class="[$style.month, { [$style.current]: isCurrentMonth(index) }]"
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
      testId="toggle-allow-delete"
      textual
      @click="allowDelete = !allowDelete"
    />
    <span :class="[$style.sum, $style.totals]">{{ t('feature.budgetPane.totals') }}</span>
    <Currency
      v-for="(value, index) of totals"
      :key="index"
      :testId="`month-${index}-total`"
      :value="value"
      :class="[$style.sum, $style.totals]"
    />
    <span />
    <span />

    <!-- Body -->
    <BudgetGroup
      v-for="(group, index) of groups"
      :key="group.id"
      :ref="(value) => onRefCallback(value as InstanceType<typeof BudgetGroup>)"
      :index="index"
      :allowDelete="allowDelete"
      :group="group"
      :testId="`group-${index}`"
      @visible="visibleGroups.add(group.id)"
      @hidden="visibleGroups.delete(group.id)"
    />

    <!-- Footer -->
    <span />
    <Button
      testId="add-budget-group"
      :class="$style.addGroupBtn"
      size="s"
      :icon="RiAddCircleLine"
      :text="t('feature.budgetPane.addGroup')"
      @click="addBudgetGroup(type, t('feature.budgetPane.newGroup'))"
    />
  </div>
</template>

<script lang="ts" setup>
import BudgetGroup from './BudgetGroup.vue';
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import { useKeyboardNavigation } from '@composables/keyboard-navigation/useKeyboardNavigation.ts';
import { useOrderedTemplateRefs } from '@composables/ordered-template-refs/useOrderedTemplateRefs.ts';
import { useStateUtils } from '@composables/state-utils/useStateUtils.ts';
import { useMonthNames } from '@composables/time/useMonthNames.ts';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { RiAddCircleLine, RiLockLine, RiLockUnlockLine } from '@remixicon/vue';
import { computed, ref, shallowReactive } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  type: 'expenses' | 'income';
}>();

const months = useMonthNames('long', () => settings.general.monthOffset);
const { onRefCallback, value: budgetGroups } = useOrderedTemplateRefs<InstanceType<typeof BudgetGroup>>();
const { isCurrentMonth } = useStateUtils();
const { state, addBudgetGroup } = useDataStore();
const { state: settings } = useSettingsStore();
const { t } = useI18n();

const visibleGroups = shallowReactive(new Set<string>());
const allowDelete = ref(false);
const groups = computed(() => state[props.type]);

useKeyboardNavigation(() => ({
  inputs: budgetGroups.flatMap((v) => v.currencyCells),
  cols: 12
}));

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
  margin-left: 5px;

  &.current > span {
    background: var(--c-primary);
    color: var(--c-primary-text);
    padding: 1px 6px;
    border-radius: 100px;
  }

  > span {
    position: absolute;
    margin-top: -22px;
    z-index: 1;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-m);
  }
}

.addGroupBtn {
  margin-top: 20px;
  grid-area: auto / 2 / auto / 4;
}
</style>
