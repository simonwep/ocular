<template>
  <div ref="root" :class="[$style.chart, classes]"/>
</template>

<script lang="ts" setup>
import {useResizeObserver} from '@composables';
import * as echarts from 'echarts/core';
import {EChartsType} from 'echarts/types/dist/shared';
import {computed, onMounted, onUnmounted, ref, shallowRef, watch} from 'vue';

const props = defineProps<{
  class?: any;
  options?: any;
}>();

const classes = computed(() => props.class);
const root = ref<HTMLDivElement>();
const rootSize = useResizeObserver(root);
const chart = shallowRef<EChartsType>();

const update = () => chart.value?.setOption(props.options);
const resize = () => chart.value?.resize();

watch(props, update);
watch(chart, update);
watch(rootSize, resize);

onMounted(() => {
  window.addEventListener('resize', resize);
  chart.value = echarts.init(root.value as HTMLDivElement, {
    color: new Array(25)
        .fill(0)
        .map((_, index) => `var(--c-pastell-${index + 1})`)
        .sort(() => 0.5 - Math.random())
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
});
</script>

<style lang="scss" module>

.chart {
  height: 100%;
  width: 100%;
}

</style>
