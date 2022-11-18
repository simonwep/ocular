<template>
  <ContextMenu :class="classes">
    <Button icon="settings-4-line" textual color="dimmed"></Button>

    <template #options>
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
import ExportButton from './export/ExportButton.vue';
import ImportButton from './import/ImportButton.vue';
import CopyButton from './copy-paste/CopyButton.vue';
import PasteButton from './copy-paste/PasteButton.vue';

const props = defineProps<{
  class: ClassNames;
}>();

const classes = computed(() => props.class);
</script>
