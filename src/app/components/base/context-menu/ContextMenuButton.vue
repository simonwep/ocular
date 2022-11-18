<template>
  <li :class="$style.item">
    <button :class="classes" @click="onClick">
      <Icon v-if="icon" :icon="icon" :class="$style.icon"></Icon>
      <span>{{ text }}</span>
    </button>
  </li>
</template>

<script lang="ts" setup>
import { computed, inject, useCssModule } from 'vue';
import { ClassNames } from '@utils';
import Icon from '@components/base/icon/Icon.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { ContextMenuStore, ContextMenuStoreKey } from '@components/base/context-menu/ContextMenu.types';

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void;
}>();

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    text: string | number;
    icon?: AppIcon;
    padIcon?: boolean;
    highlight?: boolean;
  }>(),
  {
    highlight: false,
    padIcon: false
  }
);

const styles = useCssModule();
const store = inject<ContextMenuStore>(ContextMenuStoreKey);

const classes = computed(() => [
  props.class,
  styles.btn,
  {
    [styles.highlight]: props.highlight,
    [styles.padIcon]: props.padIcon && !props.icon
  }
]);

const onClick = (evt: MouseEvent) => {
  store?.close();
  emit('click', evt);
};
</script>

<style lang="scss" module>
.item {
  display: flex;
  width: 100%;
}

.btn {
  all: unset;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-size-xs);
  padding: 6px 12px;
  transition: color var(--transition-s), background var(--transition-s);
  color: var(--context-menu-item-color);
  position: relative;

  .icon {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }

  &.padIcon {
    padding-left: calc(12px + 20px);
  }

  &:hover,
  &.highlight {
    color: var(--context-menu-item-color-hover);
  }

  &:hover {
    background: var(--context-menu-item-background-hover);
  }
}
</style>
