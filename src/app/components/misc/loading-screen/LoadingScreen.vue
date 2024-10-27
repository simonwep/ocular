<template>
  <div v-if="component && !loading" :class="[$style.wrapper, classes]">
    <component :is="component" />
  </div>
  <div v-else :class="$style.placeholder">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle transform="rotate(-44.992 50 50.001)" cx="50" cy="50" style="fill: var(--c-primary)" r="50" />
      <path
        d="M37.9 30h24.2c1.8 0 3.5.9 4.6 2.4l8 11.3c1.6 2.2 1.3 5.3-.6 7.3L54 71c-2.2 2.2-5.8 2.2-8 0L25.9 50.9c-1.9-1.9-2.2-5-.6-7.3l8-11.3c1.1-1.4 2.8-2.3 4.6-2.3z"
        style="fill: #fff"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { ClassNames } from '@utils';
import { computed, onMounted, shallowRef } from 'vue';

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    loading?: boolean;
    import: () => Promise<{ default: unknown }>;
  }>(),
  {
    loading: false
  }
);

const component = shallowRef();
const classes = computed(() => props.class);

onMounted(() => {
  props.import().then((module) => (component.value = module.default));
});
</script>

<style lang="scss" module>
@keyframes fade-down {
  20%,
  80% {
    opacity: 1;
    transform: none;
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}

@keyframes fade-down-shorted {
  30%,
  60% {
    opacity: 1;
    transform: none;
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  > svg {
    width: 50px;
    height: 50px;
    overflow: visible;

    > circle,
    > path {
      opacity: 0;
      transform: translateY(-10px);
    }

    > circle {
      animation: fade-down infinite var(--transition-xxl) ease-in-out;
    }

    > path {
      animation: fade-down-shorted infinite var(--transition-xxl) ease-in-out;
    }
  }
}

.wrapper {
  width: 100%;
  height: 100%;
  animation: var(--animation-fade-in-scale) var(--transition-s);
}
</style>
