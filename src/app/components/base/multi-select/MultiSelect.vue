<template>
  <div :class="$style.multiSelect">
    <Select
      v-model="selectedValue"
      :label="label"
      :placeholder="placeholder"
      :options="availableOptions"
      :testId="testId"
      :searchable="searchable"
    />
    <ul :class="$style.selectedValues">
      <li v-for="chip of chips" :key="chip.id" :class="$style.chip">
        <button :data-testid="`remove-${chip.label}`" type="button" :class="$style.deleteBtn" @click="remove(chip.id)">
          <RiCloseLine size="14" />
        </button>
        <span>{{ chip.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ContextMenuOption, ContextMenuOptionId } from '@components/base/context-menu/ContextMenu.types.ts';
import Select from '@components/base/select/Select.vue';
import { RiCloseLine } from '@remixicon/vue';
import { computed, ref, watch } from 'vue';

const modelValue = defineModel<ContextMenuOptionId[]>();

const props = defineProps<{
  label: string;
  options?: ContextMenuOption[];
  testId?: string;
  searchable?: boolean;
  placeholder?: string;
}>();

const selectedValue = ref<string>();

const availableOptions = computed(() => props.options?.filter((option) => !modelValue.value?.includes(option.id)));

const chips = computed(() =>
  modelValue.value
    ?.map((option) => ({
      id: option,
      label: props.options?.find((o) => o.id === option)?.label
    }))
    .filter((option) => !!option.label)
);

const remove = (value: ContextMenuOptionId) => {
  modelValue.value = modelValue.value?.filter((v) => v !== value);
};

watch(selectedValue, (value) => {
  if (value) {
    modelValue.value = [...(modelValue.value ?? []), value];
    selectedValue.value = undefined;
  }
});
</script>

<style lang="scss" module>
.multiSelect {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.selectedValues {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .chip {
    display: flex;
    align-items: center;
    gap: 2px;
    color: var(--c-primary-text);
    background: var(--c-primary);
    font-weight: var(--font-weight-m);
    font-size: var(--font-size-xs);
    padding: 2px 4px;
    border-radius: var(--border-radius-m);
    line-height: 1;

    .deleteBtn {
      all: unset;
      display: flex;
      cursor: pointer;
      font-size: var(--font-size-xs);
    }
  }
}
</style>
