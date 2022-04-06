<template>
  <div v-if="component" :class="$style.wrapper">
    <component :is="component"/>
  </div>
  <div v-else :class="$style.asyncComponent">
    <div/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, shallowRef} from 'vue';

const props = defineProps<{
  import: () => Promise<any>;
}>();

const component = shallowRef();

onMounted(() => {
    props.import().then(module => component.value = module.default);
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

.asyncComponent {
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
