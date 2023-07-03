<template>
  <ContextMenu :options="options" :highlight="state.activeYear" @select="changeYear($event.id as number)">
    <Button icon="calendar-line" textual color="dimmed" />
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Button from '@components/base/button/Button.vue';
import { ContextMenuOption } from '@components/base/context-menu';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useDataStore } from '@store/state';

const PRE_PLANNABLE_YEARS = 1;

const { changeYear, state } = useDataStore();

const options = computed((): ContextMenuOption[] => {
  const yearsStored = state.years.map((v) => v.year);
  const currentYear = new Date().getFullYear();
  const offset = Math.min(...yearsStored);
  const list: ContextMenuOption[] = [];

  for (let year = offset; year <= currentYear + PRE_PLANNABLE_YEARS; year++) {
    list.push({
      id: year,
      icon: state.activeYear === year ? 'calendar-check-line' : 'calendar-todo-line'
    });
  }

  return list;
});
</script>
