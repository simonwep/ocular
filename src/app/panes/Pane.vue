<template>
  <div :class="[$style.pane, classes]">
    <div :class="$style.header">
      <h1>{{ title + (subTitle ? `- ${subTitle}` : '') }}</h1>
      <slot name="header"/>
    </div>
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{
  class?: any;
  title: string;
  subTitle?: string;
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
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  padding: 5px 0;
  background: var(--app-backround);

  > h1 {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-l);
    margin-right: auto;
  }
}

</style>
