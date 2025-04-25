<template>
  <Teleport to="#app">
    <Transition :enterFromClass="$style.hidden" :leaveToClass="$style.hidden">
      <component
        :is="native ? 'dialog' : 'div'"
        v-if="open"
        ref="dialog"
        :class="$style.dialog"
        @keydown="onKeyDown"
        @close="!lock && emit('close')"
      >
        <div :class="$style.backdrop" />
        <div ref="content" :class="[$style.content, contentClass]">
          <h3 v-if="title" :class="$style.title">{{ title }}</h3>
          <slot />
        </div>
      </component>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { useOutOfElementClick } from '@composables/useOutOfElementClick.ts';
import { ClassNames } from '@utils/types.ts';
import { onMounted, onUnmounted, ref, toRef, useTemplateRef, watch } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = withDefaults(
  defineProps<{
    open: boolean;
    native?: boolean;
    lock?: boolean;
    title?: string;
    contentClass?: ClassNames;
  }>(),
  {
    // Password managers for example don't work with native dialogs
    native: true
  }
);

const content = ref<HTMLDivElement>();
const dialog = useTemplateRef('dialog');

useOutOfElementClick(content, () => {
  if (props.open && !props.lock) {
    emit('close');
  }
});

const onKeyDown = (evt: KeyboardEvent) => {
  if (evt.key === 'Escape') {
    if (props.lock) {
      evt.preventDefault();
    } else {
      emit('close');
    }
  }
};

watch([toRef(props, 'open'), dialog], ([open, dialog]) => {
  if (open && dialog instanceof HTMLDialogElement) {
    dialog?.showModal();
  }
});

onMounted(() => window.addEventListener('keydown', onKeyDown));
onUnmounted(() => window.removeEventListener('keydown', onKeyDown));
</script>

<style lang="scss" module>
.dialog {
  position: fixed;
  inset: 0 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  border: none;
  z-index: 1;
}

.backdrop {
  position: absolute;
  transition: all var(--transition-m);
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  inset: 0 0 0 0;
  z-index: -1;
}

.hidden {
  .content {
    opacity: 0;
  }

  .backdrop {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

.content {
  transition: opacity var(--transition-m);
  background: var(--dialog-background);
  color: var(--theme-text);
  padding: 16px 18px;
  border-radius: var(--border-radius-l);
  box-shadow: var(--dialog-box-shadow);
}

.title {
  text-align: center;
  font-weight: var(--font-weight-l);
  font-style: var(--font-size-m);
  padding-bottom: 14px;
}
</style>
