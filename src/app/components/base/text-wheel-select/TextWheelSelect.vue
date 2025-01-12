<template>
  <span ref="container" :class="[$style.container, { [$style.open]: showList }]">
    <button :class="$style.currentValue" @click="showList = true">{{ value }}</button>
    <span :class="$style.textWheelSelect">
      <button
        v-for="v of values"
        ref="items"
        :key="v"
        :data-value="v"
        type="button"
        :class="[$style.value, { [$style.current]: value === v }]"
        @click="select(v)"
      >
        {{ v }}
      </button>
    </span>
  </span>
</template>

<script lang="ts" setup generic="T extends string | number">
import { computed, nextTick, ref, toRef, useTemplateRef, watch } from 'vue';
import { useOutOfElementClick } from '@composables';

const emit = defineEmits<{
  change: (value: T) => void;
}>();

const props = defineProps<{
  values: T[];
  value: T;
}>();

const showList = ref(false);
const container = useTemplateRef('container');
const items = useTemplateRef('items');

const visibleItemsWhenOpen = computed(() => Math.min(3, props.values.length));

useOutOfElementClick([container, items], () => (showList.value = false));

const focusValue = () =>
  items.value
    ?.find((el: HTMLButtonElement) => el.dataset.value === String(props.value))
    ?.scrollIntoView({ block: 'start' });

const select = (v: T) => {
  if (!showList.value) {
    showList.value = true;
  } else {
    emit('change', v);
    showList.value = false;
  }
};

watch([toRef(props, 'value'), toRef(props, 'values'), items, showList], () => nextTick(focusValue));
</script>

<style lang="scss" module>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-primary);

  &.open {
    .currentValue {
      visibility: hidden;
    }

    .textWheelSelect {
      height: calc(22px * v-bind(visibleItemsWhenOpen));
      border-bottom-left-radius: var(--border-radius-l);
      border-bottom-right-radius: var(--border-radius-l);
      visibility: visible;

      .value {
        padding: 0 7px;
      }
    }
  }
}

.value,
.currentValue {
  all: unset;
  font-size: var(--font-size-xs);
  color: var(--c-text-light);
  cursor: pointer;
}

.textWheelSelect {
  overflow: auto;
  height: 22px;
  top: 0;
  background: var(--c-primary);
  position: absolute;
  display: inline-grid;
  grid-auto-flow: row;
  -ms-overflow-style: none;
  scrollbar-width: none;
  visibility: hidden;
}

.textWheelSelect::-webkit-scrollbar {
  display: none;
}

.value {
  height: 22px;
  padding: 0 3px;

  &:not(.current) {
    background: var(--c-primary-light);
    color: var(--c-text);
  }
}
</style>
