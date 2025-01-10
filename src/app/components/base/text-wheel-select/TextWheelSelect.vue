<template>
  <span :class="$style.container">
    <span :class="$style.placeholder">{{ value }}</span>
    <span ref="textWheelSelect" :class="[$style.textWheelSelect, { [$style.open]: showList }]">
      <button
        v-for="v of values"
        ref="items"
        :key="v"
        :data-value="v"
        type="button"
        :class="$style.value"
        @click="select(v)"
      >
        {{ v }}
      </button>
    </span>
  </span>
</template>

<script lang="ts" setup generic="T extends string | number">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { useOutOfElementClick } from '@composables';

const emit = defineEmits<{
  change: (value: T) => void;
}>();

const props = defineProps<{
  values: T[];
  value: T;
}>();

const showList = ref(false);
const textWheelSelect = useTemplateRef('textWheelSelect');
const items = useTemplateRef('items');

const visibleItemsWhenOpen = computed(() => Math.min(3, props.values.length));

useOutOfElementClick([textWheelSelect, items], () => (showList.value = false));

const focusValue = () =>
  items.value
    .find((el: HTMLButtonElement) => el.dataset.value === String(props.value))
    ?.scrollIntoView({ block: 'start' });

const select = (v: T) => {
  if (!showList.value) {
    showList.value = true;
  } else {
    emit('change', v);
    showList.value = false;
  }
};

watch(() => props.value, focusValue);
watch(showList, () => nextTick(focusValue));
</script>

<style lang="scss" module>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.placeholder {
  visibility: hidden;
  font-size: var(--font-size-xs);
}

.textWheelSelect {
  overflow: auto;
  height: 22px;
  border-radius: var(--border-radius-l);
  top: 0;
  background: var(--c-primary);
  position: absolute;
  display: inline-grid;
  grid-auto-flow: row;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &.open {
    height: calc(22px * v-bind(visibleItemsWhenOpen));

    .value {
      padding: 0 7px;
    }
  }
}

.textWheelSelect::-webkit-scrollbar {
  display: none;
}

.value {
  all: unset;
  cursor: pointer;
  height: 22px;
  padding: 0 3px;
  font-size: var(--font-size-xs);
  color: var(--c-text-light);

  &.transition {
    transition: transform var(--transition-s);
  }
}
</style>
