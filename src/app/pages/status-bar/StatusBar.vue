<template>
  <div v-if="status" :class="[$style.statusBar, classes]">
    <h1 :class="$style.title">{{ status.title }}</h1>
    <button v-if="status.button && status.action" type="button" :class="$style.button" @click="status.action">
      {{ status.button }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@storage/index.ts';
import { ClassNames } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

type Status = {
  title: string;
  button?: string;
  action?: () => unknown;
};

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { status: storageStatus, retry: retrySync } = useStorage();

const classes = computed(() => props.class);

const status = computed((): Status | undefined => {
  switch (storageStatus.value) {
    case 'error':
      return {
        title: t('navigation.status.synchronizationFailedDueToNetworkError'),
        button: t('navigation.status.retrySynchronization'),
        action: retrySync
      };
    case 'retrying': {
      return {
        title: t('navigation.status.retryingPleaseWait')
      };
    }
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
  background: var(--c-danger);
  color: var(--c-danger-text);
  gap: 4px;
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
