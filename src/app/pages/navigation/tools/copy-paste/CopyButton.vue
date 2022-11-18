<template>
  <ContextMenuButton
    :text="
      t('data.clipboard.copy', {
        year: state.activeYear
      })
    "
    icon="clipboard-line"
    @click="clipboard.copy"
  />
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/state';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';

const { clipboard, state } = useDataStore();
const { t } = useI18n();
</script>
