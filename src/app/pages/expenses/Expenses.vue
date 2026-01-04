<template>
  <BudgetPane type="expenses">
    <template #title>
      <UndoButton />
      <YearToggle keyPath="page.expenses.expensesFor" />
    </template>
  </BudgetPane>
</template>

<script lang="ts" setup>
import BudgetPane from '@components/feature/budget-pane/BudgetPane.vue';
import UndoButton from '@components/feature/undo-button/UndoButton.vue';
import YearToggle from '@components/feature/year-toggle/YearToggle.vue';
</script>
