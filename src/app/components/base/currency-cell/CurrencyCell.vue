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
import { computed, nextTick, ref, useCssModule, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    max?: number;
  }>(),
  {
    max: Number.MAX_SAFE_INTEGER
  }
);

const input = ref<HTMLInputElement>();
const styles = useCssModule();
const focused = ref(false);
const { n } = useI18n();

const classes = computed(() => [
  styles.currencyCell,
  { [styles.empty]: !props.modelValue }
]);

const value = computed(() => {
  const value = props.modelValue;
  return focused.value || !value
    ? value || ''
    : n(props.modelValue, 'currency');
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

watch(
  () => props.modelValue,
  (value, oldValue) => {
    if ((value ?? 0) > props.max && oldValue !== undefined) {
      emit('update:modelValue', oldValue);
    }
  }
);
</script>

<style lang="scss" module>
.currencyCell {
  display: inline-block;
  width: auto;
  border: 1px solid var(--input-field-border);
  background: var(--input-field-background);
  border-radius: var(--border-radius-s);
  font-size: var(--input-field-font-size);
  transition: all var(--input-field-transition);

  &:hover {
    border: 1px solid var(--input-field-hover-border);
    background: var(--input-field-hover-background);
  }

  &:not(.empty) {
    border-color: transparent;

    &:hover {
      border: 1px solid var(--input-field-border);
      background: var(--input-field-hover-background);
    }
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
