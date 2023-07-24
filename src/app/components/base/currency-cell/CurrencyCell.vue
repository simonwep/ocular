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
    @paste="paste"
  />
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const modelValue = defineModel<number | undefined>();

const props = withDefaults(
  defineProps<{
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
  return focused.value || !modelValue.value ? modelValue.value || '' : n(modelValue.value, 'currency');
});

const updateModelValue = (v: number) => {
  modelValue.value = Math.max(v, 0);
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

const change = (e: Event) => {
  const v = Number((e.target as HTMLInputElement).value.trim() || NaN);
  !Number.isNaN(v) && updateModelValue(v);
};

const paste = (e: ClipboardEvent) => {
  const v = Number(e.clipboardData?.getData('text/plain').trim() || NaN);
  !Number.isNaN(v) && updateModelValue(v);
};

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
