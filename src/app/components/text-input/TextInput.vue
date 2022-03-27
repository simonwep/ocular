<template>
  <span :class="classes">
    <input ref="input"
           :value="modelValue"
           type="text"
           @blur="focused = false"
           @focus="focus"
           @input="change"
           @keydown.enter="input.blur"/>
  </span>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, useCssModule} from 'vue';

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const props = defineProps<{
  modelValue?: string;
}>();

const input = ref<HTMLInputElement>();
const styles = useCssModule();
const focused = ref(false);

const classes = computed(() => [
  styles.textInput,
  {[styles.empty]: !props.modelValue}
]);

const focus = () => {
  focused.value = true;

  nextTick(() => {
    const element = input.value as HTMLInputElement;
    element.select();
  });
};

const change = (e: InputEvent) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};

</script>

<style lang="scss" module>

.textInput {
  display: inline-block;
  width: 100%;
  border: var(--input-field-border);
  background: var(--input-field-background);
  border-radius: var(--border-radius-s);
  font-size: var(--input-field-font-size);
  transition: all var(--transition-s);

  &:not(.empty) {
    border-color: transparent;
  }

  &:hover {
    border: var(--input-field-hover-border);
    background: var(--input-field-hover-background);
  }

  &:focus-within {
    border: var(--input-field-focus-border);
    background: var(--input-field-focus-background);
    box-shadow: var(--input-field-focus-box-shadow);
  }

  > input {
    all: unset;
    width: 100%;
    max-height: 100%;
    padding: 2px 4px;
    caret-color: var(--input-field-caret-color);

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

</style>
