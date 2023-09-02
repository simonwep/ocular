<template>
  <div :class="$style.field">
    <label :class="$style.label" :for="inputId">{{ label }}</label>
    <div :class="$style.inputBox">
      <input
        :id="inputId"
        ref="input"
        v-model="modelValue"
        :minlength="minLength"
        :maxlength="maxLength"
        :required="required"
        :class="$style.input"
        :type="type === 'password' ? (showPassword ? 'text' : 'password') : 'text'"
        :placeholder="placeholder"
        @valid="onValidationChange"
        @invalid="onValidationChange"
      />

      <Button
        v-if="type === 'password'"
        textual
        :icon="showPassword ? 'eye-close' : 'eye-line'"
        @click="showPassword = !showPassword"
      />
    </div>

    <p v-if="error" :class="$style.error">{{ error }}</p>

    <div v-if="showPasswordStrength && type === 'password'" :class="$style.passwordStrength">
      <div :class="$style.bar" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Button from '@components/base/button/Button.vue';
import { uuid } from '@utils';

const modelValue = defineModel<string>();

withDefaults(
  defineProps<{
    type?: 'text' | 'password';
    minLength?: number;
    maxLength?: number;
    required?: boolean;
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
const input = ref<HTMLInputElement>();
const error = ref('');
const inputId = uuid();

const calculateEntropy = (password?: string) => {
  return password ? Math.log2(new Set(password).size) * password.length : 0;
};

const onValidationChange = () => {
  error.value = input.value?.validationMessage ?? '';
};

const passwordEntropy = computed(() => calculateEntropy(modelValue.value));
const passwordBarWidth = computed(() => Math.min(1, passwordEntropy.value / 80));
const passwordBarColor = computed(() => {
  if (passwordEntropy.value < 25) {
    return 'var(--c-danger)';
  } else if (passwordEntropy.value < 60) {
    return 'var(--c-warning)';
  } else {
    return 'var(--c-success)';
  }
});
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
  border: 1px dashed var(--input-field-border);
  border-radius: var(--border-radius-m);
  height: 30px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
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
    border: 1px dashed var(--input-field-hover-border);
    background: var(--input-field-hover-background);
  }

  &:focus-within {
    border: 1px dashed var(--input-field-focus-border);
    background: var(--input-field-focus-background);
  }
}

.label {
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
}

.error {
  font-size: var(--font-size-xxs);
  font-weight: var(--font-weight-l);
  border-radius: var(--border-radius-s);
  color: var(--c-danger);
}

.passwordStrength {
  display: flex;
  flex-direction: column;

  .bar {
    width: 100%;
    height: 5px;
    border-radius: 5px;
    position: relative;
    background: var(--c-dimmed);

    &::before {
      content: '';
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: 5px;
      width: calc(v-bind('passwordBarWidth') * 100%);
      background: v-bind('passwordBarColor');
    }
  }
}
</style>
