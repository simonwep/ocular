<template>
  <ContextMenu
    :tooltip="t('navigation.admin.settings')"
    :position="media === 'mobile' ? 'top' : 'right-end'"
    tooltipPosition="right"
    :class="classes"
  >
    <template #default="{ toggle }">
      <Button :icon="RiShieldFlashLine" textual color="dimmed" @click="toggle" />
    </template>

    <template #options>
      <CreateUserButton />
      <ManageUsersButton v-if="user?.admin" />
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import CreateUserButton from './create-user/CreateUserButton.vue';
import ManageUsersButton from './manage-users/ManageUsersButton.vue';
import Button from '@components/base/button/Button.vue';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useMediaQuery } from '@composables';
import { RiShieldFlashLine } from '@remixicon/vue';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class: ClassNames;
}>();

const { t } = useI18n();
const { user } = useStorage();
const media = useMediaQuery();

const classes = computed(() => props.class);
</script>
