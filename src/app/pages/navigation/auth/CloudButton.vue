<template>
  <Button :class="classes" textual :color="icon[0]" :icon="icon[1]" @click="auth" />
  <LoginDialog :lockDialog="!!OCULAR_GENESIS_HOST" :open="showLoginDialog" @close="showLoginDialog = false" />
</template>

<script lang="ts" setup>
import LoginDialog from './LoginDialog.vue';
import Button from '@components/base/button/Button.vue';
import { Color } from '@composables/useThemeStyles.ts';
import { RiCloudLine, RiCloudOffLine, RiRefreshLine, RiSignalWifiErrorLine } from '@remixicon/vue';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils/types.ts';
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';

const { OCULAR_GENESIS_HOST } = import.meta.env;

const props = defineProps<{
  class?: ClassNames;
}>();

const { status, logout, user } = useStorage();

const showLoginDialog = ref(!!OCULAR_GENESIS_HOST);

const classes = computed(() => props.class);

const icon = computed((): [Color, Component] => {
  if (!OCULAR_GENESIS_HOST) {
    return ['primary', RiCloudOffLine];
  }

  switch (status.value) {
    case 'idle':
      return ['danger', RiCloudOffLine];
    case 'syncing':
      return ['primary', RiRefreshLine];
    case 'retrying':
      return ['danger', RiRefreshLine];
    case 'error':
      return ['danger', RiSignalWifiErrorLine];
    case 'authenticated':
      return ['success', RiCloudLine];
  }

  return ['danger', RiCloudOffLine];
});

const auth = () => {
  if (!OCULAR_GENESIS_HOST) return;

  if (status.value === 'idle') {
    showLoginDialog.value = true;
  } else {
    logout();
  }
};

watch(user, (value) => {
  if (!value && OCULAR_GENESIS_HOST) {
    showLoginDialog.value = true;
  }
});
</script>
