<template>
  <dialog ref="dialog" :class="classes" @transitionend="transitionEnd">
    <div ref="content" :class="$style.content">
      <slot />
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { computed, ref, useCssModule, watch } from 'vue';
import { useOutOfElementClick } from '@composables';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
}>();

const content = ref<HTMLDivElement>();
const dialog = ref<HTMLDialogElement>();
const visible = ref(false);

const styles = useCssModule();
const classes = computed(() => [styles.dialog, { [styles.open]: props.open }]);

// Todo: somewhat triggered while modal is made visible
useOutOfElementClick(content, () => visible.value && emit('close'));

const transitionEnd = () => {
  if (!props.open) {
    dialog.value?.close();
  }
};

watch(
  () => props.open,
  (open) => {
    if (open) {
      dialog.value?.showModal();
      requestAnimationFrame(() => (visible.value = true));
    } else {
      visible.value = false;
    }
  }
);
</script>

<style lang="scss" module>
.dialog {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  width: 100%;
  height: 100%;
  border: none;
}

.dialog,
.dialog[open]::backdrop {
  visibility: hidden;
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: visibility 0s var(--transition-m), opacity var(--transition-m);
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
</style>
