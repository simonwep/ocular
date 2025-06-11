<template>
  <div ref="root" :class="[$style.step, classes]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { STEPS_STORE, StepsStore } from './Steps.types';
import { useIntristicSize } from '@composables/useIntristicSize.ts';
import { ClassNames } from '@utils/types.ts';
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const root = ref<HTMLDivElement>();
const intrinsicSize = useIntristicSize(root);
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
