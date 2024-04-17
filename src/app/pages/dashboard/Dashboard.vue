<template>
  <Pane :class="$style.dashboard">
    <template #title>
      <template v-if="view === AllTime">
        <RiCalendar2Line size="18" />
        <span>
          {{ t('page.dashboard.allTimeFromTo', { from: state.years[0].year, to: state.years.at(-1)?.year }) }}
        </span>
      </template>
      <template v-else>
        <template v-if="state.years.length > 1">
          <Button :icon="RiArrowLeftSLine" rounded @click="rotateYear(-1)" />
          <Button :icon="RiArrowRightSLine" rounded @click="rotateYear(1)" />
        </template>
        <i18n-t tag="span" keypath="page.dashboard.header" scope="global">
          <template #year>
            <TextWheel :values="allYears" :value="state.activeYear" />
          </template>
        </i18n-t>
      </template>
    </template>
    <template #header>
      <div :class="$style.viewButtons">
        <Button
          textual
          size="l"
          :icon="RiDashboardLine"
          :tooltip="t('page.dashboard.title')"
          :color="view === Overview ? 'primary' : 'dimmed'"
          @click="view = Overview"
        />
        <Button
          textual
          size="l"
          :icon="RiTableLine"
          :tooltip="t('page.dashboard.tables')"
          :color="view === Summary ? 'primary' : 'dimmed'"
          @click="view = Summary"
        />
        <span :class="$style.divider" />
        <Button
          textual
          size="l"
          :icon="RiEarthLine"
          :tooltip="t('page.dashboard.allTime')"
          :color="view === AllTime ? 'primary' : 'dimmed'"
          @click="view = AllTime"
        />
      </div>
    </template>
    <ComponentTransition :is="view" />
  </Pane>
</template>

<script lang="ts" setup>
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendar2Line,
  RiDashboardLine,
  RiEarthLine,
  RiTableLine
} from '@remixicon/vue';
import { computed, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import TextWheel from '@components/base/text-wheel/TextWheel.vue';
import ComponentTransition from '@components/misc/component-transition/ComponentTransition.vue';
import { useDataStore } from '@store/state';
import Pane from '../shared/Pane.vue';
import AllTime from './all-time/AllTime.vue';
import Overview from './overview/Overview.vue';
import Summary from './summary/Summary.vue';
import type { Component } from 'vue';

const { t } = useI18n();
const { state, changeYear } = useDataStore();
const view = shallowRef<Component>(Overview);

const allYears = computed(() => state.years.map((v) => v.year));

const rotateYear = (dir: -1 | 1) => {
  const possibleYears = allYears.value;
  const currentIndex = possibleYears.indexOf(state.activeYear);
  const newIndex = (currentIndex + dir + possibleYears.length) % possibleYears.length;
  const newYear = possibleYears[newIndex];
  changeYear(newYear);
};
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.dashboard {
  flex-grow: 1;
}

.viewButtons {
  display: flex;
  align-items: center;
  gap: 6px;

  .divider {
    width: 1px;
    height: 80%;
    background-color: var(--app-border);
  }
}

.version {
  color: var(--c-text-dark-muted);
  font-size: var(--font-size-xs);
}

@include globals.onMobileDevices {
  .viewButtons {
    gap: 8px;
  }
}
</style>
