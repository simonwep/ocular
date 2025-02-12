<template>
  <ContextMenuButton
    :text="t('navigation.admin.manageUsers')"
    :icon="RiUserSettingsLine"
    @click="showManageUserModal = !showManageUserModal"
  />
  <ManageUsersModal :open="showManageUserModal" @close="showManageUserModal = false" />
</template>

<script lang="ts" setup>
import ManageUsersModal from './ManageUsersModal.vue';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiUserSettingsLine } from '@remixicon/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const showManageUserModal = ref(false);
</script>
