<template>
  <span v-if="settingsState.appearance.mode === 'privacy'" :class="$style.container">
    {{ n(value ?? 0, { key: 'currency', currency: dataState.currency }) }}
    <span :class="$style.overlay" />
  </span>
  <template v-else>
    {{ n(value ?? 0, { key: 'currency', currency: dataState.currency }) }}
  </template>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useDataStore } from '@store/state';
import { useSettingsStore } from '@store/settings';

const { n } = useI18n();
const { state: dataState } = useDataStore();
const { state: settingsState } = useSettingsStore();

defineProps<{
  value?: number;
  locale?: string;
}>();
</script>

<style lang="scss" module>
.container {
  display: inline-block;
  position: relative;
  filter: blur(5px) opacity(0.85);
  transition: all var(--transition-m);

  &:hover {
    filter: none;
  }
}
</style>
