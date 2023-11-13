<template>
  <Dialog :open="open" :title="t('app.about')" @close="emit('close')">
    <div :class="$style.infoBox">
      <span :class="$style.link">
        <i18n-t keypath="app.github">
          <template #link>
            <Link :custom="false" color="primary" to="https://github.com/simonwep/ocular">Github</Link>
          </template>
        </i18n-t>
      </span>
      <span :class="$style.love">{{ t('app.madeWithLove') }}</span>
      <span :class="$style.meta">
        {{ OCULAR_BUILD_VERSION }} / {{ new Date(OCULAR_BUILD_TIMESTAMP).toDateString() }} / {{ OCULAR_BUILD_SHA }}
      </span>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Dialog from '@components/base/dialog/Dialog.vue';
import Link from '@components/base/link/Link.vue';

const { OCULAR_BUILD_SHA, OCULAR_BUILD_TIMESTAMP, OCULAR_BUILD_VERSION } = import.meta.env;

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
</script>

<style lang="scss" module>
.infoBox {
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-s);
  text-align: center;
  gap: 2px;
}

.link {
  margin-top: 8px;
}

.love {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-l);
  margin-top: 8px;
}

.meta {
  font-size: var(--font-size-xs);
  text-align: center;
}
</style>
