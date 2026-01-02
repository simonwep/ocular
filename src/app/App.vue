<template>
  <AsyncComponent
    v-if="
      !maximized &&
      appSize === 'normal' &&
      reducedMotion !== 'reduce' &&
      settings.appearance.animations &&
      showWinterFeatures
    "
    :class="$style.snowFlakes"
    :properties="{ testId: 'snow-flakes' }"
    hideLoader
    :import="() => import('./components/base/snow-flakes/SnowFlakes.vue')"
  />

  <div :class="$style.container">
    <LoadingScreen
      ref="root"
      :class="[$style.app, { [$style.maximized]: maximized && appSize === 'normal' }]"
      :import="() => import('./pages/Frame.vue')"
    >
      <MaximizeButton v-if="appSize === 'normal'" v-model="maximized" :class="$style.expandButton" />
    </LoadingScreen>
  </div>
</template>

<script lang="ts" setup>
import MaximizeButton from '@components/feature/maximize-button/MaximizeButton.vue';
import AsyncComponent from '@components/misc/async-component/AsyncComponent.vue';
import LoadingScreen from '@components/misc/loading-screen/LoadingScreen.vue';
import { useAppSize } from '@composables/app-size/useAppSize.ts';
import { useAppElement } from '@composables/useAppElement.ts';
import { useShowWinterFeatures } from '@composables/winter-features/useShowWinterFeatures.ts';
import { useStorage } from '@storage/index';
import { useSettingsStore } from '@store/settings';
import { useTemplateData } from '@store/state/template/useTemplateData.ts';
import { useLocalStorage, usePreferredReducedMotion } from '@vueuse/core';
import { nextTick, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { status } = useStorage();
const { state: settings } = useSettingsStore();
const { loadTemplateData } = useTemplateData();
const { t } = useI18n();
const showWinterFeatures = useShowWinterFeatures();
const router = useRouter();
const reducedMotion = usePreferredReducedMotion();
const maximized = useLocalStorage('app/maximized', false);
const appSize = useAppSize();
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
  position: relative;
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  max-width: var(--app-max-width);
  max-height: var(--app-max-height);

  &.maximized {
    max-width: calc(100% - 20px);
    max-height: calc(100% - 20px);

    .expandButton {
      transform: rotateY(-180deg) rotateX(180deg);
    }
  }

  &:not(.maximized) .expandButton:hover {
    transform: translate(2px, -2px) scale(1.1);
  }

  @include globals.onAppMinSizeReached {
    max-width: 100%;
    max-height: 100%;
  }
}

.expandButton {
  position: absolute;
  z-index: 1;
  top: -4px;
  right: -4px;
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
