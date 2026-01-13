<template>
  <Button
    :class="classes"
    testId="navigation-cloud"
    :data="{ status: status }"
    textual
    :disabled="!OCULAR_GENESIS_HOST"
    :color="icon[0]"
    :tooltip="OCULAR_GENESIS_HOST ? undefined : t('navigation.auth.loginNotAvailable')"
    :icon="icon[1]"
    @click="auth"
  />
  <LoginDialog :lockDialog="FORCE_DIALOG && !user" :open="showLoginDialog" @close="showLoginDialog = false" />
</template>

<script lang="ts" setup>
import LoginDialog from './LoginDialog.vue';
import Button from '@components/base/button/Button.vue';
import { Color } from '@composables/theme-styles/useThemeStyles.ts';
import { useStorage } from '@store/storage/useStorage.ts';
import { ClassNames } from '@utils/types.ts';
import { RiCloudLine, RiCloudOffLine, RiRefreshLine, RiSignalWifiErrorLine } from '@remixicon/vue';
import { watchImmediate } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import type { Component } from 'vue';

const { OCULAR_GENESIS_HOST, OCULAR_HYBRID_MODE } = import.meta.env;

const FORCE_DIALOG = !OCULAR_HYBRID_MODE && !!OCULAR_GENESIS_HOST;

const props = defineProps<{
  class?: ClassNames;
}>();

const { status, logout, user } = useStorage();
const { t } = useI18n();
const router = useRouter();

const showLoginDialog = ref(FORCE_DIALOG);

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
  if (FORCE_DIALOG) {
    showLoginDialog.value = !value;
  }
});
</script>
