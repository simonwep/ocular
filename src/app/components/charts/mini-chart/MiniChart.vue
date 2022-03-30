<template>
  <div :class="[$style.miniChart, classes]">
    <div ref="root" :class="$style.wrapper">
      <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
        <path :d="path"/>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useResizeObserver} from '@composables';
import {computed, ref} from 'vue';

const props = withDefaults(defineProps<{
  class?: any;
  width?: number;
  height?: number;
  values: number[];
}>(), {
  width: 75,
  height: 30
});

const root = ref<HTMLDivElement>();
const size = useResizeObserver(root);

const classes = computed(() => props.class);
const viewBox = computed(() => `0 0 ${size.value.width} ${size.value.height}`);

const path = computed(() => {
  const {width, height} = size.value;
  const max = Math.max(...props.values);
  const normalized = props.values.map(v => max ? v / max : 0);
  const points = [];

  for (let i = 0; i < normalized.length; i++) {
    const dx = i * (width / (normalized.length - 1));
    const dy = height - normalized[i] * height;

    !points.length && points.push(`M0,${dy}`);
    points.push(`S ${dx - 2},${dy} ${dx},${dy}`);
  }

  return points.join(' ');
});

</script>

<style lang="scss" module>

.miniChart {
  display: flex;
  height: calc(v-bind('props.height') * 1px);
  width: calc(v-bind('props.width') * 1px);
  padding: 5px;
}

.wrapper {
  height: 100%;
  width: 100%;
  overflow: visible;

  > svg {
    height: 100%;
    width: 100%;
    stroke: var(--c-primary);
    fill: transparent;
    stroke-width: 2;
    overflow: visible;
  }
}

</style>
