<template>
  <div ref="button" :class="$style.themeButton">
    <Button :icon="icon" textual @click="toggle"/>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import {AppIcon} from '@components/base/icon/Icon.types';
import {useStore} from '@state/index';
import {computed, ref} from 'vue';
import {useAppElement} from '../../../composables/useAppElement';

const {state, setTheme} = useStore();
const button = ref<HTMLDivElement>();
const app = useAppElement();
let switchActive = false;

const icon = computed((): AppIcon => state.theme === 'light' ? 'sun-fill' : 'moon-fill');

const getTransitionOrigin = () => {
  const originRect = button.value?.getBoundingClientRect() as DOMRect;
  const centerX = originRect.left + originRect.width / 2;
  const centerY = originRect.top + originRect.height / 2;
  return `${centerX}px ${centerY}px`;
};

const toggle = () => {
  if (switchActive) return;
  switchActive = true;

  const oldTheme = state.theme;
  const wasDark = oldTheme === 'dark';
  setTheme(wasDark ? 'light' : 'dark');

  const origin = getTransitionOrigin();
  const root = app.value as HTMLElement;
  const clone = app.value?.cloneNode(true) as HTMLElement;
  clone.classList.add(oldTheme);

  document.body[wasDark ? 'prepend' : 'append'](clone);
  const [start, end] = wasDark ? [0, 150] : [150, 0];
  const target = wasDark ? root : clone;

  root.style.setProperty('--transitions', '0');
  clone.style.setProperty('--transitions', '0');

  target.style.setProperty('clip-path', `circle(${start}% at ${origin})`);
  target.style.setProperty('transition', `all 0.75s ease-in-out`);

  target.addEventListener('transitionend', (e) => {
    if (e.target === target) {
      root.style.removeProperty('--transitions');
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

<style lang="scss" module>

.themeButton {
  display: flex;
}

</style>
