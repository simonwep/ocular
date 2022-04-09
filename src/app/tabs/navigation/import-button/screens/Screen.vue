<template>
  <div :class="$style.screen">
    <h1 v-if="title" :class="$style.title">{{ title }}</h1>
    <div :class="classes">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{
  class?: any;
  title?: string;
}>();

const classes = computed(() => props.class);
</script>

<style lang="scss" module>

.screen {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-m);
  margin-bottom: 10px;
}

</style>
