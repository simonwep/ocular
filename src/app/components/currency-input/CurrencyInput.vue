<template>
  <div :class="classes">
    <input ref="input"
           :type="focused ? 'number' : 'text'"
           :value="value"
           @blur="focused = false"
           @focus="focus"
           @input="change"
           @keydown.enter="input.blur()"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, useCssModule} from 'vue';

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const props = withDefaults(defineProps<{
  modelValue?: number;
  locale?: string;
  currency?: string;
}>(), {
  locale: 'en-us',
  currency: 'USD'
});

const input = ref<HTMLInputElement>();
const styles = useCssModule();
const focused = ref(false);

const focus = () => {
  focused.value = true;

  nextTick(() => {
    const element = input.value as HTMLInputElement;
    element.select();
  });
};

const classes = computed(() => [
  styles.currencyInput,
  {[styles.empty]: !props.modelValue}
]);

const formatter = computed(() => {
  return new Intl.NumberFormat(props.locale, {
    currency: props.currency,
    style: 'currency'
  });
});

const value = computed(() => {
  const value = props.modelValue;
  return focused.value || !value ? (value || '') :
      formatter.value.format(props.modelValue);
});

const change = (e: InputEvent) => {
  const v = Number((e.target as HTMLInputElement).value);

  if (!Number.isNaN(v)) {
    emit('update:modelValue', v);
  }
};

</script>

<style lang="scss" module>

.currencyInput {
  width: auto;
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
