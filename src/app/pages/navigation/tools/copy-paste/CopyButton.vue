<template>
  <ContextMenuButton
    :text="
      t('navigation.tools.copyPaste.copy', {
        year: state.activeYear
      })
    "
    testId="copy-data"
    :icon="RiClipboardLine"
    @click="copyYear"
  />
</template>

<script lang="ts" setup>
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiClipboardLine } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { useI18n } from 'vue-i18n';

const { copyYear, state } = useDataStore();
const { t } = useI18n();
</script>
