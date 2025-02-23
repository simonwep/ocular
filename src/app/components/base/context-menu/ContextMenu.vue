<template>
  <div ref="reference" v-tooltip="{ text: tooltip, position: tooltipPosition }" :class="classes">
    <slot :toggle="toggle" />
  </div>
  <div ref="popper" :class="[$style.popper, { [$style.visible]: visible }]">
    <ul :class="listClasses">
      <slot v-if="$slots.options" name="options" />
      <template v-else-if="options">
        <ContextMenuButton
          v-for="option of options"
          :key="option.id"
          :testId="`${testId}-${option.id}`"
          :padIcon="hasOptionWithIcon"
          :text="option.label ?? option.id"
          :icon="option.icon"
          :muted="option.muted"
          :highlight="option.id === highlight"
          @click="select(option)"
        />
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import ContextMenuButton from './ContextMenuButton.vue';
import {
  ContextMenuOption,
  ContextMenuOptionId,
  ContextMenuStore,
  ContextMenuStoreKey
} from '@components/base/context-menu/ContextMenu.types';
import { useOutOfElementClick } from '@composables';
import { createPopper, Modifier, Instance, Placement } from '@popperjs/core';
import { ClassNames } from '@utils';
import { computed, provide, ref, useCssModule, watch } from 'vue';

const emit = defineEmits<{
  (e: 'select', option: ContextMenuOption): void;
}>();

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    tooltip?: string;
    tooltipPosition?: Placement;
    position?: Placement;
    options?: ContextMenuOption[];
    highlight?: ContextMenuOptionId;
    testId?: string;
  }>(),
  {
    position: 'right-end'
  }
);

const styles = useCssModule();
const reference = ref<HTMLButtonElement>();
const popper = ref<HTMLDivElement>();
const visible = ref(false);
const placement = ref<'top' | 'bottom' | 'left' | 'right' | 'auto'>('auto');
let instance: Instance | undefined;

useOutOfElementClick([popper, reference], () => (visible.value = false));

watch([visible, reference, popper], () => {
  if (visible.value && reference.value && popper.value) {
    instance?.destroy();
    instance = createPopper(reference.value, popper.value, {
      placement: props.position,
      modifiers: [
        { name: 'offset', options: { offset: [10, 10] } },
        {
          name: 'positionTracker',
          enabled: true,
          phase: 'afterWrite',
          fn: ({ state }) => void (placement.value = state.placement.split('-')[0] as 'auto')
        } satisfies Modifier<'positionTracker', Record<string, never>>
      ]
    });
  }
});

watch(
  () => props.position,
  (placement) => instance?.setOptions({ placement })
);

const hasOptionWithIcon = computed(() => props.options?.some((v) => v.icon));
const classes = computed(() => [props.class, styles.reference]);
const listClasses = computed(() => [styles.list, { [styles[placement.value]]: placement.value in styles }]);

const select = (option: ContextMenuOption): void => {
  emit('select', option);
  visible.value = false;
};

const toggle = () => requestAnimationFrame(() => (visible.value = !visible.value));

provide<ContextMenuStore>(ContextMenuStoreKey, {
  close: () => requestAnimationFrame(() => (visible.value = false))
});
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.reference {
  display: inline-flex;
}

.popper {
  display: flex;
  position: absolute;
  pointer-events: none;
  z-index: 1;

  &.visible {
    pointer-events: all;

    .list {
      visibility: visible;
      opacity: 1;
      transform: none;
    }
  }
}

.list {
  list-style: none outside none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  -webkit-backdrop-filter: var(--context-menu-backdrop);
  backdrop-filter: var(--context-menu-backdrop);
  box-shadow: var(--context-menu-shadow);
  border-radius: var(--border-radius-m);
  padding: 6px 0;
  max-height: 130px;
  overflow: auto;
  visibility: hidden;
  opacity: 0;
  transition: all var(--transition-s);

  @include globals.onMobileDevices {
    max-height: 200px;
  }

  &.top {
    transform: translateY(6px);
  }

  &.bottom {
    transform: translateY(-6px);
  }

  &.left {
    transform: translateX(6px);
  }

  &.right {
    transform: translateX(-6px);
  }
}
</style>
