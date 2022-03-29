<template>
  <div :class="$style.budgetGroups">
    <!-- Controls -->
    <span/>

    <!-- Months -->
    <span/>
    <span v-for="month of months" :key="month" :class="$style.month">{{ month }}</span>
    <span/>
    <span/>
    <span/>

    <!-- Sums -->
    <span :class="$style.sum">Totals</span>
    <span v-for="(sum, index) of totals" :key="index" :class="$style.sum">
      <Currency :locale="locale" :value="sum"/>
    </span>
    <span/>
    <span/>

    <!-- Groups -->
    <template v-for="group of groups" :key="group.name">
      <Button color="dimmed" icon="trash" textual @click="remove(props.groups, group)"/>
      <BudgetGroup :group="group" :locale="locale"/>
    </template>
  </div>
</template>

<script lang="ts" setup>
import BudgetGroup from '@components/budget-group/BudgetGroup.vue';
import Button from '@components/button/Button.vue';
import Currency from '@components/currency/Currency.vue';
import {BudgetGroups} from '@state/types';
import {remove} from '@utils';
import {computed} from 'vue';

const props = defineProps<{
  groups: BudgetGroups;
  locale?: string;
}>();

const months = computed(() => {
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    months.push(new Date(0, i).toLocaleDateString(props.locale, {
      month: 'long'
    }));
  }

  return months;
});

const totals = computed(() => {
  const totals = (new Array(12)).fill(0);

  for (const {budgets} of props.groups) {
    for (const {values} of budgets) {
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
  grid-template: auto / max-content max-content repeat(12, 1fr) max-content max-content;
  align-items: center;

  > * {
    padding: 2px 4px;
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

</style>
