<template>
  <BudgetPane type="expenses">
    <template #title>
      <YearToggle key-path="page.expenses.expensesFor" />
    </template>
  </BudgetPane>
</template>

<script lang="ts" setup>
import YearToggle from '@app/pages/shared/YearToggle.vue';
import BudgetPane from '../shared/BudgetPane.vue';
</script>
