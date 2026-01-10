<template>
  <Button
    ref="button"
    testId="navigation-toggle-theme"
    :tooltip="viewTransition ? undefined : t('navigation.theme.change')"
    :class="classes"
    :icon="icon"
    textual
    @click="toggle"
  />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { RiMoonFill, RiSunFill } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { ClassNames } from '@utils/types.ts';
import { computed, onUnmounted, shallowRef, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Component } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const { state, setTheme } = useSettingsStore();
const { t } = useI18n();

const icon = computed((): Component => (state.appearance.theme === 'light' ? RiSunFill : RiMoonFill));
const classes = computed(() => props.class);

const instance = useTemplateRef('button');
const viewTransition = shallowRef<ViewTransition>();
const styleSheet = shallowRef<HTMLStyleElement>();

const transitionStyle = () => {
  const originRect = instance.value?.$el?.getBoundingClientRect() as DOMRect;
  const centerX = originRect.left + originRect.width / 2;
  const centerY = originRect.top + originRect.height / 2;

  let fromCirclePath = `circle(0% at ${centerX}px ${centerY}px)`;
  let toCirclePath = `circle(200% at ${centerX}px ${centerY}px)`;

  let oldAnimation = 'none';
  let newAnimation = 'circle-in 0.75s ease-in-out forwards';

  let oldZIndex = 1;
  let newZIndex = 2;

  if (state.appearance.theme === 'dark') {
    [fromCirclePath, toCirclePath] = [toCirclePath, fromCirclePath];
    [oldAnimation, newAnimation] = [newAnimation, oldAnimation];
    [oldZIndex, newZIndex] = [newZIndex, oldZIndex];
  }

  return `
    @keyframes circle-in {
      0% { clip-path: ${fromCirclePath}; }
      100% { clip-path: ${toCirclePath}; }
    }

    ::view-transition-old(root) {
      animation: ${oldAnimation};
      z-index: ${oldZIndex};
    }

    ::view-transition-new(root) {
      animation: ${newAnimation};
      z-index: ${newZIndex};
    }
  `;
};

const toggle = async () => {
  if (viewTransition.value) return;

  const oldTheme = state.appearance.theme;
  const wasDark = oldTheme === 'dark';
  const newTheme = wasDark ? 'light' : 'dark';

  // Fallback for browsers that do not support View Transitions API
  if (!('startViewTransition' in document)) {
    setTheme(newTheme);
    return;
  }

  styleSheet.value = document.createElement('style');
  styleSheet.value.innerText = transitionStyle();
  document.head.appendChild(styleSheet.value);

  viewTransition.value = document.startViewTransition();
  await viewTransition.value.ready;

  setTheme(newTheme);
  await viewTransition.value.finished;

  styleSheet.value.remove();
  styleSheet.value = undefined;
  viewTransition.value = undefined;
};

onUnmounted(() => {
  viewTransition.value?.skipTransition();
  styleSheet.value?.remove();
});
</script>
