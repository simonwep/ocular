<template>
  <span :class="$style.container">
    <span :class="$style.placeholder">{{ value }}</span>
    <span :class="$style.textWheel">
      <span v-for="v of values" :key="v" :class="$style.value">{{ v }}</span>
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  values: (string | number)[];
  value: string | number;
}>();

const offset = computed(() => props.values.indexOf(props.value));
</script>

<style lang="scss" module>
.container {
  position: relative;
  overflow: hidden;
  clip-path: inset(0 0 0 0);
}

.placeholder {
  visibility: hidden;
}

.textWheel {
  left: 0;
  position: absolute;
  display: inline-grid;
  grid-auto-flow: row;
}

.value {
  transition: transform var(--transition-s);
  transform: translateY(calc(v-bind(offset) * -100%));
}
</style>
