<template>
  <form :class="$style.fields" action="#" @submit="submit">
    <slot />
    <Button
      :testId="submitTestId"
      :disabled="disabled"
      :icon="submitIcon"
      :class="$style.btn"
      :text="submitLabel"
      type="submit"
    />
  </form>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { Component, computed } from 'vue';

const emit = defineEmits<{
  submit: [];
}>();

const props = defineProps<{
  maxWidth?: number;
  submitLabel: string;
  submitIcon?: Component;
  submitTestId?: string;
  disabled?: boolean;
}>();

const submit = (e: Event) => {
  emit('submit');
  e.preventDefault();
};

const maxWidthValue = computed(() => (props.maxWidth ? `${props.maxWidth}px` : 'auto'));
</script>

<style lang="scss" module>
.fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: v-bind('maxWidthValue');

  .btn {
    text-align: center;
  }
}
</style>
