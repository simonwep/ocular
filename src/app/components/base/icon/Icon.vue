<template>
  <span :class="[$style.icon, classes]" v-html="svg" />
</template>

<script lang="ts" setup>
import { AppIcon } from '@components/base/icon/Icon.types';
import { ClassNames } from '@utils';
import { computed } from 'vue';

const icons = Object.fromEntries(
  Object.entries(import.meta.glob('/src/icons/*.svg', { eager: true, as: 'raw' })).map((v) => [
    v[0].replace(/.*\/|\.\w+$/g, ''),
    v[1]
  ])
);

const props = defineProps<{
  class?: ClassNames;
  icon: AppIcon;
}>();

const classes = computed(() => props.class);
const svg = computed(() => {
  return icons[props.icon];
});
</script>

<style lang="scss" module>
.icon {
  color: inherit;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    fill: currentColor;
    height: 100%;
    width: 100%;
  }
}
</style>
