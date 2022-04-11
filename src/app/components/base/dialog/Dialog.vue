<template>
  <dialog ref="dialog" :class="$style.dialog">
    <div ref="content" :class="[$style.content, classes]">
      <slot />
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { ClassNames } from '@utils';
import { computed, onUnmounted, ref, watchEffect } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
  class?: ClassNames;
}>();

const content = ref<HTMLDivElement>();
const dialog = ref<HTMLDialogElement>();
const classes = computed(() => props.class);

const showDialog = (show: boolean) => {
  show ? dialog.value?.showModal() : dialog.value?.close();
};

const detectOutOfBoundsClick = (e: MouseEvent) => {
  if (
    dialog.value?.open &&
    !e.composedPath().includes(content.value as HTMLDivElement)
  ) {
    emit('close');
  }
};

onUnmounted(() => window.removeEventListener('click', detectOutOfBoundsClick));
watchEffect(() => {
  showDialog(props.open);

  requestAnimationFrame(() => {
    if (props.open) {
      window.addEventListener('click', detectOutOfBoundsClick);
    } else {
      window.removeEventListener('click', detectOutOfBoundsClick);
    }
  });
});
</script>

<style lang="scss" module>
.dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  pointer-events: none;
  transition: var(--transition-m);

  &::backdrop {
    backdrop-filter: blur(2px);
  }

  &[open] {
    opacity: 1;
    pointer-events: all;
  }
}

.content {
  background: var(--dialog-background);
  color: var(--theme-text);
  padding: 10px;
  border-radius: var(--border-radius-l);
  box-shadow: var(--dialog-box-shadow);
}
</style>
