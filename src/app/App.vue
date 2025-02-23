<template>
  <div ref="root" :class="$style.app">
    <LoadingScreen
      :loading="storage.status.value === 'loading'"
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
import { computed, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { status } = useStorage();
const { state } = useSettingsStore();
const { t } = useI18n();
const router = useRouter();
const storage = useStorage();
const media = useMediaQuery();
const app = useAppElement();
const root = useSquircle(computed(() => (['minimized', 'mobile'].includes(media.value) ? 0 : 0.035)));

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
</script>

<style lang="scss" module>
@use '@styles/globals.scss';
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
  background: var(--app-background);

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
