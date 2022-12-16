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
    <span v-for="(sum, index) of totals" :key="index" :class="$style.sum">
      <Currency :value="sum" />
    </span>
    <span />
    <span />

    <!-- Body -->
    <template v-for="group of groups" :key="group.id">
      <Button color="dimmed" icon="close-circle" textual @click="removeBudgetGroup(group.id)" />
      <BudgetGroup :group="group" />
    </template>

    <!-- Footer -->
    <span />
    <Button :class="$style.addGroupBtn" icon="plus" :text="t('budget.addGroup')" @click="addBudgetGroup(type)" />
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
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import { useMonthNames } from '@composables';
import { useDataStore } from '@store/state';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BudgetGroup from '../budget-group/BudgetGroup.vue';

const props = defineProps<{
  type: 'expenses' | 'income';
}>();

const { state, addBudgetGroup, removeBudgetGroup, isCurrentMonth } = useDataStore();
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
  font-size: var(--font-size-xxs);
  font-weight: var(--font-weight-m);
  padding-right: 20px;
  padding-bottom: 5px;

  &.current {
    color: var(--c-primary-pure);
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
