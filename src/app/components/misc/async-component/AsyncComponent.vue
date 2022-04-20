<template>
  <div v-if="component" :class="[$style.wrapper, classes]">
    <component :is="component" />
  </div>
  <div v-else :class="$style.placeholder">
    <div />
  </div>
</template>

<script lang="ts" setup>
import { ClassNames } from '@utils';
import { computed, onMounted, shallowRef } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  import: () => Promise<{ default: unknown }>;
}>();

const component = shallowRef();
const classes = computed(() => props.class);

onMounted(() => {
  props.import().then((module) => (component.value = module.default));
});
</script>

<style lang="scss" module>
@keyframes flipper {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(45deg) scale(0.5);
  }
  100% {
    transform: rotate(90deg);
  }
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  > div {
    width: 50px;
    height: 50px;
    transform-origin: center;
    background: var(--c-primary);
    border-radius: var(--border-radius-m);
    animation: flipper var(--transition-xl) infinite ease-in-out;
  }
}

.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  animation: var(--animation-fade-in-scale) var(--transition-s);
}
</style>
