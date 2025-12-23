<template>
  <div v-if="status" :class="[$style.statusBar, $style[status.color], classes]">
    <h1 :class="$style.title">{{ status.title }}</h1>
    <button v-if="status.button && status.action" type="button" :class="$style.button" @click="status.action">
      {{ status.button }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useAppConfig } from '@composables/useAppConfig.ts';
import { useStorage } from '@storage/index.ts';
import { ClassNames } from '@utils/types.ts';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type Status = {
  title: string;
  color: 'danger' | 'warning' | 'success';
  button?: string;
  action?: () => unknown;
};

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { status: storageStatus, retry: retrySync, user } = useStorage();
const { needRefresh, updateServiceWorker } = useRegisterSW();
const appConfig = useAppConfig();

const demoDismissed = ref(false);

const classes = computed(() => props.class);

const status = computed((): Status | undefined => {
  switch (storageStatus.value) {
    case 'error':
      return {
        color: 'danger',
        title: t('navigation.status.synchronizationFailedDueToNetworkError'),
        button: t('navigation.status.retrySynchronization'),
        action: retrySync
      };
    case 'retrying': {
      return {
        color: 'danger',
        title: t('navigation.status.retryingPleaseWait')
      };
    }
  }

  if (needRefresh.value) {
    return {
      color: 'success',
      title: t('navigation.status.newVersionAvailable'),
      button: t('navigation.update.updateApp'),
      action: () => updateServiceWorker(true)
    };
  }

  if (appConfig.value?.demo && !user.value && !demoDismissed.value) {
    return {
      color: 'warning',
      title: t('navigation.status.demoVersionInfo'),
      button: t('navigation.status.dismiss'),
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
