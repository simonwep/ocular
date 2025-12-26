<template>
  <AsyncComponent
    v-if="media !== 'minimized' && reducedMotion !== 'reduce' && month === 11"
    :class="$style.snowFlakes"
    :properties="{ testId: 'snow-flakes' }"
    hideLoader
    :import="() => import('./components/base/snow-flakes/SnowFlakes.vue')"
  />

  <div :class="$style.container">
    <LoadingScreen
      ref="root"
      :loading="storage.status.value === 'loading' || !appConfig"
      :class="$style.app"
      :import="() => import('./pages/Frame.vue')"
    />
  </div>
</template>

<script lang="ts" setup>
import AsyncComponent from '@components/misc/async-component/AsyncComponent.vue';
import LoadingScreen from '@components/misc/loading-screen/LoadingScreen.vue';
import { useAppConfig } from '@composables/useAppConfig.ts';
import { useAppElement } from '@composables/useAppElement.ts';
import { useMediaQuery } from '@composables/useMediaQuery.ts';
import { useTime } from '@composables/useTime.ts';
import { useStorage } from '@storage/index';
import { useSettingsStore } from '@store/settings';
import { useDemoData } from '@store/state/demo-data/useDemoData.ts';
import { usePreferredReducedMotion } from '@vueuse/core';
import { nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { status } = useStorage();
const { state } = useSettingsStore();
const { loadDemoData } = useDemoData();
const { t } = useI18n();
const { month } = useTime();
const router = useRouter();
const storage = useStorage();
const reducedMotion = usePreferredReducedMotion();
const media = useMediaQuery();
const app = useAppElement();
const appConfig = useAppConfig();

const preventDefault = (event: Event) => event.preventDefault();

watch(
  () => state.appearance.theme,
  (newTheme, oldTheme) => {
    app.classList.add(newTheme);

    if (oldTheme) {
      app.classList.remove(oldTheme);
    }

    nextTick(() => {
      const appColor = getComputedStyle(app).getPropertyValue('--app-background').trim();
      document
        .querySelectorAll('[data-meta="theme-color"]')
        .forEach((el) => ((el as HTMLMetaElement).content = appColor));
    });
  },
  { immediate: true }
);

watch(
  () => state.appearance.animations,
  (enabled) => app.classList[enabled ? 'remove' : 'add']('reducedMotion'),
  { immediate: true }
);

watch(status, (v) => {
  if (v === 'authenticated' || v === 'idle') {
    window.removeEventListener('beforeunload', preventDefault);
  } else {
    window.addEventListener('beforeunload', preventDefault);
  }
});

watch(router.currentRoute, (route) => {
  if (route) {
    document.title = t(`page.${route.name as string}.title`);
  }
});

watch(appConfig, (config) => {
  if (config?.demo && location.hash === '#demo') {
    loadDemoData();
  }
});
</script>

<style lang="scss" module>
@use '@styles/globals.scss';
@use 'sass:math';

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  filter: drop-shadow(var(--app-drop-shadow));
}

.app {
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  max-width: globals.$appMaxWidth;
  max-height: globals.$appMaxHeight;

  @include globals.onAppMinSizeReached {
    max-width: 100%;
    max-height: 100%;
  }
}

.snowFlakes {
  position: fixed;
  inset: 0 0 0 0;
}

.root {
  display: flex;

  @include globals.onMobileDevices {
    flex-direction: column-reverse;
  }
}
</style>
