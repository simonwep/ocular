<template>
  <ContextMenuButton :text="t('navigation.tools.export.export')" :icon="RiDownloadCloud2Line" @click="save" />
</template>

<script lang="ts" setup>
import { RiDownloadCloud2Line } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { useDataStore } from '@store/state';
import { downloadFile } from '@utils';

const { serialize } = useDataStore();
const { t } = useI18n();

const save = () => {
  downloadFile(serialize(), 'ocular-data.json', 'application/json');
};
</script>
