<template>
  <Button :tooltip="t('navigation.theme.change')" :class="classes" :icon="icon" textual @click="toggle" />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { useAppElement } from '@composables';
import { RiMoonFill, RiSunFill } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { ClassNames } from '@utils';
import { computed, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Component } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const { state, setTheme } = useSettingsStore();
const { t } = useI18n();
const app = useAppElement();
let switchActive = false;

const icon = computed((): Component => (state.appearance.theme === 'light' ? RiSunFill : RiMoonFill));
const classes = computed(() => props.class);
const instance = getCurrentInstance();

const getTransitionOrigin = () => {
  const originRect = instance?.vnode.el?.getBoundingClientRect() as DOMRect;
  const centerX = originRect.left + originRect.width / 2;
  const centerY = originRect.top + originRect.height / 2;
  return `${centerX}px ${centerY}px`;
};

const toggle = () => {
  if (switchActive) return;
  switchActive = true;

  const oldTheme = state.appearance.theme;
  const wasDark = oldTheme === 'dark';
  setTheme(wasDark ? 'light' : 'dark');

  const origin = getTransitionOrigin();
  const clone = app.cloneNode(true) as HTMLElement;
  clone.classList.add(oldTheme);

  document.body[wasDark ? 'prepend' : 'append'](clone);
  const [start, end] = wasDark ? [0, 150] : [150, 0];
  const target = wasDark ? app : clone;

  app.style.setProperty('--transitions', '0');
  clone.style.setProperty('--transitions', '0');

  target.style.setProperty('clip-path', `circle(${start}% at ${origin})`);
  target.style.setProperty('transition', `all 0.75s ease-in-out`);

  target.addEventListener('transitionend', (e) => {
    if (e.target === target) {
      app.style.removeProperty('--transitions');
      clone.style.removeProperty('--transitions');

      target.style.removeProperty('transition');
      target.style.removeProperty('clip-path');
      clone.remove();
      switchActive = false;
    }
  });

  requestAnimationFrame(() => {
    target.style.setProperty('clip-path', `circle(${end}% at ${origin})`);
  });
};
</script>
