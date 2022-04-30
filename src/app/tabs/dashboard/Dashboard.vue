<template>
  <Pane :class="$style.dashboard" :title="t('dashboard.dashboard')">
    <SummaryPanels />
    <DistributionChart :class="$style.chart" />
  </Pane>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import Pane from '../shared/Pane.vue';
import DistributionChart from './widgets/charts/DistributionChart.vue';
import SummaryPanels from './widgets/header-panels/SummaryPanels.vue';

const { t } = useI18n();
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.dashboard {
  display: grid;
  grid-template: auto 1fr / 1fr;
  flex-grow: 1;

  @include globals.onMobileDevices {
    grid-template: 1fr / 1fr;

    .chart {
      display: none;
    }
  }
}
</style>
