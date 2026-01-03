<template>
  <div ref="root" :class="[$style.steps, classes]">
    <slot :next="next" :previous="previous" :reset="reset" />
  </div>
</template>

<script lang="ts" setup>
import { STEPS_STORE, StepsStore, StepsExposed } from './Steps.types';
import { remove } from '@utils/array/array.ts';
import { ClassNames } from '@utils/types.ts';
import { computed, provide, reactive, Ref, ref, useTemplateRef } from 'vue';

const emit = defineEmits<{
  (e: 'finish'): void;
}>();

const props = defineProps<{
  class?: ClassNames;
}>();

const root = useTemplateRef('root');
const sizes = reactive<Ref<DOMRect>[]>([]);
const classes = computed(() => props.class);
const screenIndex = ref(0);

const screen = computed(() => sizes[screenIndex.value]?.value ?? new DOMRect());
const offset = computed(() => sizes.slice(0, screenIndex.value).reduce((a, b) => a + b.value.width, 0));

provide<StepsStore>(STEPS_STORE, {
  register: (size) => sizes.push(size),
  unregister: (size) => remove(sizes, size)
});

const reset = () => (screenIndex.value = 0);

const previous = () => (screenIndex.value = Math.max(0, screenIndex.value - 1));

const next = () => {
  if (screenIndex.value + 1 < sizes.length) {
    screenIndex.value++;
  } else {
    emit('finish');
  }
};

defineExpose<StepsExposed>({
  reset,
  previous,
  next
});
</script>

<style lang="scss" module>
.steps {
  display: flex;
  width: calc(v-bind('screen.width') * 1px);
  height: calc(v-bind('screen.height') * 1px);
  transition: all var(--transition-m);
  overflow: hidden;

  > *:first-child {
    transition: all var(--transition-m);
    margin-left: calc(v-bind('offset') * -1px);
  }
}
</style>
