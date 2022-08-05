<template>
  <input
    ref="input"
    :class="$style.currencyCell"
    :type="focused ? 'number' : 'text'"
    :value="value"
    @blur="focused = false"
    @focus="focus"
    @input="change"
    @keydown="keydown"
    @keydown.enter="input?.blur"
  />
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
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
const focused = ref(false);
const { n } = useI18n();

const value = computed(() => {
  const value = props.modelValue;
  return focused.value || !value ? value || '' : n(props.modelValue, 'currency');
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
  all: unset;
  display: inline-flex;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: var(--input-field-font-size);
  max-height: 100%;
  padding: 0 4px;
  caret-color: var(--input-field-caret-color);

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
