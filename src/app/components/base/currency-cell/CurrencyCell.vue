<template>
  <input
    ref="input"
    :class="[$style.currencyCell, { [$style.invalid]: invalid }]"
    type="text"
    :name="name"
    :value="value"
    :data-testid="testId"
    @blur="focused = false"
    @focus="focus"
    @input="change"
    @keydown.enter="input?.blur()"
  />
</template>

<script lang="ts" setup>
import { useNumberFormatter } from '@composables/number-formatter/useNumberFormatter.ts';
import { useSettingsStore } from '@store/settings';
import { evalMathExpression } from '@utils/eval-math-expression/evalMathExpression.ts';
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';

const modelValue = defineModel<number>();

const props = withDefaults(
  defineProps<{
    max?: number;
    name?: string;
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
const { n, separators } = useNumberFormatter();
const { state: settings } = useSettingsStore();

const value = computed(() =>
  invalid.value || focused.value
    ? innerValue.value
    : modelValue.value
      ? n(modelValue.value, {
          key: 'blank',
          minimumFractionDigits: settings.general.showMinimumFractionDigits ? 2 : 0
        })
      : innerValue.value
);

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
      innerValue.value = modelValue.value ? n(modelValue.value, { key: 'blank' }) : undefined;
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
    modelValue.value = innerValue.value
      ? Math.round(evalMathExpression(innerValue.value, separators.value) * 100) / 100
      : 0;
    invalid.value = false;
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
  text-align: right;
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
