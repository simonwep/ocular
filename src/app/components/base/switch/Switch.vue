<template>
  <div :class="classes">
    <input ref="checkbox" :id="id" :class="$style.input" type="checkbox" @click.stop="() => 0" @input="change" />
    <div :class="$style.knob" />
  </div>
</template>

<script lang="ts" setup>
import { ClassNames } from '@utils';
import { computed, ref, useCssModule, watchEffect } from 'vue';

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
}>();

const props = defineProps<{
  class?: ClassNames;
  id?: string;
  modelValue: boolean;
}>();

const checkbox = ref<HTMLInputElement>();
const styles = useCssModule();
const classes = computed(() => [styles.switch, props.class, { [styles.checked]: props.modelValue }]);

const change = () => {
  emit('update:modelValue', !!checkbox.value?.checked);
};

watchEffect(() => {
  if (checkbox.value) {
    checkbox.value.checked = props.modelValue;
  }
});
</script>

<style lang="scss" module>
$width: 46px;
$height: 22px;
$knob: 14px;
$border: 1px;

$knobMargin: ($height - $knob - $border * 2) / 2;

.switch {
  position: relative;
  width: $width;
  height: $height;
  border-radius: $height;
  cursor: pointer;
  border: $border solid var(--input-field-border);
  transition: all var(--transition-m);

  .input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
    z-index: 1;
    opacity: 0;
  }

  .knob {
    position: absolute;
    top: $knobMargin;
    border-radius: $knob;
    bottom: 0;
    left: 0;
    width: $knob;
    height: $knob;
    background: var(--input-field-border);
    transition: all var(--transition-m);
    transform: translateX($knobMargin);
  }

  &.checked {
    border-color: var(--c-primary);
    background: var(--c-primary);

    .knob {
      transform: translateX($width - $knob - $knobMargin - $border * 2);
      background: var(--theme);
    }
  }

  &:focus-within {
    box-shadow: var(--input-field-focus-box-shadow);
    border-color: var(--input-field-focus-border);

    &:not(.checked) {
      background: var(--input-field-focus-background);
    }
  }
}
</style>
