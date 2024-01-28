<template>
  <form :class="$style.fields" action="#" @submit="submit">
    <slot />
    <Button :class="$style.btn" :text="submitLabel" type="submit" />
  </form>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

defineProps<{
  submitLabel: string;
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
  width: 250px;
  gap: 12px;

  .btn {
    text-align: center;
  }
}
</style>
