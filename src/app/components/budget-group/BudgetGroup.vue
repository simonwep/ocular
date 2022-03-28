<template>
  <span :class="[$style.top, $style.start]" @click="open = !open">
    {{ group.name }}
  </span>

  <span v-for="(total, index) of totals" :key="index" :class="$style.top" @click="open = !open">
    <Currency :locale="locale" :value="total"/>
  </span>

  <span :class="$style.top" @click="open = !open">Total</span>
  <span :class="[$style.top, $style.end]" @click="open = !open">Average</span>

  <template v-if="open">

    <!-- Budgets -->
    <template v-for="(budget, index) of group.budgets" :key="index">
      <Button color="error" icon="trash" textual @click="remove(group.budgets, budget)"/>

      <span :class="$style.header">
      <TextInput v-model="budget.name"/>
    </span>

      <span v-for="(_, index) of budget.values" :key="budget.name + index">
      <CurrencyInput v-model="budget.values[index]"/>
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
    <Button text="Add Budget"/>
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
import {BudgetGroup} from '@state/types';
import {remove} from '@utils';
import {computed, ref} from 'vue';

const props = defineProps<{
  group: BudgetGroup;
  locale?: string;
}>();

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
  background: var(--header-background);
  color: var(--header-color);
  cursor: pointer;

  &.start {
    border-top-left-radius: var(--header-border-radius);
    border-bottom-left-radius: var(--header-border-radius);
  }

  &.end {
    border-top-right-radius: var(--header-border-radius);
    border-bottom-right-radius: var(--header-border-radius);
  }
}

</style>
