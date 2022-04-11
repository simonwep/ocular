<template>
  <span :class="classes">
    <input
      ref="input"
      :type="focused ? 'number' : 'text'"
      :value="value"
      @blur="focused = false"
      @focus="focus"
      @input="change"
      @keydown="keydown"
      @wheel="wheel"
      @keydown.enter="input?.blur"
    />
  </span>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, useCssModule } from 'vue';

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    locale?: string;
    currency?: string;
  }>(),
  {
    locale: 'en-us',
    currency: 'USD',
  }
);

const input = ref<HTMLInputElement>();
const styles = useCssModule();
const focused = ref(false);

const classes = computed(() => [
  styles.currencyInput,
  { [styles.empty]: !props.modelValue },
]);

const formatter = computed(() => {
  return new Intl.NumberFormat(props.locale, {
    currency: props.currency,
    style: 'currency',
  });
});

const value = computed(() => {
  const value = props.modelValue;
  return focused.value || !value
    ? value || ''
    : formatter.value.format(props.modelValue);
});

const updateModelValue = (v: number) => {
  emit('update:modelValue', Math.max(v, 0));
};

const keydown = (e: KeyboardEvent) => {
  if (e.key === '-') {
    e.preventDefault();
  }
};

const focus = () => {
  focused.value = true;

  nextTick(() => {
    const element = input.value as HTMLInputElement;
    element.select();
  });
};

const change = (e: Event) => {
  const v = Number((e.target as HTMLInputElement).value);
  !Number.isNaN(v) && updateModelValue(v);
};

const wheel = (e: WheelEvent) => {
  if (focused.value) {
    const value = e.ctrlKey ? 100 : e.shiftKey ? 10 : 1;
    const dir = e.deltaY > 0 ? -1 : 1;
    updateModelValue((props.modelValue ?? 0) + value * dir);
    e.preventDefault();
  }
};
</script>

<style lang="scss" module>
.currencyInput {
  display: inline-block;
  width: auto;
  border: 1px solid var(--input-field-border);
  background: var(--input-field-background);
  border-radius: var(--border-radius-s);
  font-size: var(--input-field-font-size);
  transition: all var(--input-field-transition);

  &:not(.empty) {
    border-color: transparent;
  }

  &:hover {
    border: 1px solid var(--input-field-hover-border);
    background: var(--input-field-hover-background);
  }

  &:focus-within {
    border: 1px solid var(--input-field-focus-border);
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
