<template>
  <div ref="reference" :class="$style.reference" @focusout="focused--" @focusin="focused++">
    <slot />
  </div>
  <div v-if="visible" ref="popper" :class="$style.popper" @focusout="focused--" @focusin="focused++">
    <ul :class="$style.list">
      <li v-for="action of actions()" :key="action.label" :class="$style.item">
        <button
          :class="$style.btn"
          :data-testid="action.id ? `cell-menu-action-${action.id}` : undefined"
          tabindex="0"
          type="button"
          @click="triggerAction(action)"
        >
          {{ action.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { CellMenuAction } from '@components/base/cell-menu/CellMenu.types';
import { uuid } from '@utils/uuid/uuid.ts';
import { ref, watch } from 'vue';

defineProps<{
  actions: () => CellMenuAction[];
}>();

const anchorId = `--${uuid()}`;

const visible = ref(false);
const focused = ref(0);

let frame = -1;

watch(focused, (count) => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => (visible.value = count > 0));
});

const triggerAction = (action: CellMenuAction) => {
  action.handle();
  cancelAnimationFrame(frame);
  visible.value = false;
};
</script>

<style lang="scss" module>
.reference {
  display: inline-flex;
  anchor-name: v-bind(anchorId);
}

.popper {
  display: flex;
  position: absolute; // fixed doesn't work in safari
  pointer-events: all;
  z-index: 1;
  margin-bottom: 5px;
  inset: auto;
  position-anchor: v-bind(anchorId);
  position-area: top span-right;
}

.list {
  list-style: none outside none;
  display: flex;
  align-items: flex-end;
  border-radius: var(--border-radius-m);
  box-shadow: var(--cell-menu-shadow);
  backdrop-filter: var(--cell-menu-backdrop);
  -webkit-backdrop-filter: var(--cell-menu-backdrop);
  overflow: hidden;

  .item {
    display: flex;
    flex-shrink: 0;

    .btn {
      all: unset;
      width: 100%;
      cursor: pointer;
      text-align: left;
      font-size: var(--font-size-xxs);
      font-weight: var(--font-weight-l);
      color: var(--c-primary-text);
      padding: 4px 6px;
      transition: all var(--transition-m);

      &:hover {
        background: var(--c-primary-hover);
      }
    }

    &:not(:first-child) {
      border-left: 1px solid var(--app-background);
    }
  }
}
</style>
