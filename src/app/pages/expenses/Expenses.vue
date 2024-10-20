<template>
  <BudgetPane type="expenses">
    <template #title>
      <YearToggle key-path="page.expenses.expensesFor" />
    </template>
  </BudgetPane>
</template>

<script lang="ts" setup>
import BudgetPane from '@components/feature/BudgetPane.vue';
import YearToggle from '@components/feature/YearToggle.vue';
</script>
