<template>
  <div :class="$style.field">
    <label :class="$style.label" :for="inputId">{{ label }}</label>
    <div :class="$style.inputBox">
      <input
        :id="inputId"
        v-model="modelValue"
        :class="$style.input"
        :type="type === 'password' ? (showPassword ? 'text' : 'password') : 'text'"
        :placeholder="placeholder"
      />

      <Button
        v-if="type === 'password'"
        textual
        :icon="showPassword ? 'eye-close' : 'eye-line'"
        @click="showPassword = !showPassword"
      />
    </div>

    <div :class="$style.passwordStrength"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Button from '@components/base/button/Button.vue';
import { uuid } from '@utils';

const modelValue = defineModel<string>();

withDefaults(
  defineProps<{
    type?: 'text' | 'password';
    label: string;
    placeholder?: string;
    showPasswordStrength?: boolean;
  }>(),
  {
    type: 'text',
    showPasswordStrength: false
  }
);

const showPassword = ref(false);
const inputId = uuid();
</script>

<style lang="scss" module>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--input-field-font-size);
}

.inputBox {
  background: var(--input-field-background);
  border-radius: var(--border-radius-m);
  height: 30px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  border: 1px solid var(--input-field-border);
  transition: all var(--input-field-transition);

  .input {
    all: unset;
    appearance: none;
    flex-grow: 1;
    margin-right: 6px;

    &::placeholder {
      color: var(--input-field-placeholder);
    }
  }

  .icon {
    flex-shrink: 0;
  }

  &:hover:not(:focus-within) {
    background: var(--input-field-hover-background);
    border: 1px solid var(--input-field-hover-border);
  }

  &:focus-within {
    background: var(--input-field-focus-background);
    border: 1px solid var(--input-field-focus-border);
    box-shadow: var(--input-field-focus-box-shadow);
  }
}

.label {
  font-weight: var(--font-weight-l);
}

.passwordStrength {
}
</style>
