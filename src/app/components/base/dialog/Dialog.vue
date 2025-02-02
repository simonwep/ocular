<template>
  <dialog ref="dialog" :class="classes" @transitionend="transitionEnd">
    <div :class="$style.backdrop" />
    <div ref="content" :class="[$style.content, contentClass]">
      <h3 v-if="title" :class="$style.title">{{ title }}</h3>
      <slot />
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { useOutOfElementClick } from '@composables';
import { ClassNames } from '@utils';
import { computed, onMounted, ref, toRef, useCssModule, watch } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
  title?: string;
  contentClass?: ClassNames;
}>();

const content = ref<HTMLDivElement>();
const dialog = ref<HTMLDialogElement>();
const visible = ref(false);

const styles = useCssModule();
const classes = computed(() => [styles.dialog, { [styles.open]: props.open }]);

useOutOfElementClick(content, () => visible.value && emit('close'));

const transitionEnd = () => {
  if (!props.open) {
    dialog.value?.close();
  }
};

watch(
  [toRef(props, 'open'), dialog],
  () => {
    if (props.open) {
      dialog.value?.showModal();
      requestAnimationFrame(() => (visible.value = true));
    } else {
      visible.value = false;
      requestAnimationFrame(() => dialog.value?.close());
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (dialog.value) {
    dialog.value.remove();
    document.getElementById('app')?.append(dialog.value);
  }
});
</script>

<style lang="scss" module>
.dialog {
  visibility: hidden;
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
  inset: 0 0 0 0;
  z-index: -1;
}

.dialog[open] {
  visibility: visible;

  .content {
    transition: opacity var(--transition-m);
  }
}

.dialog[open].open {
  .content {
    opacity: 1;
  }

  .backdrop {
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
  }
}

.content {
  background: var(--dialog-background);
  color: var(--theme-text);
  padding: 16px 18px;
  border-radius: var(--border-radius-l);
  box-shadow: var(--dialog-box-shadow);
  opacity: 0;
}

.title {
  text-align: center;
  font-weight: var(--font-weight-l);
  font-style: var(--font-size-m);
  padding-bottom: 14px;
}
</style>
