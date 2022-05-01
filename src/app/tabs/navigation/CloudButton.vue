<template>
  <Button :class="[$style.cloudButton, classes]" @click="auth" textual :color="color" :icon="icon" />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { Color } from '@composables';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const { login, state } = useStorage();

const icon = computed((): AppIcon => {
  switch (state.status) {
    case 'syncing':
      return 'refresh-line';
    case 'idle':
      return 'cloud-off-line';
  }

  return 'cloud-line';
});

const color = computed((): Color => {
  switch (state.status) {
    case 'authenticated':
      return 'success';
    case 'loading':
      return 'warning';
    case 'idle':
      return 'danger';
    case 'syncing':
      return 'primary';
  }

  return 'danger';
});

const auth = () => {
  if (state.status === 'idle') {
    login();
  }
};
</script>

<style lang="scss" module>
.cloudButton {
}
</style>
