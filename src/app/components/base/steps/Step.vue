<template>
  <div ref="root" :class="[$style.step, classes]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { STEPS_STORE, StepsStore } from './Steps.types';
import { useIntrinsicSize } from '@composables/intrinsic-size/useIntrinsicSize.ts';
import { ClassNames } from '@utils/types.ts';
import { computed, inject, onMounted, onUnmounted, useTemplateRef } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const root = useTemplateRef('root');
const intrinsicSize = useIntrinsicSize(root);
const { register, unregister } = inject<StepsStore>(STEPS_STORE)!;

onMounted(() => register(intrinsicSize));
onUnmounted(() => unregister(intrinsicSize));

const classes = computed(() => props.class);
</script>

<style lang="scss" module>
.step {
  display: inline-flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 5px;
}
</style>
