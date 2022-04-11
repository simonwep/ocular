<template>
  <Button
    :icon="open ? 'arrow-down-s-line' : 'arrow-right-s-line'"
    color="dimmed"
    textual
    @click="open = !open"
  />

  <TextInput
    :class="[$style.top, $style.start]"
    :model-value="group.name"
    inline
    @update:model-value="setBudgetGroupName(group.id, $event)"
  />

  <span v-for="(total, index) of totals" :key="index" :class="$style.top">
    <span>
      <Currency :currency="state.unit" :locale="state.locale" :value="total" />
    </span>
  </span>

  <span :class="$style.top">
    <span>Total</span>
  </span>

  <span :class="[$style.top, $style.end]">
    <span>Average</span>
  </span>

  <template v-if="open">
    <!-- Budgets -->
    <template v-for="(budget, index) of group.budgets" :key="budget.id + index">
      <span />
      <Button
        color="dimmed"
        icon="close-circle"
        textual
        @click="removeBudget(budget.id)"
      />

      <span :class="$style.header">
        <TextInput
          :model-value="budget.name"
          @update:model-value="setBudgetName(budget.id, $event)"
        />
      </span>

      <span v-for="(_, index) of budget.values" :key="budget.id + index">
        <CurrencyInput
          :currency="state.unit"
          :locale="state.locale"
          :model-value="budget.values[index]"
          @update:model-value="setBudget(budget.id, index, $event)"
        />
      </span>

      <span :class="$style.meta">
        <Currency
          :currency="state.unit"
          :locale="state.locale"
          :value="sum(budget.values)"
        />
      </span>

      <span :class="$style.meta">
        <Currency
          :currency="state.unit"
          :locale="state.locale"
          :value="average(budget.values)"
        />
      </span>
    </template>

    <!-- Add budget -->
    <span />
    <span />
    <Button
      :class="$style.addBudgetBtn"
      textual
      text="Add Budget"
      @click="addBudget(group.id)"
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
  </template>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import CurrencyInput from '@components/base/currency-input/CurrencyInput.vue';
import TextInput from '@components/base/text-input/TextInput.vue';
import { useStore } from '@state/index';
import { BudgetGroup } from '@state/types';
import { average, sum } from '@utils';
import { DeepReadonly } from '@vue/reactivity';
import { computed, ref } from 'vue';

const props = defineProps<{
  group: DeepReadonly<BudgetGroup>;
}>();

const {
  state,
  addBudget,
  setBudgetName,
  setBudgetGroupName,
  setBudget,
  removeBudget,
} = useStore();

const open = ref(false);
const totals = computed(() => {
  const totals: number[] = new Array(12).fill(0);

  for (const { values } of props.group.budgets) {
    for (let i = 0; i < values.length; i++) {
      totals[i] += values[i];
    }
  }

  return totals;
});
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
  color: var(--c-dark-text);

  > span {
    display: inline-block;
    padding: 0 4px;
  }

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
