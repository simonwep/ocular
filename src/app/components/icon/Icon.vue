<template>
  <span :class="[$style.icon, classes]">
    <img v-if="src" :alt="icon" :src="src"/>
  </span>
</template>

<script lang="ts" setup>
import {computed, ref, watchEffect} from 'vue';

const icons = Object.fromEntries(
    Object.entries(import.meta.glob('./icons/*.png'))
        .map(v => [v[0].replace(/.*\/|\.\w+$/g, ''), v[1]])
);

const props = defineProps<{
  class?: any;
  icon: string;
}>();

const src = ref<string>();
const classes = computed(() => props.class);

watchEffect(() => {
  icons[props.icon]().then(ref => {
    src.value = ref.default;
  });
});

</script>

<style lang="scss" module>

.icon {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: 16px;
    height: 16px;
  }
}

</style>
