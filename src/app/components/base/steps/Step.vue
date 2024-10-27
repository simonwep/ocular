<template>
  <div ref="root" :class="[$style.step, classes]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useIntristicSize } from '@composables';
import { ClassNames } from '@utils';
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { ONBOARDING_STORE, OnboardingStore } from './Steps.types';

const props = defineProps<{
  class?: ClassNames;
}>();

const root = ref<HTMLDivElement>();
const intrinsicSize = useIntristicSize(root);
const { register, unregister } = inject<OnboardingStore>(ONBOARDING_STORE) as OnboardingStore;

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

.shadow {
  position: fixed;
  visibility: hidden;
}
</style>
