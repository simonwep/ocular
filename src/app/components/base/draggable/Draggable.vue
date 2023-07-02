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
    <Button :color="dropping ? 'primary' : 'dimmed'" :icon="icon" textual />

    <div v-if="dragging && top && left" :style="{ top: `${top + 5}px`, left: `${left + 5}px` }" :class="$style.content">
      <span :class="$style.text">{{ text }}</span>
    </div>

    <div ref="element" :class="$style.hidden">hidden</div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { computed, ref } from 'vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { DropEvent } from './types';

const emit = defineEmits<{
  (e: 'drop', data: DropEvent): void;
}>();

const props = defineProps<{
  text: string;
  data: string;
}>();

const dragging = ref(false);
const dropping = ref<'up' | 'down'>();
const draggable = ref<HTMLElement>();
const element = ref<HTMLElement>();
const left = ref(0);
const top = ref(0);

const icon = computed((): AppIcon => (dropping.value ? `skip-${dropping.value}-line` : 'draggable'));

const dragStart = (evt: DragEvent) => {
  if (evt.dataTransfer && element.value) {
    dragging.value = true;
    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('text/plain', props.data);
    evt.dataTransfer.setDragImage(element.value, Infinity, Infinity);
  }
};

const drag = (evt: DragEvent) => {
  left.value = evt.pageX;
  top.value = evt.pageY;
};

const dragOver = (evt: DragEvent) => {
  const rect = draggable.value?.getBoundingClientRect();
  evt.preventDefault();

  if (rect && !dragging.value) {
    const middle = rect.top + rect.height / 2;
    dropping.value = evt.pageY < middle ? 'up' : 'down';
  }
};

const dragLeave = (evt: DragEvent) => {
  if (evt.pageX && evt.pageY) {
    dropping.value = undefined;
  }
};

const dragEnd = () => {
  dropping.value = undefined;
  dragging.value = false;
};

const drop = (evt: DragEvent) => {
  if (evt.dataTransfer) {
    emit('drop', {
      source: props.data,
      target: evt.dataTransfer.getData('text/plain'),
      type: dropping.value === 'up' ? 'before' : 'after'
    });
  }

  dropping.value = undefined;
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
  padding: 4px 6px;
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
