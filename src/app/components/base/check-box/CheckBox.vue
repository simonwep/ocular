<template>
  <div :class="$style.field">
    <label :class="$style.label" :for="inputId">
      <span>{{ label }}</span>
      <small v-if="subLabel">{{ subLabel }}</small>
    </label>

    <div :class="$style.box">
      <input :id="inputId" v-model="modelValue" :data-testid="testId" :class="$style.input" type="checkbox" />

      <svg :class="$style.icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path pathLength="1000" d="M 4.2647378,10.971204 9.921592,16.53967 19.942621,6.7396115" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { uuid } from '@utils/uuid/uuid.ts';

const modelValue = defineModel<boolean>({ default: false });

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
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--input-field-background);
  border-radius: var(--border-radius-m);
  transition: all var(--input-field-transition);

  .icon {
    width: 16px;
    height: 16px;
    fill: none;
    stroke-width: 2;
    stroke: var(--c-primary);
    stroke-linecap: round;
    stroke-dasharray: 1000 1000;
    stroke-dashoffset: 1000;
    transition: all var(--input-field-transition);
  }

  &:hover:not(:focus-within) {
    background: var(--input-field-hover-background);
  }

  &:focus-within {
    background: var(--input-field-focus-background);
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
    stroke-dashoffset: 0;
  }
}
</style>
