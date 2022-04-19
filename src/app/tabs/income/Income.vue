<template>
  <BudgetPane :title="t('dashboard.income')" type="income" />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import BudgetPane from '../shared/pane/BudgetPane.vue';

const { t } = useI18n();
</script>
