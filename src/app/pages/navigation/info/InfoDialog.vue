<template>
  <Dialog :open="open" :title="t('navigation.info.about')" @close="emit('close')">
    <div :class="$style.infoBox">
      <span :class="$style.link">
        <i18n-t keypath="navigation.info.github" scope="global">
          <template #link>
            <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
            <Link :custom="false" color="primary" to="https://github.com/simonwep/ocular">GitHub</Link>
          </template>
          <template #donation>
            <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
            <Link :custom="false" color="primary" to="https://github.com/sponsors/simonwep">
              {{ t('navigation.info.donation') }}
            </Link>
          </template>
        </i18n-t>
      </span>
      <span :class="$style.love">{{ t('navigation.info.madeWithLove') }}</span>
      <span :class="$style.meta">
        {{
          t('navigation.info.meta', {
            version: OCULAR_BUILD_VERSION ?? 'dev',
            date: new Date(OCULAR_BUILD_TIMESTAMP).toDateString(),
            sha: OCULAR_BUILD_SHA ?? 'uncommitted'
          })
        }}
      </span>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from '@components/base/dialog/Dialog.vue';
import Link from '@components/base/link/Link.vue';
import { useI18n } from 'vue-i18n';

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
  max-width: 300px;
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
