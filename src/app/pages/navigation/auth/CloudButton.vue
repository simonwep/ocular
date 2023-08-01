<template>
  <Button :class="classes" textual :color="color" :icon="icon" @click="auth" />
  <LoginDialog :open="showLoginDialog" @close="showLoginDialog = false" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { Color } from '@composables';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils';
import LoginDialog from './LoginDialog.vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const { status, logout } = useStorage();
const showLoginDialog = ref(false);

const classes = computed(() => props.class);

const icon = computed((): AppIcon => {
  switch (status.value) {
    case 'syncing':
      return 'refresh-line';
    case 'idle':
      return 'cloud-off-line';
  }

  return 'cloud-line';
});

const color = computed((): Color => {
  switch (status.value) {
    case 'authenticated':
      return 'success';
    case 'loading':
      return 'warning';
    case 'idle':
      return 'danger';
    case 'syncing':
      return 'primary';
  }

  return 'danger';
});

const auth = () => {
  if (status.value === 'idle') {
    showLoginDialog.value = true;
  } else {
    logout();
  }
};
</script>
