<template>
  <ContextMenuButton :text="t('navigation.tools.export.export')" icon="download-cloud-2-line" @click="save" />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { useDataStore } from '@store/state';
import { saveFile } from '@utils';

const { serialize } = useDataStore();
const { t } = useI18n();

const save = () => {
  saveFile(serialize(), 'ocular-data.json', 'application/json');
};
</script>
