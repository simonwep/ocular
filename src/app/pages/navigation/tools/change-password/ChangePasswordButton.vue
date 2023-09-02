<template>
  <ContextMenuButton icon="key-2-line" :text="t('auth.changePassword')" @click="showChangePasswordDialog = true" />
  <ChangePasswordDialog :open="showChangePasswordDialog" @close="showChangePasswordDialog = false" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import ChangePasswordDialog from './ChangePasswordDialog.vue';

const { t } = useI18n();

const showChangePasswordDialog = ref(false);
</script>
