<template>
  <ContextMenuButton :class="classes" :text="t('data.export.export')" icon="download-cloud-2-line" @click="save" />
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/state';
import { ClassNames, saveFile } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const { serialize } = useDataStore();
const { t } = useI18n();

const save = () => {
  saveFile(serialize(), `${t('data.export.fileName')}.json`, 'application/json');
};
</script>
