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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

type Status = {
  title: string;
  color: 'danger' | 'warning';
  button?: string;
  action?: () => unknown;
};

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { status: storageStatus, retry: retrySync, user } = useStorage();
const appConfig = useAppConfig();

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

  if (appConfig.value?.demo && !user.value) {
    return {
      color: 'warning',
      title: t('navigation.status.demoVersionInfo')
    };
  }

  return undefined;
});
</script>

<style lang="scss" module>
.statusBar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  gap: 4px;

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
}

.button {
  all: unset;
  text-decoration: underline;
  cursor: pointer;
}

.title,
.button {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-l);
}
</style>
