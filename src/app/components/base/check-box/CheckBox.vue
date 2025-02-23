<template>
  <div :class="$style.field">
    <label :class="$style.label" :for="inputId">
      <span>{{ label }}</span>
      <small v-if="subLabel">{{ subLabel }}</small>
    </label>

    <div :class="$style.box">
      <input :id="inputId" v-model="modelValue" :data-testid="testId" :class="$style.input" type="checkbox" />
      <RiCheckLine size="16" :class="$style.icon" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RiCheckLine } from '@remixicon/vue';
import { uuid } from '@utils';

const modelValue = defineModel<boolean>();

defineProps<{
  label: string;
  subLabel?: string;
  testId?: string;
}>();

const inputId = uuid();
</script>

<style lang="scss" module>
.field {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 6px;
  font-size: var(--input-field-font-size);
}

.label {
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  flex-grow: 1;
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
  user-select: none;

  > small {
    font-size: var(--font-size-xxs);
    color: var(--c-text-dark-muted);
  }
}

.box,
.input {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.box {
  width: 18px;
  height: 18px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--input-field-background);
  border-radius: var(--border-radius-m);
  border: 2px solid transparent;

  .icon {
    opacity: 0;
    color: var(--c-primary);
  }

  &:focus-within {
    border-color: var(--input-field-hover-border);
  }
}

.input {
  position: absolute;
  display: flex;
  align-items: center;
  transition: background-color var(--input-field-transition);
  appearance: none;
  z-index: 1;
  outline: none;

  &:checked ~ .icon {
    opacity: 1;
  }
}
</style>
