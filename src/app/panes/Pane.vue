<template>
  <div :class="[$style.pane, classes]">
    <h1 :class="$style.header">{{ title }}</h1>
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{
  class: any;
  title: string;
}>();

const classes = computed(() => props.class);
</script>

<style lang="scss" module>

.pane {
  padding: 20px;
  padding-top: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  background: var(--app-backround);
}

.header {
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-l);
  position: sticky;
  top: 0;
  padding: 5px 0;
  background: var(--app-backround);
}

</style>
