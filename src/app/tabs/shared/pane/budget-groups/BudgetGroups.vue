<template>
  <div :class="$style.budgetGroups">
    <!-- Header -->
    <span />
    <span />
    <span />

    <!-- Months -->
    <span v-for="month of months" :key="month" :class="$style.month">
      {{ month }}
    </span>
    <span />
    <span />
    <span />
    <span />

    <!-- Sums -->
    <span :class="$style.sum">Totals</span>
    <span v-for="(sum, index) of totals" :key="index" :class="$style.sum">
      <Currency :currency="state.unit" :locale="state.locale" :value="sum" />
    </span>
    <span />
    <span />

    <!-- Body -->
    <template v-for="group of groups" :key="group.id">
      <Button
        color="dimmed"
        icon="close-circle"
        textual
        @click="removeBudgetGroup(group.id)"
      />
      <BudgetGroup :group="group" />
    </template>

    <!-- Footer -->
    <span />
    <span />
    <Button
      :class="$style.addGroupBtn"
      icon="plus"
      text="Add Group"
      @click="addBudgetGroup(type)"
    />
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
import { computed } from 'vue';
import { useDataStore } from '@store/data';
import BudgetGroup from '../budget-group/BudgetGroup.vue';

const props = defineProps<{
  type: 'expenses' | 'income';
}>();

const { state, addBudgetGroup, removeBudgetGroup } = useDataStore();
const groups = computed(() => state[props.type]);

const months = computed(() => {
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    months.push(
      new Date(0, i).toLocaleDateString(state.locale, {
        month: 'long',
      })
    );
  }

  return months;
});

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
.budgetGroups {
  display: grid;
  grid-template: auto / max-content max-content max-content repeat(12, 1fr) max-content max-content;
  align-items: center;

  > * {
    padding: 6px 10px;
  }
}

.sum {
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-l);
}

.month {
  font-size: var(--font-size-xxs);
  font-weight: var(--font-weight-m);
}

.addGroupBtn {
  margin-top: 6px;
}
</style>
