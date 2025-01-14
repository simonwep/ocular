<template>
  <template v-if="show">
    <component v-bind="properties" :is="component" v-if="component" :class="classes" />
    <div v-else :class="[$style.placeholder, classes]">
      <span />
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ClassNames } from '@utils';
import { computed, shallowRef, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    show?: boolean;
    properties?: Record<string, unknown>;
    import: () => Promise<{ default: unknown }>;
  }>(),
  {
    show: true
  }
);

const component = shallowRef();
const classes = computed(() => props.class);
let loading = false;

watchEffect(() => {
  if (props.show && !loading) {
    loading = true;
    props.import().then((module) => (component.value = module.default));
  }
});
</script>

<style lang="scss" module>
@keyframes loader {
  0% {
    transform: translateX(-25px);
  }
  50% {
    width: 30px;
  }
  100% {
    transform: translateX(25px);
  }
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-grow: 1;

  > span {
    width: 10px;
    height: 5px;
    background: var(--c-primary);
    border-radius: 15px;
    animation: loader 1s infinite alternate ease-in-out;
  }
}

.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  animation: var(--animation-fade-in-scale) var(--transition-s);
}
</style>
