<template>
  <ContextMenuButton
    testId="load-demo-data"
    :text="t('navigation.tools.demo.loadDemoData')"
    :icon="RiMagicLine"
    @click="loadDemoData"
  />
</template>

<script lang="ts" setup>
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiMagicLine } from '@remixicon/vue';
import { useStorage } from '@storage/index.ts';
import { useDataStore } from '@store/state';
import { DataStateV3 } from '@store/state/types';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { deserialize } = useDataStore();
const { status } = useStorage();
const { t } = useI18n();

const loading = ref(false);

const loadDemoData = async () => {
  if (loading.value || status.value !== 'idle') {
    return;
  }

  // Go to dashboard because overriding the placeholder data takes a while due
  // to the large amount of groups and categories.
  await router.push('/');

  loading.value = true;
  const { default: data } = await import('./DemoData.json');

  // Adjust years to match the current year
  const year = new Date().getFullYear();
  for (let i = 0; i < data.years.length; i++) {
    data.years[i].year = year - 1 + i;
  }

  await deserialize(data as DataStateV3);
  loading.value = false;
};

onMounted(() => {
  if (location.hash === '#demo') {
    loadDemoData();
  }
});
</script>
