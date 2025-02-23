<template>
  <input
    ref="input"
    :class="$style.currencyCell"
    :type="focused ? 'number' : 'text'"
    :value="value"
    :data-testid="testId"
    @blur="focused = false"
    @focus="focus"
    @input="change"
    @keydown="keydown"
    @keydown.enter="input?.blur()"
  />
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/state';
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const modelValue = defineModel<number>();

const props = withDefaults(
  defineProps<{
    max?: number;
    testId?: string;
  }>(),
  {
    max: Number.MAX_SAFE_INTEGER
  }
);

const input = ref<HTMLInputElement>();
const focused = ref(false);
const { state } = useDataStore();
const { n } = useI18n();

const value = computed(() =>
  focused.value || !modelValue.value
    ? modelValue.value || ''
    : n(modelValue.value, { key: 'currency', currency: state.currency })
);

const updateModelValue = (raw?: string) => {
  const number = Number(raw?.trim() || NaN);
  modelValue.value = !Number.isNaN(number) ? number : 0;
};

const keydown = (e: KeyboardEvent) => {
  if (e.key === '-') {
    e.preventDefault();
  }
};

const focus = () => {
  focused.value = true;
  nextTick(() => (input.value as HTMLInputElement).select());
};

const change = (e: Event) => updateModelValue((e.target as HTMLInputElement).value);

watch(
  () => modelValue.value,
  (value, oldValue) => {
    if ((value ?? 0) > props.max && oldValue !== undefined) {
      modelValue.value = oldValue;
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
