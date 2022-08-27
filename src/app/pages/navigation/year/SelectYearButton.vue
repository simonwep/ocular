<template>
  <ContextMenu :options="options" :highlight="state.activeYear" @select="changeYear($event.id as number)">
    <Button icon="calendar-line" textual color="dimmed" />
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Button from '@components/base/button/Button.vue';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { ContextMenuOption } from '@components/base/context-menu';
import { useDataStore } from '@store/state';

const PRE_PLANNABLE_YEARS = 1;

const { changeYear, state } = useDataStore();

const options = computed((): ContextMenuOption[] => {
  const yearsStored = state.years.map((v) => v.year);
  const offset = Math.min(new Date().getFullYear(), ...yearsStored);
  const list: ContextMenuOption[] = [];

  for (let i = 0; i <= PRE_PLANNABLE_YEARS; i++) {
    list.push({
      id: offset + i,
      icon: state.activeYear === offset + i ? 'calendar-check-line' : 'calendar-todo-line'
    });
  }

  return list;
});
</script>
