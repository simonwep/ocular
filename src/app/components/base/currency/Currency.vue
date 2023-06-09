<template>
  <span v-if="settingsState.appearance.mode === 'privacy'" :class="[$style.container, props.class]">
    {{ n(value ?? 0, { key: 'currency', currency: dataState.currency }) }}
    <span :class="$style.overlay" />
  </span>
  <span :class="props.class" v-else>
    {{ n(value ?? 0, { key: 'currency', currency: dataState.currency }) }}
  </span>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useDataStore } from '@store/state';
import { useSettingsStore } from '@store/settings';
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
