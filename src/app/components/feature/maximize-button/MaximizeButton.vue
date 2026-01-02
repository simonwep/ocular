<template>
  <button v-if="appSize === 'normal'" type="button" :class="[$style.maximizeButton, classes]">
    <svg :style="squircleCorner.style" xmlns="http://www.w3.org/2000/svg" @click="modelValue = !modelValue">
      <path :d="squircleCorner.path" />
    </svg>
  </button>
</template>

<script lang="ts" setup>
import { useAppSize } from '@composables/app-size/useAppSize.ts';
import { useSquircleCorner } from '@composables/squircle/useSquircleCorner.ts';
import { ClassNames } from '@utils/types.ts';
import { computed } from 'vue';

const modelValue = defineModel<boolean>();

const props = defineProps<{
  class: ClassNames;
}>();

const appSize = useAppSize();
const squircleCorner = useSquircleCorner(8, 1, 'top-right');

const classes = computed(() => props.class);
</script>

<style lang="scss" module>
.maximizeButton {
  all: unset;
  cursor: pointer;
  display: flex;
  transition: all var(--transition-m) ease-in-out;
  transform-origin: center;

  > svg {
    overflow: visible;
    fill: none;
    stroke: var(--c-primary);
    stroke-width: 3;
    stroke-linecap: round;
  }

  &:hover > svg {
    stroke: var(--c-primary-hover);
  }
}
</style>
