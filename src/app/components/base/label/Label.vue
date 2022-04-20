<template>
  <div :class="[$style.wrapper, classes]">
    <label :class="$style.label" :for="id">{{ label }}</label>
    <slot :id="id" />
  </div>
</template>

<script lang="ts" setup>
import { ClassNames, uuid } from '@utils';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  label: string;
}>();

const id = uuid();
const classes = computed(() => props.class);
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  width: auto;
}

.label {
  padding-right: 32px;
  margin-right: auto;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-m);
}
</style>
