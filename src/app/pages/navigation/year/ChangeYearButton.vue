<template>
  <ContextMenu
    :tooltip="t('navigation.theme.change')"
    tooltip-position="right"
    :position="media === 'mobile' ? 'top' : 'right-end'"
    :options="options"
    :highlight="state.activeYear"
    @select="changeYear($event.id as number)"
  >
    <Button :class="classes" icon="calendar-line" textual color="dimmed" />
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import { ContextMenuOption } from '@components/base/context-menu/ContextMenu.types';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useMediaQuery, useTime } from '@composables';
import { useDataStore } from '@store/state';
import { ClassNames } from '@utils';

const PRE_PLANNABLE_YEARS = 1;

const props = defineProps<{
  class: ClassNames;
}>();

const { t } = useI18n();
const { changeYear, state } = useDataStore();
const media = useMediaQuery();
const time = useTime();

const classes = computed(() => props.class);
const options = computed((): ContextMenuOption[] => {
  const yearsStored = state.years.map((v) => v.year);
  const offset = Math.min(...yearsStored);
  const list: ContextMenuOption[] = [];

  for (let year = offset; year <= time.year.value + PRE_PLANNABLE_YEARS; year++) {
    list.push({
      id: year,
      icon: state.activeYear === year ? 'calendar-check-line' : 'calendar-todo-line'
    });
  }

  return list;
});
</script>
