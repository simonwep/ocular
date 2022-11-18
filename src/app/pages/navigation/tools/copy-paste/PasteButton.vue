<template>
  <ContextMenuButton
    v-if="clipboard.data.value"
    :text="
      t('data.clipboard.paste', {
        from: clipboard.data.value?.year,
        to: state.activeYear
      })
    "
    icon="clipboard-line"
    @click="clipboard.paste"
  />
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/state';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';

const { clipboard, state } = useDataStore();
const { t } = useI18n();
</script>
