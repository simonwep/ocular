<template>
  <ContextMenu
    :tooltip="t('navigation.year.change')"
    tooltipPosition="right"
    :position="media === 'mobile' ? 'top' : 'right-end'"
    :options="options"
    testId="change-year"
    :highlight="state.activeYear"
    @select="changeYear($event.id as number)"
  >
    <template #default="{ toggle }">
      <Button testId="change-year" :class="classes" :icon="RiCalendarLine" textual color="dimmed" @click="toggle" />
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { ContextMenuOption } from '@components/base/context-menu/ContextMenu.types';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useMediaQuery, useTime } from '@composables';
import { RiCalendarCheckLine, RiCalendarLine, RiCalendarTodoLine } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { ClassNames } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

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
  const firstYear = Math.min(...yearsStored);
  const list: ContextMenuOption[] = [];

  for (let year = firstYear - 1; year <= time.year.value + PRE_PLANNABLE_YEARS; year++) {
    list.push({
      id: year,
      muted: year === firstYear - 1,
      icon: state.activeYear === year ? RiCalendarCheckLine : RiCalendarTodoLine
    });
  }

  return list;
});
</script>
