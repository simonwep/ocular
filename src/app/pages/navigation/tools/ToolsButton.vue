<template>
  <ContextMenu :class="classes">
    <Button icon="settings-4-line" textual color="dimmed"></Button>

    <template #options>
      <LoadDemoDataButton v-if="state.status === 'idle'" />
      <PrivacyModeButton />
      <ExportButton />
      <ImportButton />
      <CopyButton />
      <PasteButton />
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { ClassNames } from '@utils';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import Button from '@components/base/button/Button.vue';
import LoadDemoDataButton from './demo/LoadDemoDataButton.vue';
import ExportButton from './export/ExportButton.vue';
import ImportButton from './import/ImportButton.vue';
import CopyButton from './copy-paste/CopyButton.vue';
import PasteButton from './copy-paste/PasteButton.vue';
import PrivacyModeButton from './privacy-mode-button/PrivacyModeButton.vue';
import { useStorage } from '@storage/index';

const props = defineProps<{
  class: ClassNames;
}>();

const classes = computed(() => props.class);
const { state } = useStorage();
</script>
