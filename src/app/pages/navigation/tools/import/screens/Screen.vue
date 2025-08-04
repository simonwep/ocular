<template>
  <div :class="$style.screen">
    <h1 v-if="title" :class="$style.title">
      <Button v-if="back" color="dimmed" :icon="RiArrowLeftSLine" textual @click="back" />
      <span>{{ title }}</span>
    </h1>
    <div :class="[classes, $style.content]">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { RiArrowLeftSLine } from '@remixicon/vue';
import { ClassNames } from '@utils/types.ts';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  title?: string;
  back?: () => void;
}>();

const classes = computed(() => props.class);
</script>

<style lang="scss" module>
.screen {
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.title {
  display: flex;
  align-items: center;
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-m);
  margin-bottom: 10px;
  gap: 5px;
}
</style>
