<template>
  <BudgetPane :title="t('page.income.title')" type="income" />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import BudgetPane from '../shared/BudgetPane.vue';

const { t } = useI18n();
</script>
