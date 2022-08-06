<template>
  <dialog ref="dialog" :class="classes" @transitionend="transitionEnd">
    <div ref="content" :class="$style.content">
      <slot />
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, useCssModule, watch, watchEffect } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
}>();

const visible = ref(false);
const content = ref<HTMLDivElement>();
const dialog = ref<HTMLDialogElement>();

const styles = useCssModule();
const classes = computed(() => [styles.dialog, { [styles.open]: visible.value }]);

const detectOutOfBoundsClick = (e: MouseEvent) => {
  if (props.open && !e.composedPath().includes(content.value as HTMLDivElement)) {
    emit('close');
  }
};

const transitionEnd = () => {
  if (!props.open) {
    dialog.value?.close();
  }
};

watch(
  () => props.open,
  (value) => {
    if (value) {
      dialog.value?.showModal();
      visible.value = true;
    } else {
      visible.value = false;
    }
  }
);

onUnmounted(() => window.removeEventListener('click', detectOutOfBoundsClick));

watchEffect(() => {
  void props.open;

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
