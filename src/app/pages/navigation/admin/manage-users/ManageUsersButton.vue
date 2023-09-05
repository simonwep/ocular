<template>
  <ContextMenuButton
    :text="t('navigation.admin.manageUsers')"
    icon="user-settings-line"
    @click="showManageUserModal = !showManageUserModal"
  />
  <ManageUsersModal :open="showManageUserModal" @close="showManageUserModal = false" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import ManageUsersModal from './ManageUsersModal.vue';

const { t } = useI18n();

const showManageUserModal = ref(false);
</script>
