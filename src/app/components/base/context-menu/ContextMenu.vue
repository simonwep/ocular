<template>
  <div ref="reference" v-tooltip="{ text: tooltip, position: tooltipPosition }" :class="classes">
    <slot :toggle="toggle" />
  </div>
  <div ref="popper" :class="[$style.popper, { [$style.visible]: visible }]">
    <div :class="listClasses">
      <slot name="header" />

      <ul v-if="options?.length || $slots.options" :class="$style.options">
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

      <span v-else-if="placeholder" :class="$style.placeholder">
        {{ placeholder }}
      </span>
    </div>
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
import { useOutOfElementClick } from '@composables/out-of-element-click/useOutOfElementClick.ts';
import { ClassNames } from '@utils/types.ts';
import { createPopper, Modifier, Instance, Placement } from '@popperjs/core';
import { computed, provide, ref, useCssModule, useTemplateRef, watch } from 'vue';

const emit = defineEmits<{
  select: [option: ContextMenuOption];
  open: [];
  close: [];
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
    offset?: [number, number];
    placeholder?: string;
  }>(),
  {
    position: 'right-end',
    offset: () => [10, 10]
  }
);

const styles = useCssModule();
const reference = useTemplateRef('reference');
const popper = useTemplateRef('popper');
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
        { name: 'offset', options: { offset: props.offset } },
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

watch(visible, (value) => (value ? emit('open') : emit('close')));

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
  z-index: var(--context-menu-z-index);

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
  display: flex;
  flex-direction: column;
  -webkit-backdrop-filter: var(--context-menu-backdrop);
  backdrop-filter: var(--context-menu-backdrop);
  box-shadow: var(--context-menu-shadow);
  border-radius: var(--border-radius-m);
  padding: 6px 0;
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

.options {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  list-style: none outside none;
  max-height: 130px;
  overflow: auto;
}

.placeholder {
  display: inline-block;
  padding: 0 8px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-m);
  color: var(--c-primary-text-accent);
}
</style>
