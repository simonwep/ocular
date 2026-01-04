<template>
  <button
    v-if="state.canUndo"
    ref="button"
    v-tooltip="t('feature.undoButton.undo')"
    data-testid="undo-button"
    :class="[$style.undoButton, classes]"
    type="button"
    @click="undo"
  >
    <RiResetLeftLine />
  </button>
</template>

<script lang="ts" setup>
import { RiResetLeftLine } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { ClassNames } from '@utils/types.ts';
import { usePreferredReducedMotion } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { state, undoLastAction } = useDataStore();
const { state: settings } = useSettingsStore();
const reducedMotion = usePreferredReducedMotion();
const button = useTemplateRef('button');

const classes = computed(() => props.class);

const undo = () => {
  if (reducedMotion.value === 'no-preference' && settings.appearance.animations) {
    button.value?.animate([{ transform: 'none' }, { transform: 'rotate(-360deg)' }], {
      duration: 150,
      iterations: 1,
      easing: 'ease-in-out'
    });
  }

  undoLastAction();
};
</script>

<style lang="scss" module>
.undoButton {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-primary);
  color: var(--c-primary-text);
  border-radius: 100px;
  height: 24px;
  width: 24px;
  padding: 0;
  transition: all var(--transition-s);
  cursor: pointer;

  &:hover {
    background: var(--c-primary-hover);
  }

  > svg {
    width: 16px;
    height: 16px;
  }
}
</style>
