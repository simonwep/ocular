<template>
  <Dialog :title="t('navigation.admin.manageUsers')" :open="open" @close="emit('close')">
    <ul v-if="users.length" :class="$style.list">
      <li v-for="usr of users" :key="usr.name" :class="$style.item">
        <span :class="$style.name">{{ usr.name }}</span>
        <Button
          :color="usr.admin ? 'success' : 'dimmed'"
          textual
          :icon="RiShieldUserLine"
          @click="toggleAdmin(usr, !usr.admin)"
        />
        <Button color="danger" textual :icon="RiCloseCircleLine" @click="removeUser(usr)" />
      </li>
    </ul>
    <p v-else :class="$style.placeholder">{{ t('navigation.admin.noUsersFound') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import { RiCloseCircleLine, RiShieldUserLine } from '@remixicon/vue';
import { GenesisUser } from '@storage/createGenesisStore';
import { useStorage } from '@storage/index';
import { ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
const { user, getAllUsers, updateUser, deleteUser } = useStorage();

const users = ref<GenesisUser[]>([]);

const toggleAdmin = async (user: GenesisUser, admin: boolean) => {
  await updateUser(user.name, { ...user, admin });
  await fetchUsers();
};

const removeUser = async (user: GenesisUser) => {
  if (window.confirm(t('navigation.admin.deleteUserConfirmation', { name: user.name }))) {
    await deleteUser(user.name);
    await fetchUsers();
  }
};

const fetchUsers = async () => (users.value = await getAllUsers());

watch([user, toRef(props, 'open')], ([user]) => user?.admin && void fetchUsers(), { immediate: true });
</script>

<style lang="scss" module>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none outside none;
  gap: 2px;
  margin: 0;
  max-height: 225px;
  overflow-y: auto;
  overflow-x: hidden;
}

.item {
  width: 100%;
  display: flex;
  align-items: center;
  min-width: 175px;
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-s);

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

.placeholder {
  text-align: center;
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
  color: var(--c-dimmed);
}
</style>
