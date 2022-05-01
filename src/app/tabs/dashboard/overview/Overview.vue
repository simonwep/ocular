<template>
  <div :class="$style.overview">
    <SummaryPanels />
    <DistributionChart :class="$style.chart" />
  </div>
</template>

<script lang="ts" setup>
import DistributionChart from './widgets/charts/DistributionChart.vue';
import SummaryPanels from './widgets/header-panels/SummaryPanels.vue';
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.overview {
  display: grid;
  grid-template: auto 1fr / 1fr;
  overflow: hidden;
  height: 100%;

  @include globals.onMobileDevices {
    grid-template: 1fr / 1fr;

    .chart {
      display: none;
    }
  }
}
</style>
