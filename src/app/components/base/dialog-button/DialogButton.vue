<template>
  <Button v-bind="props" @click="open = true" />
  <Dialog :open="open" @close="close">
    <slot />
  </Dialog>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { Color } from '@composables';
import { ClassNames } from '@utils';
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  class?: ClassNames;
  icon?: AppIcon;
  text?: string;
  color?: Color;
  textual?: boolean;
  inline?: boolean;
}>();

const open = ref(false);

const close = () => {
  open.value = false;
  emit('close');
};

defineExpose({
  close: () => (open.value = false)
});
</script>
