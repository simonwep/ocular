<template>
  <div :class="$style.app">
    <AsyncComponent :import="() => import('./tabs/Tabs.vue')" />
  </div>
</template>

<script lang="ts" setup>
import AsyncComponent from '@components/misc/async-component/AsyncComponent.vue';
import { useAppElement } from '@composables';
import { useSettingsStore } from '@store/settings';
import { watch, watchEffect } from 'vue';

const { state } = useSettingsStore();
const app = useAppElement();

watchEffect(() => app.value?.classList.add(state.appearance.theme));
watch(
  () => state.appearance.theme,
  (newTheme, oldTheme) => {
    app.value?.classList.add(newTheme);
    app.value?.classList.remove(oldTheme);
  }
);

watch(
  () => state.appearance.animations,
  (enabled) => {
    app.value?.classList[enabled ? 'remove' : 'add']('reducedMotion');
  }
);
</script>

<style lang="scss" module>
@use 'sass:math';

$maxWidth: 1500px;
$maxHeight: math.div($maxWidth, 1.5);

.app {
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  max-width: $maxWidth;
  max-height: $maxHeight;
  box-shadow: var(--app-box-shadow);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  background: var(--app-backround);

  @media all and (max-width: $maxWidth) {
    border-radius: 0;
  }
}
</style>
