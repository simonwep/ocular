<template>
  <Dialog :title="t('navigation.admin.manageUsers')" :open="open" @close="emit('close')">
    <ul :class="$style.list">
      <li v-for="usr of users" :key="usr.name" :class="$style.item">
        <span :class="$style.name">{{ usr.name }}</span>
        <Button
          :color="usr.admin ? 'success' : 'dimmed'"
          textual
          icon="shield-user-line"
          @click="toggleAdmin(usr, !usr.admin)"
        />
        <Button color="danger" textual icon="close-circle" @click="removeUser(usr)" />
      </li>
    </ul>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import { GenesisUser } from '@storage/createGenesisStore';
import { useStorage } from '@storage/index';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
const { user, getAllUsers, updateUser, deleteUser } = useStorage();

const users = ref<GenesisUser[]>([]);

const toggleAdmin = async (user: GenesisUser, admin: boolean) => {
  await updateUser(user.name, {
    ...user,
    admin
  });
};

const removeUser = async (user: GenesisUser) => {
  await deleteUser(user.name);
  await fetchUsers();
};

const fetchUsers = async () => (users.value = await getAllUsers());

watch(user, (user) => user?.admin && void fetchUsers(), { immediate: true });
</script>

<style lang="scss" module>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none outside none;
  gap: 2px;
  margin: 0;
}

.item {
  width: 100%;
  display: flex;
  align-items: center;
  min-width: 175px;

  .name {
    display: inline-block;
    margin-right: auto;
    cursor: default;
  }
}

.actions {
  width: 100%;
  display: flex;
  padding-top: 6px;
  justify-content: space-between;
}
</style>
