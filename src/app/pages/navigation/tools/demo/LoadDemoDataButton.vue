<template>
  <ContextMenuButton :text="t('data.demo.loadDemoData')" icon="magic-line" @click="loadDemoData" />
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/state';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { onMounted, ref } from 'vue';
import { BudgetYear } from '@store/state/types';

const { setBudgetGroups } = useDataStore();
const { t } = useI18n();

const loading = ref(false);

const loadDemoData = async () => {
  if (loading.value) return;
  loading.value = true;

  const { default: data } = (await import('./DemoData.json')) as { default: BudgetYear };

  setBudgetGroups('income', data.income);
  setBudgetGroups('expenses', data.expenses);

  loading.value = false;
};

onMounted(() => {
  if (location.hash === '#demo') {
    loadDemoData();
  }
});
</script>
