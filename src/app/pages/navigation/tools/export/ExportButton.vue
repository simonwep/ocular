<template>
  <ContextMenuButton :text="t('navigation.tools.export.export')" :icon="RiDownloadCloud2Line" @click="save" />
</template>

<script lang="ts" setup>
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiDownloadCloud2Line } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { downloadFile } from '@utils';
import { useI18n } from 'vue-i18n';

const { serialize } = useDataStore();
const { t } = useI18n();

const save = () => {
  downloadFile(serialize(), 'ocular-data.json', 'application/json');
};
</script>
