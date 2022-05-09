<template>
  <BudgetPane :title="t('dashboard.expenses')" type="expenses" />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import BudgetPane from '../shared/pane/BudgetPane.vue';

const { t } = useI18n();
</script>
