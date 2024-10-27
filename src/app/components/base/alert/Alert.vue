<template>
  <p :class="[$style.alert, classes]">
    <component :is="mapping[type][1]" :class="$style.icon" />
    <span>{{ text }}</span>
  </p>
</template>

<script lang="ts" setup>
import { AlertType } from '@components/base/alert/Alert.types';
import { Color, useThemeStyles } from '@composables';
import { RiCheckLine, RiErrorWarningLine } from '@remixicon/vue';
import { ClassNames } from '@utils';
import { computed } from 'vue';
import type { Component } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  text: string;
  type: AlertType;
}>();

const mapping: Record<AlertType, [Color, Component]> = {
  error: ['danger', RiErrorWarningLine],
  success: ['success', RiCheckLine],
  warning: ['warning', RiErrorWarningLine]
};

const classes = computed(() => props.class);
const theme = useThemeStyles(() => mapping[props.type][0]);
</script>

<style lang="scss" module>
.alert {
  display: flex;
  gap: 4px;
  color: v-bind('theme.text.base');
  background: v-bind('theme.color.base');
  padding: 8px 10px;
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
  border-radius: var(--border-radius-m);

  .icon {
    width: 17px;
    flex-shrink: 0;
  }
}
</style>
