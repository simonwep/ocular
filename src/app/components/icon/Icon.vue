<template>
  <span :class="[$style.icon, classes]" v-html="svg"/>
</template>

<script lang="ts" setup>
import {icons} from '@components/icon/icons';
import {computed} from 'vue';

const props = defineProps<{
  class?: any;
  icon: string;
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
