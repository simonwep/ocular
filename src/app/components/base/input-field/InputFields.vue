<template>
  <div :class="$style.fields">
    <h3 :class="$style.title">{{ title }}</h3>
    <slot />
    <Button :class="$style.btn" :text="submitLabel ?? title" color="success" @click="emit('submit')" />
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

defineProps<{
  title: string;
  submitLabel?: string;
}>();
</script>

<style lang="scss" module>
.fields {
  display: flex;
  flex-direction: column;
  width: 225px;
  gap: 8px;
  padding-top: 8px;

  .title {
    text-align: center;
    font-weight: var(--font-weight-l);
    font-style: var(--font-size-m);
    padding-bottom: 8px;
  }

  .btn {
    text-align: center;
  }
}
</style>
