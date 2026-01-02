<template>
  <Button
    :class="classes"
    testId="navigation-cloud"
    textual
    :disabled="!OCULAR_GENESIS_HOST"
    :color="icon[0]"
    :tooltip="OCULAR_GENESIS_HOST ? undefined : t('navigation.auth.loginNotAvailable')"
    :icon="icon[1]"
    @click="auth"
  />
  <LoginDialog :lockDialog="!!OCULAR_GENESIS_HOST && !user" :open="showLoginDialog" @close="showLoginDialog = false" />
</template>

<script lang="ts" setup>
import LoginDialog from './LoginDialog.vue';
import Button from '@components/base/button/Button.vue';
import { Color } from '@composables/theme-styles/useThemeStyles.ts';
import { RiCloudLine, RiCloudOffLine, RiRefreshLine, RiSignalWifiErrorLine } from '@remixicon/vue';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils/types.ts';
import { watchImmediate } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import type { Component } from 'vue';

const { OCULAR_GENESIS_HOST } = import.meta.env;

const props = defineProps<{
  class?: ClassNames;
}>();

const { status, logout, user } = useStorage();
const { t } = useI18n();
const router = useRouter();

const showLoginDialog = ref(!!OCULAR_GENESIS_HOST);

const classes = computed(() => props.class);

const icon = computed((): [Color, Component] => {
  if (!OCULAR_GENESIS_HOST) {
    return ['dimmed', RiCloudOffLine];
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

const auth = async () => {
  if (!OCULAR_GENESIS_HOST) return;

  if (status.value === 'idle') {
    showLoginDialog.value = true;
  } else {
    logout();
    await router.push('/');
  }
};

watchImmediate(user, (value) => {
  if (OCULAR_GENESIS_HOST) {
    showLoginDialog.value = !value;
  }
});
</script>
