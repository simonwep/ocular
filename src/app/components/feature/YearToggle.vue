<template>
  <span v-if="multiYear" :class="$style.toggle">
    <Button :class="$style.btn" :icon="RiArrowLeftSLine" rounded @click="rotateYear(-1)" />
    <TextWheel :values="values" :value="value" />
    <Button :class="$style.btn" :icon="RiArrowRightSLine" rounded @click="rotateYear(1)" />
  </span>
  <i18n-t data-testid="current-year-text" :class="$style.activeYear" tag="span" :keypath="keyPath" scope="global">
    <template #year>
      <TextWheel testId="current-year" :values="values" :value="value" />
    </template>
  </i18n-t>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import TextWheel from '@components/base/text-wheel/TextWheel.vue';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { computed } from 'vue';

defineProps<{
  keyPath: string;
}>();

const { state, changeYear } = useDataStore();
const { state: settings } = useSettingsStore();

const multiYear = computed(() => state.years.length > 1);
const allYears = computed(() => state.years.map((v) => v.year));

const value = computed(() =>
  settings.general.monthOffset ? `${state.activeYear} - ${state.activeYear + 1}` : state.activeYear
);

const values = computed(() =>
  settings.general.monthOffset ? allYears.value.map((v) => `${v} - ${v + 1}`) : allYears.value
);

const rotateYear = (dir: -1 | 1) => {
  const possibleYears = allYears.value;
  const currentIndex = possibleYears.indexOf(state.activeYear);
  const newIndex = (currentIndex + dir + possibleYears.length) % possibleYears.length;
  const newYear = possibleYears[newIndex];

  changeYear(newYear);
};
</script>

<style lang="scss" module>
.text {
  display: flex;
  align-items: center;
  gap: 4px;

  &.multiYear {
    gap: 6px;
  }
}

.toggle {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--c-primary);
  border-radius: 100px;
  gap: 5px;
  height: 100%;
  filter: drop-shadow(0 0 3px rgba(black, 0.15));
  font-size: var(--font-size-xs);
  color: var(--c-text-light);

  .year {
    all: unset;
    font-size: var(--font-size-xs);
    cursor: pointer;
  }

  .btn {
    padding: 0;
    height: 100%;
    width: 26px;
  }
}

.activeYear {
  display: flex;
  align-items: flex-end;
  gap: 0.5ch;
}
</style>
