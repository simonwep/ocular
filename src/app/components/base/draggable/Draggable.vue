<template>
  <div
    ref="draggable"
    :class="$style.draggable"
    draggable="true"
    @dragend="dragEnd"
    @dragover="dragOver"
    @dragleave="dragLeave"
    @drop="drop"
    @drag="drag"
    @dragstart="dragStart"
  >
    <Button :color="store.group === props.name ? 'primary' : 'dimmed'" :icon="icon" textual />

    <div
      v-if="store.source === props.id && top && left && label"
      :style="{ top: `${top + 5}px`, left: `${left + 5}px` }"
      :class="$style.content"
    >
      <span :class="$style.text">{{ label }}</span>
    </div>

    <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
    <div ref="element" :class="$style.hidden">hidden</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { DraggableEvent, ReorderEvent } from './Draggable.types';
import { store } from './store';

const emit = defineEmits<{
  (e: 'drop', data: ReorderEvent): void;
}>();

const props = defineProps<{
  text: (store: DraggableEvent) => string | undefined;
  name: string;
  id: string;
}>();

const draggable = ref<HTMLElement>();
const element = ref<HTMLElement>();
const left = ref(0);
const top = ref(0);

const active = computed(() => props.id === store.target && store.type);

const icon = computed((): AppIcon => {
  return active.value ? (store.type === 'before' ? 'skip-up-line' : 'skip-down-line') : 'draggable';
});

const label = computed(() => {
  return store.target && store.target && store.source ? props.text?.(store as DraggableEvent) : undefined;
});

const dragStart = (evt: DragEvent) => {
  if (evt.dataTransfer && element.value) {
    store.group = props.name;
    store.source = props.id;
    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setDragImage(element.value, Infinity, Infinity);
    evt.dataTransfer.setData('text/plain', props.name);
  }
};

const drag = (evt: DragEvent) => {
  left.value = evt.pageX;
  top.value = evt.pageY;
};

const dragOver = (evt: DragEvent) => {
  if (store.group === props.name) {
    const rect = draggable.value?.getBoundingClientRect();
    evt.preventDefault();

    if (rect && props.id !== store.source) {
      const type = evt.pageY < rect.top + rect.height / 2 ? 'before' : 'after';
      store.target = props.id;
      store.type = type;
    }
  }
};

const dragLeave = (evt: DragEvent) => {
  if (evt.pageX && evt.pageY && store.target !== props.id) {
    store.type = undefined;
    store.target = undefined;
  }
};

const dragEnd = () => {
  store.type = undefined;
  store.target = undefined;
  store.source = undefined;
  store.group = undefined;
};

const drop = (evt: DragEvent) => {
  if (store.target && store.target && store.source) {
    emit('drop', store as Required<DraggableEvent>);
  }

  evt.preventDefault();
};
</script>

<style lang="scss" module>
.draggable {
  display: flex;
}

.content {
  position: fixed;
  background: var(--app-background);
  padding: 4px 8px;
  box-shadow: var(--dialog-box-shadow);
  border-radius: var(--border-radius-m);
  z-index: 10;

  .text {
    font-size: var(--font-size-xs);
    color: var(--theme-text);
  }
}

.hidden {
  position: fixed;
  visibility: hidden;
}
</style>
