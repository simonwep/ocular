<template>
  <AsyncComponent
    v-if="media === 'normal' && settings.appearance.animations && reducedMotion !== 'reduce' && month === 11"
    :class="$style.snowFlakes"
    :properties="{ testId: 'snow-flakes' }"
    hideLoader
    :import="() => import('./components/base/snow-flakes/SnowFlakes.vue')"
  />

  <div :class="$style.container">
    <LoadingScreen ref="root" :class="$style.app" :import="() => import('./pages/Frame.vue')" />
  </div>
</template>

<script lang="ts" setup>
import AsyncComponent from '@components/misc/async-component/AsyncComponent.vue';
import LoadingScreen from '@components/misc/loading-screen/LoadingScreen.vue';
import { useAppElement } from '@composables/useAppElement.ts';
import { useMediaQuery } from '@composables/useMediaQuery.ts';
import { useTime } from '@composables/useTime.ts';
import { useStorage } from '@storage/index';
import { useSettingsStore } from '@store/settings';
import { useTemplateData } from '@store/state/template/useTemplateData.ts';
import { usePreferredReducedMotion } from '@vueuse/core';
import { nextTick, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { status } = useStorage();
const { state: settings } = useSettingsStore();
const { loadTemplateData } = useTemplateData();
const { t } = useI18n();
const { month } = useTime();
const router = useRouter();
const reducedMotion = usePreferredReducedMotion();
const media = useMediaQuery();
const app = useAppElement();

const preventDefault = (event: Event) => event.preventDefault();

watch(
  () => settings.appearance.theme,
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
  () => settings.appearance.animations,
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

onMounted(() => {
  if (!import.meta.env.OCULAR_GENESIS_HOST && location.hash === '#demo') {
    loadTemplateData('demo');
  } else {
    loadTemplateData('template');
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
