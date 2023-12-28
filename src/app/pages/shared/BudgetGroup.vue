<template>
  <!-- Header -->
  <Button color="dimmed" icon="close-circle" textual @click="removeBudgetGroup(group.id)" />

  <TextCell
    :class="[$style.top, $style.start]"
    :model-value="group.name"
    inline
    @update:model-value="setBudgetGroupName(group.id, $event)"
  />

  <span v-for="(total, index) of totals" :key="index" :class="$style.top">
    <Currency :value="total" />
  </span>

  <span :class="$style.top">
    <span>{{ t('shared.total') }}</span>
  </span>

  <span :class="[$style.top, $style.end]">
    <span>{{ t('shared.average') }}</span>
  </span>

  <!-- Budgets -->
  <template v-for="(budget, index) of group.budgets" :key="budget.id + index">
    <Draggable
      :id="budget.id"
      :target="['budget-group', 'budget-groups']"
      name="budget-group"
      :text="buildDraggableText"
      @drop="reorder"
    />

    <Button color="dimmed" icon="close-circle" textual @click="removeBudget(budget.id)" />

    <span :class="$style.header">
      <TextCell :model-value="budget.name" @update:model-value="setBudgetName(budget.id, $event)" />
    </span>

    <span
      v-for="(_, month) of budget.values"
      :key="budget.id + month"
      :class="[
        $style.currencyCell,
        {
          [$style.even]: index % 2,
          [$style.firstRow]: index === 0,
          [$style.firstColumn]: month === 0,
          [$style.currentMonth]: isCurrentMonth(month),
          [$style.tlc]: index === 0 && month === 0,
          [$style.trc]: index === 0 && month === 11,
          [$style.blc]: index === group.budgets.length - 1 && month === 0,
          [$style.brc]: index === group.budgets.length - 1 && month === 11
        }
      ]"
    >
      <CurrencyCell :model-value="budget.values[month]" @update:model-value="setBudget(budget.id, month, $event)" />
    </span>

    <Currency :class="$style.meta" :value="sum(budget.values)" />
    <Currency :class="$style.meta" :value="average(budget.values)" />
  </template>

  <!-- Footer -->
  <span />
  <Button icon="plus" :class="$style.addBudgetBtn" textual color="success" @click="addBudget(group.id)" />
  <span style="grid-column: 3 / 16" />
  <Currency :class="[$style.meta, $style.bold]" :value="totalAmount" />
  <Currency :class="[$style.meta, $style.bold]" :value="averageAmount" />
</template>

<script lang="ts" setup>
import { computed, DeepReadonly } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import Currency from '@components/base/currency/Currency.vue';
import CurrencyCell from '@components/base/currency-cell/CurrencyCell.vue';
import { ReorderEvent } from '@components/base/draggable/Draggable.types';
import Draggable from '@components/base/draggable/Draggable.vue';
import { DraggableStore } from '@components/base/draggable/store';
import TextCell from '@components/base/text-cell/TextCell.vue';
import { useDataStore } from '@store/state';
import { BudgetGroup } from '@store/state/types';
import { average, sum } from '@utils';

const props = defineProps<{
  group: DeepReadonly<BudgetGroup>;
}>();

const {
  moveBudget,
  removeBudgetGroup,
  getBudget,
  getBudgetGroup,
  addBudget,
  setBudgetName,
  setBudgetGroupName,
  setBudget,
  removeBudget,
  isCurrentMonth
} = useDataStore();

const { t } = useI18n();

const totals = computed(() => {
  const totals: number[] = new Array(12).fill(0);

  for (const { values } of props.group.budgets) {
    for (let i = 0; i < values.length; i++) {
      totals[i] += values[i];
    }
  }

  return totals;
});

const totalAmount = computed(() => sum(totals.value));
const averageAmount = computed(() => average(totals.value));

const buildDraggableText = (store: DraggableStore) => {
  const [srcGroup, src] = store.source ? getBudget(store.source) ?? [] : [];
  const [dstGroup, dst] = store.target ? getBudget(store.target) ?? [] : [];
  const otherDist = store.target ? getBudgetGroup(store.target) : undefined;

  if (src && srcGroup) {
    if (dst && dstGroup) {
      const sameGroup = srcGroup.id === dstGroup.id;
      const srcLabel = sameGroup ? src.name : `${srcGroup.name} » ${src.name}`;
      const dstLabel = sameGroup ? dst.name : `${dstGroup.name} » ${dst.name}`;

      return store.type === 'before'
        ? t('shared.prepend', { from: srcLabel, to: dstLabel })
        : t('shared.append', { from: srcLabel, to: dstLabel });
    }

    if (otherDist) {
      return t('shared.moveInto', { from: src.name, to: otherDist.name });
    }

    return t('shared.move', { from: src.name });
  }
};

const reorder = (evt: ReorderEvent) => {
  moveBudget(evt.source, evt.target, evt.type === 'after');
};
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
  padding: 0 10px;

  &.bold {
    position: relative;
    font-weight: var(--font-weight-l);
    text-decoration: underline;
  }
}

.top {
  display: inline-block;
  font-size: var(--input-field-font-size);
  font-weight: var(--font-weight-l);
  margin: 4px 0;
  padding: 5px 0;
  background: var(--grid-header-background);
  color: var(--grid-header-text);

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

.currencyCell {
  background: var(--grid-background-odd);
  height: 100%;
  border-right: 1px solid var(--grid-border-color);
  border-bottom: 1px solid var(--grid-border-color);
  transition: all var(--input-field-transition);
  box-shadow: inset 0 0 0 1px transparent;

  &.firstRow {
    border-top: 1px solid var(--grid-border-color);
  }

  &.firstColumn {
    border-left: 1px solid var(--grid-border-color);
  }

  &.currentMonth {
    background: var(--grid-background-odd-active);
  }

  &.even {
    background: var(--grid-background-even);

    &.currentMonth {
      background: var(--grid-background-even-active);
    }
  }

  &.tlc {
    border-top-left-radius: var(--grid-border-radius);
  }

  &.trc {
    border-top-right-radius: var(--grid-border-radius);
  }

  &.blc {
    border-bottom-left-radius: var(--grid-border-radius);
  }

  &.brc {
    border-bottom-right-radius: var(--grid-border-radius);
  }
}
</style>
