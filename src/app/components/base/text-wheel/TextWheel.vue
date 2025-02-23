<template>
  <span :class="$style.container">
    <span :data-testid="testId" :class="$style.placeholder">{{ value }}</span>
    <span :class="$style.textWheel">
      <span v-for="v of values" :key="v" :class="[$style.value, { [$style.transition]: mounted }]">{{ v }}</span>
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  values: (string | number)[];
  value: string | number;
  testId?: string;
}>();

const mounted = ref(false);

const offset = computed(() => props.values.indexOf(props.value));

onMounted(() => (mounted.value = true));
</script>

<style lang="scss" module>
.container {
  display: inline-block;
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
  transform: translateY(calc(v-bind(offset) * -100%));

  &.transition {
    transition: transform var(--transition-s);
  }
}
</style>
