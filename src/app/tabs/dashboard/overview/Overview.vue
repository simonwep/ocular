<template>
  <div :class="$style.overview">
    <SummaryPanels />
    <AsyncComponent
      :show="media !== 'mobile'"
      :class="$style.chart"
      :import="() => import('./widgets/charts/DistributionChart.vue')"
    />
  </div>
</template>

<script lang="ts" setup>
import AsyncComponent from '@components/misc/async-component/AsyncComponent.vue';
import { useMediaQuery } from '../../../../composables/useMediaQuery';
import SummaryPanels from './widgets/header-panels/SummaryPanels.vue';

const media = useMediaQuery();
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
