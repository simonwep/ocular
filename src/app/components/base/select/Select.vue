<template>
  <div :class="$style.select">
    <label :for="fieldId" :class="$style.label">{{ label }}</label>

    <ContextMenu
      :testId="testId"
      tooltipPosition="bottom"
      :options="options"
      position="bottom-start"
      @select="modelValue = $event.id"
    >
      <template #default="{ toggle }">
        <button :id="fieldId" :data-testid="testId" :class="$style.btn" type="button" @click="toggle">
          {{ currentValue }}
        </button>
      </template>
    </ContextMenu>
  </div>
</template>

<script lang="ts" setup>
import { ContextMenuOption, ContextMenuOptionId } from '@components/base/context-menu/ContextMenu.types.ts';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { uuid } from '@utils';
import { computed } from 'vue';

const modelValue = defineModel<ContextMenuOptionId>();

const props = defineProps<{
  label: string;
  options?: ContextMenuOption[];
  testId?: string;
}>();

const fieldId = uuid();
const currentValue = computed(
  () => props.options?.find((option) => option.id === modelValue.value)?.label ?? 'Select...'
);
</script>

<style lang="scss" module>
.select {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
}

.btn {
  all: unset;
  cursor: pointer;
  background: var(--input-field-background);
  border: 1px solid var(--input-field-border);
  border-radius: var(--border-radius-m);
  height: 30px;
  width: 100%;
  padding: 0 12px;
  display: flex;
  align-items: center;
  transition: all var(--input-field-transition);
  font-size: var(--input-field-font-size);

  &:hover:not(:focus-within) {
    border-color: var(--input-field-hover-border);
    background: var(--input-field-hover-background);
  }

  &:focus-within {
    box-shadow: 0 0 0 1px inset var(--input-field-hover-border);
    border-color: var(--input-field-focus-border);
    background: var(--input-field-focus-background);
  }
}
</style>
