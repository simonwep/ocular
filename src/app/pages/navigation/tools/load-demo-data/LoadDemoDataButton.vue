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
import { useDemoData } from '@store/state/template/useDemoData.ts';
import { RiMagicLine } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';

const { loadDemoData } = useDemoData();
const { t } = useI18n();
</script>
