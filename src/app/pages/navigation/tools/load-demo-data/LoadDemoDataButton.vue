<template>
  <ContextMenuButton
    testId="load-demo-data"
    :text="t('navigation.tools.demo.loadDemoData')"
    :icon="RiMagicLine"
    @click="loadTemplateData('demo')"
  />
</template>

<script lang="ts" setup>
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { useTemplateData } from '@store/state/template/useTemplateData.ts';
import { RiMagicLine } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';

const { loadTemplateData } = useTemplateData();
const { t } = useI18n();
</script>
