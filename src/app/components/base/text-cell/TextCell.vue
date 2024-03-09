<template>
  <span :class="classes">
    <input
      ref="input"
      :value="modelValue"
      :class="$style.input"
      type="text"
      @blur="focused = false"
      @focus="focus"
      @input="change"
      @keydown.enter="input?.blur"
    />
  </span>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, useCssModule } from 'vue';

const modelValue = defineModel<string>();

const props = withDefaults(
  defineProps<{
    inline?: boolean;
  }>(),
  {
    inline: false
  }
);

const input = ref<HTMLInputElement>();
const styles = useCssModule();
const focused = ref(false);

const classes = computed(() => [
  styles.textInput,
  {
    [styles.empty]: !modelValue.value,
    [styles.inline]: props.inline
  }
]);

const focus = () => {
  focused.value = true;
  nextTick(() => (input.value as HTMLInputElement).select());
};

const change = (e: Event) => {
  modelValue.value = (e.target as HTMLInputElement).value;
};
</script>

<style lang="scss" module>
.textInput {
  position: relative;
  display: inline-block;
  width: 100%;

  .input {
    all: unset;
    max-width: var(--input-field-max-width);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:not(.inline) {
    border-radius: var(--border-radius-s);
    font-size: var(--input-field-font-size);
    transition: all var(--input-field-transition);

    .input {
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
}
</style>
