<template>
  <div ref="root" :class="classes" />
</template>

<script lang="ts" setup>
import { useResizeObserver } from '@composables';
import { ClassNames } from '@utils';
import * as echarts from 'echarts/core';
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

/* eslint-disable @typescript-eslint/no-explicit-any */
const props = defineProps<{
  class?: ClassNames;
  options?: any;
}>();

const classes = computed(() => props.class);
const root = ref<HTMLDivElement>();
const rootSize = useResizeObserver(root);
const chart = shallowRef();

const update = () => chart.value?.setOption(props.options);
const resize = () => chart.value?.resize();

watch(props, update);
watch(chart, update);
watch(rootSize, resize);

onMounted(() => {
  window.addEventListener('resize', resize);
  chart.value = echarts.init(root.value as HTMLDivElement);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
});
</script>
