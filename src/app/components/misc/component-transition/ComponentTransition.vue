<template>
  <Transition
    :enterActiveClass="$style.transitionTarget"
    :enterFromClass="$style.transitionOrigin"
    :leaveActiveClass="$style.transitionTarget"
    :leaveToClass="$style.transitionOrigin"
    mode="out-in"
  >
    <component :is="is" v-if="is" />
    <slot v-else />
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const FADE_IN_PX = 5;

const props = defineProps<{
  is?: object;
  fadeIn?: 'bottom' | 'top' | 'left' | 'right';
}>();

const transform = computed(() => {
  switch (props.fadeIn) {
    case 'bottom':
      return `translateY(${FADE_IN_PX}px)`;
    case 'top':
      return `translateY(-${FADE_IN_PX}px)`;
    case 'left':
      return `translateX(-${FADE_IN_PX}px)`;
    case 'right':
      return `translateX(${FADE_IN_PX}px)`;
    default:
      return 'none';
  }
});
</script>

<style lang="scss" module>
.transitionTarget {
  transition: all var(--transition-s) !important;
}

.transitionOrigin {
  transform: v-bind(transform) !important;
  opacity: 0 !important;
}
</style>
