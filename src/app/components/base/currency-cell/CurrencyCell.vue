<template>
  <input
    ref="input"
    :class="[$style.currencyCell, { [$style.invalid]: invalid }]"
    type="text"
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
import { evalMathExpression } from '@utils/eval-math-expression/evalMathExpression.ts';
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
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

const input = useTemplateRef('input');
const focused = ref(false);
const innerValue = ref<string>();
const invalid = ref(false);
const { state } = useDataStore();
const { locale, n } = useI18n();

const value = computed(() =>
  invalid.value || focused.value
    ? innerValue.value
    : modelValue.value
      ? n(modelValue.value, { key: 'currency', currency: state.currency })
      : innerValue.value
);

const keydown = (e: KeyboardEvent) => {
  if (e.key === '-') {
    e.preventDefault();
  }
};

const focus = () => {
  focused.value = true;
  nextTick(() => input.value?.select());
};

const change = (e: Event) => {
  innerValue.value = (e.target as HTMLInputElement).value || undefined;
};

watch(modelValue, (value, oldValue) => {
  if ((value ?? 0) > props.max && oldValue !== undefined) {
    modelValue.value = oldValue;
    invalid.value = false; // Revert value to modelValue on next focus
  }
});

watch(focused, (value) => {
  if (value) {
    // Preserve invalid value to allow user to correct it
    if (!invalid.value) {
      innerValue.value = modelValue.value ? n(modelValue.value) : undefined;
    }

    return;
  }

  innerValue.value = innerValue.value?.trim() || undefined;
  if (!innerValue.value) {
    modelValue.value = 0;
    invalid.value = false;
    return;
  }

  try {
    modelValue.value = innerValue.value ? evalMathExpression(innerValue.value, locale.value) : 0;
    invalid.value = false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    invalid.value = true;
  }
});

defineExpose({ input });
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

  &:not(:focus).invalid {
    color: var(--c-danger-pure);
    text-decoration: underline dashed;
  }
}
</style>
