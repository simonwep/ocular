<template>
  <ContextMenuButton
    v-if="state.activeYear === state.years[0].year && state.years.length > 1"
    :text="t('navigation.tools.deleteYear.delete', { year: state.activeYear })"
    :icon="RiDeleteBin5Line"
    @click="deleteCurrentYear"
  />
</template>

<script lang="ts" setup>
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiDeleteBin5Line } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { useI18n } from 'vue-i18n';

const { state, shiftYears } = useDataStore();
const { t } = useI18n();

const deleteCurrentYear = () => {
  if (window.confirm(t('navigation.tools.deleteYear.confirm', { year: state.activeYear }))) {
    shiftYears();
  }
};
</script>
