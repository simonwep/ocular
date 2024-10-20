<template>
  <BudgetPane type="income">
    <template #title>
      <YearToggle key-path="page.income.incomeFor" />
    </template>
  </BudgetPane>
</template>

<script lang="ts" setup>
import YearToggle from '@app/pages/shared/YearToggle.vue';
import BudgetPane from '../shared/BudgetPane.vue';
</script>
