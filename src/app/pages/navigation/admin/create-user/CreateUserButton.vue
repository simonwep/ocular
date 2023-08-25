<template>
  <ContextMenuButton
    icon="user-add-line"
    :text="t('navigation.admin.createUser')"
    @click="showCreateUserDialog = true"
  />
  <CreateUserDialog :open="showCreateUserDialog" @close="showCreateUserDialog = false" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import CreateUserDialog from './CreateUserDialog.vue';

const { t } = useI18n();

const showCreateUserDialog = ref(false);
</script>
