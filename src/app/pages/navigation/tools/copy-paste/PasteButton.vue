<template>
  <ContextMenuButton
    v-if="clipboard.data.value"
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

const { clipboard, state } = useDataStore();
const { t } = useI18n();

const from = computed(() => clipboard.data.value?.year);
const to = computed(() => state.activeYear);

const paste = () => {
  if (window.confirm(t('navigation.tools.copyPaste.confirm', { from: from.value, to: to.value }))) {
    clipboard.paste();
  }
};
</script>
