<template>
  <Pane :class="$style.dashboard">
    <template #title>
      <template v-if="view === AllTime">
        <RiCalendar2Line size="18" />
        <span>
          {{
            t('page.dashboard.allTimeFromTo', {
              from: state.years[0].year,
              to: settings.general.monthOffset ? state.years.at(-1)!.year + 1 : state.years.at(-1)!.year
            })
          }}
        </span>
      </template>
      <YearToggle v-else keyPath="page.dashboard.budgetFor" />
    </template>
    <template #header>
      <div :class="$style.viewButtons">
        <Button
          textual
          size="l"
          :icon="RiDashboardLine"
          testId="view-overview"
          :tooltip="t('page.dashboard.title')"
          :color="view === Overview ? 'primary' : 'dimmed'"
          @click="view = Overview"
        />
        <Button
          textual
          size="l"
          testId="view-summary"
          :icon="RiTableLine"
          :tooltip="t('page.dashboard.tables')"
          :color="view === Summary ? 'primary' : 'dimmed'"
          @click="view = Summary"
        />
        <span :class="$style.divider" />
        <Button
          v-if="appSize !== 'mobile'"
          textual
          testId="view-all-time"
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
import AllTime from '@app/pages/dashboard/all-time/AllTime.vue';
import Overview from '@app/pages/dashboard/overview/Overview.vue';
import Summary from '@app/pages/dashboard/summary/Summary.vue';
import Button from '@components/base/button/Button.vue';
import Pane from '@components/feature/pane/Pane.vue';
import YearToggle from '@components/feature/year-toggle/YearToggle.vue';
import ComponentTransition from '@components/misc/component-transition/ComponentTransition.vue';
import { useAppSize } from '@composables/app-size/useAppSize.ts';
import { RiCalendar2Line, RiDashboardLine, RiEarthLine, RiTableLine } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Component } from 'vue';

const { t } = useI18n();
const { state } = useDataStore();
const { state: settings } = useSettingsStore();
const appSize = useAppSize();

const view = shallowRef<Component>(Overview);
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

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

    .divider {
      display: none;
    }
  }
}
</style>
