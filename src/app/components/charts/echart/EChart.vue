<template>
  <div ref="root" :class="classes" />
</template>

<script lang="ts" setup>
import { useResizeObserver } from '@composables';
import { ClassNames, getCssVariables, svgToPNG } from '@utils';
import { EChartsType, init } from 'echarts/core';
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

/* eslint-disable @typescript-eslint/no-explicit-any */
const props = defineProps<{
  class?: ClassNames;
  options?: any;
}>();

const classes = computed(() => props.class);
const root = ref<HTMLDivElement>();
const rootSize = useResizeObserver(root);
const chart = shallowRef<EChartsType>();

const update = () => chart.value?.setOption(props.options);
const resize = () => chart.value?.resize();

const assertSvg = () => {
  if (!root.value || !chart.value) {
    throw new Error('No SVG string to convert to PNG');
  }

  // Inject raw css values
  const cssVariables = getCssVariables(root.value);
  const svgString = chart.value.renderToSVGString();
  const variableRegex = /var\((--.*?)\)/g;
  let serialized = svgString;

  for (const [name, key] of svgString.matchAll(variableRegex)) {
    const value = cssVariables.get(key)?.replace(/"/g, "'");

    if (value) {
      serialized = serialized.replace(name, value);
    }
  }

  return serialized;
};

watch(props, update);
watch(chart, update);
watch(rootSize, resize);

onMounted(() => {
  window.addEventListener('resize', resize);
  chart.value = init(root.value as HTMLDivElement);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
});

defineExpose({
  toSVG: (): Blob => new Blob([assertSvg()], { type: 'image/svg+xml;charset=utf-8' }),
  toPNG: (): Promise<Blob> => svgToPNG(assertSvg(), 3)
});
</script>
