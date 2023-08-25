<template>
  <div :class="$style.fields">
    <slot />
    <Button :class="$style.btn" :text="submitLabel" color="success" @click="emit('submit')" />
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

defineProps<{
  submitLabel: string;
}>();
</script>

<style lang="scss" module>
.fields {
  display: flex;
  flex-direction: column;
  width: 250px;
  gap: 8px;
  padding-top: 8px;

  .btn {
    text-align: center;
  }
}
</style>
