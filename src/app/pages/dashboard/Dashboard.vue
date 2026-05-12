<template>
  <Pane :class="$style.dashboard">
    <template #title>
      <template v-if="route.name === 'dashboard.allTime'">
        <RiCalendar2Line size="18" />
        <span>
          {{
            t('page.dashboard.allTime.allTimeFromTo', {
              from: state.years[0].year,
              to: settings.general.monthOffset ? state.years.at(-1)!.year + 1 : state.years.at(-1)!.year
            })
          }}
        </span>
      </template>
      <template v-else>
        <UndoButton />
        <YearToggle keyPath="page.dashboard.budgetFor" />
      </template>
    </template>
    <template #header>
      <div :class="$style.viewButtons">
        <Link
          textual
          size="s"
          exactRouteMatch
          color="primary"
          :icon="RiDashboardLine"
          to="dashboard.overview"
          testId="view-overview"
          :tooltip="t('page.dashboard.overview.title')"
          tooltipPosition="bottom"
        />
        <Link
          textual
          size="s"
          color="primary"
          to="dashboard.summary"
          testId="view-summary"
          :icon="RiTableLine"
          :tooltip="t('page.dashboard.summary.title')"
          tooltipPosition="bottom"
        />
        <span :class="$style.divider" />
        <Link
          v-if="appSize !== 'mobile'"
          textual
          size="s"
          color="primary"
          to="dashboard.allTime"
          testId="view-all-time"
          :icon="RiEarthLine"
          :tooltip="t('page.dashboard.allTime.title')"
          tooltipPosition="bottom"
        />
      </div>
    </template>
    <RouterView v-slot="{ Component }">
      <ComponentTransition>
        <component :is="Component" />
      </ComponentTransition>
    </RouterView>
  </Pane>
</template>

<script lang="ts" setup>
import Link from '@components/base/link/Link.vue';
import Pane from '@components/feature/pane/Pane.vue';
import UndoButton from '@components/feature/undo-button/UndoButton.vue';
import YearToggle from '@components/feature/year-toggle/YearToggle.vue';
import ComponentTransition from '@components/misc/component-transition/ComponentTransition.vue';
import { useAppSize } from '@composables/app-size/useAppSize.ts';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { RiCalendar2Line, RiDashboardLine, RiEarthLine, RiTableLine } from '@remixicon/vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const { state } = useDataStore();
const { state: settings } = useSettingsStore();
const route = useRoute();
const appSize = useAppSize();
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
