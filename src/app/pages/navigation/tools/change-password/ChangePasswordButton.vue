<template>
  <ContextMenuButton
    :icon="RiKey2Line"
    :text="t('navigation.tools.changePassword.change')"
    @click="showChangePasswordDialog = true"
  />
  <ChangePasswordDialog :open="showChangePasswordDialog" @close="showChangePasswordDialog = false" />
</template>

<script lang="ts" setup>
import ChangePasswordDialog from './ChangePasswordDialog.vue';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiKey2Line } from '@remixicon/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const showChangePasswordDialog = ref(false);
</script>
