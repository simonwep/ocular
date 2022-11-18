<template>
  <ContextMenuButton :text="t('data.export.export')" icon="download-cloud-2-line" @click="save" />
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/state';
import { saveFile } from '@utils';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';

const { serialize } = useDataStore();
const { t } = useI18n();

const save = () => {
  saveFile(serialize(), `${t('data.export.fileName')}.json`, 'application/json');
};
</script>
