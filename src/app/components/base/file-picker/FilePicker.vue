<template>
  <button @click="pick" type="button" :class="classes">
    <span :class="$style.label"> {{ modelValue?.name ?? placeholder }}</span>
  </button>
</template>

<script lang="ts" setup>
import { ClassNames, selectFile } from '@utils';
import { computed, useCssModule } from 'vue';

const emit = defineEmits<{
  (e: 'update:model-value', v: File): void;
}>();

const props = defineProps<{
  modelValue?: File;
  class?: ClassNames;
  placeholder?: string;
  accept?: string[];
}>();

const styles = useCssModule();
const classes = computed(() => [
  props.class,
  styles.filePicker,
  {
    [styles.empty]: !props.modelValue
  }
]);

const pick = () => {
  selectFile({
    accept: props.accept?.join(','),
    multiple: false
  }).then((file) => {
    emit('update:model-value', file);
  });
};
</script>

<style lang="scss" module>
.filePicker {
  all: unset;
  display: flex;
  align-items: center;
  background: var(--input-field-background);
  padding: 10px 15px;
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

  &:hover {
    border: 1px dashed var(--input-field-hover-border);
    background: var(--input-field-hover-background);
  }

  &:focus {
    border: 1px dashed var(--input-field-focus-border);
    background: var(--input-field-focus-background);
    box-shadow: var(--input-field-focus-box-shadow);
  }

  &.empty .label {
    color: var(--input-field-placeholder);
  }
}
</style>
