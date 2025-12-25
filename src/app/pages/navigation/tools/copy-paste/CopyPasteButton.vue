<template>
  <ContextMenuButton
    :text="t('navigation.tools.copyPaste.copyPasteData')"
    testId="copy-paste-data"
    :icon="RiFileCopyLine"
    @click="showCopyPasteModal = true"
  />
  <CopyPasteModal :open="showCopyPasteModal" @close="showCopyPasteModal = false" />
</template>

<script lang="ts" setup>
import CopyPasteModal from '@app/pages/navigation/tools/copy-paste/CopyPasteModal.vue';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiFileCopyLine } from '@remixicon/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const showCopyPasteModal = ref(false);
</script>
