<template>
  <TextInput :class="[$style.top, $style.start]"
             :model-value="group.name"
             inline @update:model-value="setBudgetGroupName(group.id, $event)"/>

  <span v-for="(total, index) of totals" :key="index" :class="$style.top" @click="open = !open">
    <Currency :locale="locale" :value="total"/>
  </span>

  <span :class="$style.top" @click="open = !open">Total</span>
  <span :class="[$style.top, $style.end]" @click="open = !open">Average</span>

  <template v-if="open">

    <!-- Budgets -->
    <template v-for="(budget, index) of group.budgets" :key="budget.id + index">
      <Button color="dimmed" icon="trash" textual @click="removeBudget(budget.id)"/>

      <span :class="$style.header">
      <TextInput :model-value="budget.name"
                 @update:model-value="setBudgetName(budget.id, $event)"/>
    </span>

      <span v-for="(_, index) of budget.values" :key="budget.id">
      <CurrencyInput :model-value="budget.values[index]"
                     @update:model-value="setBudget(budget.id, index, $event)"/>
    </span>

      <span :class="$style.meta">
      <Currency :locale="locale" :value="sum(budget.values)"/>
    </span>

      <span :class="$style.meta">
      <Currency :locale="locale" :value="average(budget.values)"/>
    </span>
    </template>

    <!-- Add budget -->
    <span/>
    <Button :class="$style.addBudgetBtn" icon="plus" text="Add Budget" @click="addBudget(group.id)"/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
    <span/>
  </template>
</template>

<script lang="ts" setup>
import Button from '@components/button/Button.vue';
import CurrencyInput from '@components/currency-input/CurrencyInput.vue';
import Currency from '@components/currency/Currency.vue';
import TextInput from '@components/text-input/TextInput.vue';
import {useStore} from '@state/index';
import {BudgetGroup} from '@state/types';
import {computed, ref} from 'vue';

const props = defineProps<{
  group: BudgetGroup;
  locale?: string;
}>();

const {addBudget, setBudgetName, setBudgetGroupName, setBudget, removeBudget} = useStore();

const open = ref(false);
const totals = computed(() => {
  const totals: number[] = (new Array(12)).fill(0);

  for (const {values} of props.group.budgets) {
    for (let i = 0; i < values.length; i++) {
      totals[i] += values[i];
    }
  }

  return totals;
});

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const average = (values: number[]) => sum(values) / values.length;
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
}

.top {
  display: inline-block;
  font-size: var(--input-field-font-size);
  font-weight: var(--font-weight-l);
  margin: 8px 0;
  background: var(--c-dark);
  color: var(--c-dark-inverted);
  cursor: pointer;

  &.start {
    border-top-left-radius: var(--border-radius-m);
    border-bottom-left-radius: var(--border-radius-m);
    padding-left: 8px;
    cursor: text;
  }

  &.end {
    border-top-right-radius: var(--border-radius-m);
    border-bottom-right-radius: var(--border-radius-m);
    padding-right: 8px;
  }
}

.addBudgetBtn {
  margin-top: 8px;
}

</style>
