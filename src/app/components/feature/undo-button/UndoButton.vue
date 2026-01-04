<template>
  <button
    v-if="state.canUndo"
    v-tooltip="t('feature.undoButton.undo')"
    data-testid="undo-button"
    :class="[$style.undoButton, classes]"
    type="button"
    @click="undoLastAction"
  >
    <RiResetLeftLine />
  </button>
</template>

<script lang="ts" setup>
import { RiResetLeftLine } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { ClassNames } from '@utils/types.ts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { state, undoLastAction } = useDataStore();

const classes = computed(() => props.class);
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
