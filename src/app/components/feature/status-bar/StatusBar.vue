<template>
  <div v-if="status" :class="[$style.statusBar, $style[status.color], classes]">
    <h1 :class="$style.title">{{ status.title }}</h1>
    <button v-if="status.button && status.action" type="button" :class="$style.button" @click="status.action">
      {{ status.button }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@storage/index.ts';
import { ClassNames } from '@utils/types.ts';
import { useLocalStorage } from '@vueuse/core';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

type Status = {
  title: string;
  color: 'danger' | 'warning' | 'success' | 'primary';
  button?: string;
  action?: () => unknown;
};

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { status: storageStatus, retry: retrySync } = useStorage();
const { needRefresh, updateServiceWorker } = useRegisterSW();

const demoDismissed = useLocalStorage('status-bar/demo-version-dismissed', false);

const classes = computed(() => props.class);

const status = computed((): Status | undefined => {
  switch (storageStatus.value) {
    case 'error':
      return {
        color: 'danger',
        title: t('feature.statusBar.synchronizationFailedDueToNetworkError'),
        button: t('feature.statusBar.retrySynchronization'),
        action: retrySync
      };
    case 'retrying': {
      return {
        color: 'danger',
        title: t('feature.statusBar.retryingPleaseWait')
      };
    }
  }

  if (needRefresh.value) {
    return {
      color: 'success',
      title: t('feature.statusBar.newVersionAvailable'),
      button: t('navigation.update.updateApp'),
      action: () => updateServiceWorker(true)
    };
  }

  if (!import.meta.env.OCULAR_GENESIS_HOST && !demoDismissed.value) {
    return {
      color: 'primary',
      title: t('feature.statusBar.noBackendAttached'),
      button: t('feature.statusBar.dismiss'),
      action: () => (demoDismissed.value = true)
    };
  }

  return undefined;
});
</script>

<style lang="scss" module>
.statusBar {
  text-align: center;
  padding: 4px;
  gap: 4px;
  text-shadow: 0 1px 1px rgba(black, 0.5);

  &.danger {
    color: var(--c-danger-text);
    background: repeating-linear-gradient(
      -45deg,
      var(--c-danger),
      var(--c-danger) 10px,
      var(--c-danger-hover) 10px,
      var(--c-danger-hover) 20px
    );
  }

  &.warning {
    color: var(--c-warning-text);
    background: repeating-linear-gradient(
      -45deg,
      var(--c-warning),
      var(--c-warning) 10px,
      var(--c-warning-hover) 10px,
      var(--c-warning-hover) 20px
    );
  }

  &.success {
    color: var(--c-success-text);
    background: repeating-linear-gradient(
      -45deg,
      var(--c-success),
      var(--c-success) 10px,
      var(--c-success-hover) 10px,
      var(--c-success-hover) 20px
    );
  }

  &.primary {
    color: var(--c-primary-text);
    background: repeating-linear-gradient(
      -45deg,
      var(--c-primary),
      var(--c-primary) 10px,
      var(--c-primary-hover) 10px,
      var(--c-primary-hover) 20px
    );
  }
}

.button {
  all: unset;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 4px;
}

.title,
.button {
  display: inline;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-l);
}
</style>
