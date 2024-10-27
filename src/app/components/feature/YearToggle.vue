<template>
  <template v-if="state.years.length > 1">
    <Button :icon="RiArrowLeftSLine" rounded @click="rotateYear(-1)" />
    <Button :icon="RiArrowRightSLine" rounded @click="rotateYear(1)" />
  </template>
  <i18n-t tag="span" :keypath="keyPath" scope="global">
    <template #year>
      <TextWheel :values="allYears" :value="state.activeYear" />
    </template>
  </i18n-t>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import TextWheel from '@components/base/text-wheel/TextWheel.vue';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { computed } from 'vue';

defineProps<{
  keyPath: string;
}>();

const { state, changeYear } = useDataStore();

const allYears = computed(() => state.years.map((v) => v.year));

const rotateYear = (dir: -1 | 1) => {
  const possibleYears = allYears.value;
  const currentIndex = possibleYears.indexOf(state.activeYear);
  const newIndex = (currentIndex + dir + possibleYears.length) % possibleYears.length;
  const newYear = possibleYears[newIndex];
  changeYear(newYear);
};
</script>
