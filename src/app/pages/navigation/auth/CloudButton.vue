<template>
  <Button :class="classes" textual :color="color" :icon="icon" @click="auth" />
  <LoginDialog :open="showLoginDialog" @close="showLoginDialog = false" />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { Color } from '@composables';
import { RiCloudLine, RiCloudOffLine, RiRefreshLine } from '@remixicon/vue';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils';
import { computed, ref } from 'vue';
import LoginDialog from './LoginDialog.vue';
import type { Component } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const { status, logout } = useStorage();
const showLoginDialog = ref(false);

const classes = computed(() => props.class);

const icon = computed((): Component => {
  switch (status.value) {
    case 'syncing':
      return RiRefreshLine;
    case 'idle':
      return RiCloudOffLine;
  }

  return RiCloudLine;
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
