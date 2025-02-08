<template>
  <div :class="$style.overview">
    <SummaryPanels @hovered-panel="highlight = $event" />
    <AsyncComponent
      :properties="{ highlight }"
      :show="media !== 'mobile'"
      :class="$style.chart"
      :import="() => import('./widgets/charts/DistributionChart.vue')"
    />
  </div>
</template>

<script lang="ts" setup>
import SummaryPanels from './widgets/header-panels/SummaryPanels.vue';
import AsyncComponent from '@components/misc/async-component/AsyncComponent.vue';
import { useMediaQuery } from '@composables';
import { ref } from 'vue';

const media = useMediaQuery();
const highlight = ref<string>();
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

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
