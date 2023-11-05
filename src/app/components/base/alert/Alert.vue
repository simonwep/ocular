<template>
  <p :class="[$style.alert, classes]">
    <Icon :class="$style.icon" :icon="mapping[type][1]" />
    <span>{{ text }}</span>
  </p>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { AlertType } from '@components/base/alert/Alert.types';
import { AppIcon } from '@components/base/icon/Icon.types';
import Icon from '@components/base/icon/Icon.vue';
import { Color, useThemeStyles } from '@composables';
import { ClassNames } from '@utils';

const props = defineProps<{
  class?: ClassNames;
  text: string;
  type: AlertType;
}>();

const mapping: Record<AlertType, [Color, AppIcon]> = {
  error: ['danger', 'error-warning-line'],
  success: ['success', 'check'],
  warning: ['warning', 'error-warning-line']
};

const classes = computed(() => props.class);
const theme = useThemeStyles(() => mapping[props.type][0]);
</script>

<style lang="scss" module>
.alert {
  display: flex;
  gap: 4px;
  color: v-bind('theme.color.base');
  border: 2px dashed v-bind('theme.color.base');
  padding: 4px 6px;
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
  border-radius: var(--border-radius-m);

  .icon {
    width: 17px;
    flex-shrink: 0;
  }
}
</style>
