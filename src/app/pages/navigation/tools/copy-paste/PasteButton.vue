<template>
  <ContextMenuButton
    v-if="state.clipboard && state.clipboard.year !== state.activeYear"
    :text="t('navigation.tools.copyPaste.paste', { from, to })"
    :icon="RiClipboardLine"
    testId="paste-data"
    @click="paste"
  />
</template>

<script lang="ts" setup>
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiClipboardLine } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { pasteYear, state } = useDataStore();
const { t } = useI18n();

const from = computed(() => state.clipboard?.year);
const to = computed(() => state.activeYear);

const paste = () => {
  if (window.confirm(t('navigation.tools.copyPaste.confirm', { from: from.value, to: to.value }))) {
    pasteYear();
  }
};
</script>
