<template>
  <p :class="[$style.alert, classes]">
    {{ text }}
  </p>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Color, useThemeStyles } from '@composables';
import { ClassNames } from '@utils';

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    text: string;
    color?: Color;
  }>(),
  {
    color: 'primary'
  }
);

const classes = computed(() => props.class);
const theme = useThemeStyles(() => props.color);
</script>

<style lang="scss" module>
.alert {
  background: v-bind('theme.color.base');
  color: v-bind('theme.text.base');
  padding: 4px 6px;
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
  border-radius: var(--border-radius-m);
}
</style>
