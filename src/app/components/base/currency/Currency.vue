<template>
  <span
    v-if="settingsState.appearance.mode === 'privacy'"
    :data-testid="testId"
    :class="[$style.container, props.class]"
  >
    {{ formatted }}
    <span :class="$style.overlay" />
  </span>
  <span v-else :data-testid="testId" :class="props.class">
    {{ formatted }}
  </span>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { ClassNames } from '@utils/types.ts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  value?: number;
  locale?: string;
  class?: ClassNames;
  testId?: string;
}>();

const { n } = useI18n();
const { state: dataState } = useDataStore();
const { state: settingsState } = useSettingsStore();

const formatted = computed(() => n(props.value ?? 0, { key: 'currency', currency: dataState.currency }));
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
