<template>
  <RouterLink :to="to" :class="[$style.link, classes]">
    <Icon :class="$style.icon" v-if="icon" :icon="icon" />
  </RouterLink>
</template>

<script lang="ts" setup>
import { AppIcon } from '@components/base/icon/Icon.types';
import Icon from '@components/base/icon/Icon.vue';
import { Color, useThemeStyles } from '@composables';
import { ClassNames } from '@utils';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    icon?: AppIcon;
    color?: Color;
    to: string;
  }>(),
  {
    color: 'primary'
  }
);

const classes = computed(() => props.class);
const theme = useThemeStyles(() => props.color);
</script>

<style lang="scss" module>
.link {
  background: transparent;
  color: v-bind('theme.pure.base');

  .icon {
    width: 20px;
    height: 20px;
  }
}

@media (pointer: fine) {
  .link {
    &:hover {
      background: transparent;
      color: v-bind('theme.pure.hover');
    }
  }
}
</style>
