<template>
  <dialog ref="dialog" :class="classes" @transitionend="transitionEnd">
    <div ref="content" :class="[$style.content, contentClass]">
      <h3 v-if="title" :class="$style.title">{{ title }}</h3>
      <slot />
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, toRef, useCssModule, watch } from 'vue';
import { useOutOfElementClick } from '@composables';
import { ClassNames } from '@utils';

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
}

.dialog,
.dialog[open]::backdrop {
  visibility: hidden;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition:
    visibility 0s var(--transition-m),
    opacity var(--transition-m);
}

.dialog[open].open,
.dialog[open].open::backdrop {
  transition-delay: 0s;
}

.dialog[open].open,
.dialog[open].open::backdrop {
  opacity: 1;
  visibility: visible;
}

.content {
  background: var(--dialog-background);
  color: var(--theme-text);
  padding: 10px 13px;
  border-radius: var(--border-radius-l);
  box-shadow: var(--dialog-box-shadow);
}

.title {
  text-align: center;
  font-weight: var(--font-weight-l);
  font-style: var(--font-size-m);
  padding-bottom: 8px;
}
</style>
