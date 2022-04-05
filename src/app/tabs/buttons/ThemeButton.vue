<template>
  <div ref="button" :class="$style.themeButton">
    <Button :icon="icon" textual @click="toggle"/>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/button/Button.vue';
import {AppIcon} from '@components/icon/Icon.types';
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

  if (switchActive) {
    return;
  }

  switchActive = true;
  const oldTheme = state.theme;
  setTheme(oldTheme === 'dark' ? 'light' : 'dark');

  const origin = getTransitionOrigin();
  const instance = app.value as HTMLElement;
  const clone = app.value?.cloneNode(true) as HTMLElement;
  document.body.prepend(clone);

  clone.classList.add(oldTheme);
  instance.style.setProperty('--transitions', '0');
  instance.style.setProperty('clip-path', `circle(0% at ${origin})`);
  instance.style.setProperty('transition', `all 0.75s ease-in-out`);

  instance.ontransitionend = (e) => {
    if (e.target === instance) {
      instance.style.removeProperty('--transition');
      instance.style.removeProperty('transition');
      instance.style.removeProperty('clip-path');
      clone.remove();
      switchActive = false;
    }
  };

  requestAnimationFrame(() => {
    instance.style.setProperty('clip-path', `circle(150% at ${origin})`);
  });
};

</script>

<style lang="scss" module>

.themeButton {
  display: flex;
}

</style>
