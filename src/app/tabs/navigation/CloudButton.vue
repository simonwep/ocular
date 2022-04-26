<template>
  <Button
    :class="[$style.cloudButton, classes]"
    @click="auth"
    textual
    :color="color"
    icon="cloud-line"
  />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { Color } from '@composables';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const storage = useStorage();

const color = computed((): Color => {
  switch (storage.state.value) {
    case 'authenticated':
      return 'success';
    case 'loading':
      return 'warning';
    case 'idle':
      return 'danger';
  }

  return 'danger';
});

const auth = () => {
  if (storage.state.value === 'idle') {
    storage.login();
  }
};
</script>

<style lang="scss" module>
.cloudButton {
}
</style>
