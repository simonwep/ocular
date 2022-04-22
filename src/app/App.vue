<template>
  <div :class="$style.app">
    <LoadingScreen
      :class="$style.root"
      :import="() => import('./tabs/Tabs.vue')"
    />
  </div>
</template>

<script lang="ts" setup>
import LoadingScreen from '@components/misc/loading-screen/LoadingScreen.vue';
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
@use 'src/styles/globals';
@use 'sass:math';

.app {
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  max-width: globals.$appMaxWidth;
  max-height: globals.$appMaxHeight;
  box-shadow: var(--app-box-shadow);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  background: var(--app-backround);

  @include globals.onAppMinSizeReached {
    border-radius: 0;
    max-width: 100%;
    max-height: 100%;
  }
}

.root {
  display: flex;

  @include globals.onMobileDevices {
    flex-direction: column-reverse;
  }
}
</style>
