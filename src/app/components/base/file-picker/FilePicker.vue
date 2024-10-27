<template>
  <button type="button" :class="classes" @click="pick">
    <span :class="$style.label"> {{ modelValue?.name ?? placeholder }}</span>
  </button>
</template>

<script lang="ts" setup>
import { ClassNames, selectFile } from '@utils';
import { computed, useCssModule } from 'vue';

const modelValue = defineModel<File | undefined>();

const props = defineProps<{
  class?: ClassNames;
  placeholder?: string;
  accept?: string[];
}>();

const styles = useCssModule();
const classes = computed(() => [
  props.class,
  styles.filePicker,
  {
    [styles.empty]: !modelValue.value
  }
]);

const pick = () => {
  selectFile({
    accept: props.accept?.join(','),
    multiple: false
  }).then((file) => {
    modelValue.value = file;
  });
};
</script>

<style lang="scss" module>
.filePicker {
  all: unset;
  display: flex;
  align-items: center;
  background: var(--input-field-background);
  padding: 8px 12px;
  border-radius: var(--border-radius-m);
  cursor: pointer;
  border: 1px dashed var(--input-field-border);
  transition: var(--input-field-transition);
  overflow: hidden;

  .icon {
    height: 15px;
    width: auto;
    margin-right: 10px;
  }

  .label {
    font-size: var(--input-field-font-size);
    font-weight: var(--font-weight-m);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &:hover:not(:focus) {
    border: 1px dashed var(--input-field-hover-border);
    background: var(--input-field-hover-background);
  }

  &:focus {
    border: 1px dashed var(--input-field-focus-border);
    background: var(--input-field-focus-background);
  }

  &.empty .label {
    color: var(--input-field-placeholder);
  }
}
</style>
