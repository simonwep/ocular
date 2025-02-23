<template>
  <BudgetPane type="income">
    <template #title>
      <YearToggle keyPath="page.income.incomeFor" />
    </template>
  </BudgetPane>
</template>

<script lang="ts" setup>
import BudgetPane from '@components/feature/BudgetPane.vue';
import YearToggle from '@components/feature/YearToggle.vue';
</script>
