<template>
  <div :class="$style.app" ref="root">
    <LoadingScreen
      :loading="storage.state.status === 'loading'"
      :class="$style.root"
      :import="() => import('./pages/Frame.vue')"
    />
  </div>
</template>

<script lang="ts" setup>
import LoadingScreen from '@components/misc/loading-screen/LoadingScreen.vue';
import { useAppElement, useMediaQuery, useSquircle } from '@composables';
import { useStorage } from '@storage/index';
import { useSettingsStore } from '@store/settings';
import { computed, nextTick, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { state } = useSettingsStore();
const { t } = useI18n();
const router = useRouter();
const storage = useStorage();
const media = useMediaQuery();
const app = useAppElement();
const root = useSquircle(computed(() => (media.value === 'minimized' ? 0 : 0.035)));

watchEffect(() => {
  app.classList.add(state.appearance.theme);

  nextTick(() => {
    const appColor = getComputedStyle(app).getPropertyValue('--app-backround').trim();
    document
      .querySelectorAll('[data-meta="theme-color"]')
      .forEach((el) => ((el as HTMLMetaElement).content = appColor));
  });
});

watch(
  () => state.appearance.theme,
  (_, oldTheme) => app.classList.remove(oldTheme)
);

watch(
  () => state.appearance.animations,
  (enabled) => {
    app.classList[enabled ? 'remove' : 'add']('reducedMotion');
  }
);

watchEffect(() => {
  document.title = ['app.name', ...router.currentRoute.value.matched.map((v) => v.name as string)].map(t).join(' / ');
});
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
  overflow: hidden;
  background: var(--app-backround);

  @include globals.onAppMinSizeReached {
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
