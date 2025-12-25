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
import type { Component } from 'vue';

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

defineProps<{
  submitLabel: string;
  submitIcon?: Component;
  submitTestId?: string;
  disabled?: boolean;
}>();

const submit = (e: Event) => {
  emit('submit');
  e.preventDefault();
};
</script>

<style lang="scss" module>
.fields {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .btn {
    text-align: center;
  }
}
</style>
