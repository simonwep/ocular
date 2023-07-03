<template>
  <span v-if="settingsState.appearance.mode === 'privacy'" :class="[$style.container, props.class]">
    {{ n(value ?? 0, { key: 'currency', currency: dataState.currency }) }}
    <span :class="$style.overlay" />
  </span>
  <span v-else :class="props.class">
    {{ n(value ?? 0, { key: 'currency', currency: dataState.currency }) }}
  </span>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { ClassNames } from '@utils';

const props = defineProps<{
  value?: number;
  locale?: string;
  class?: ClassNames;
}>();

const { n } = useI18n();
const { state: dataState } = useDataStore();
const { state: settingsState } = useSettingsStore();
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
