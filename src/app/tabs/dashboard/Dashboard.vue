<template>
  <Pane :class="$style.dashboard" :title="`Dashboard - ${state.title}`">
    <SummaryPanels />
    <DistributionChart />
  </Pane>
</template>

<script lang="ts" setup>
import Pane from '../shared/Pane.vue';
import { useStore } from '@state/index';
import DistributionChart from './widgets/charts/DistributionChart.vue';
import SummaryPanels from './widgets/header-panels/SummaryPanels.vue';

const { state } = useStore();
</script>

<style lang="scss" module>
.dashboard {
  display: grid;
  grid-template: auto 1fr / 1fr;
  grid-gap: 20px;
  padding-top: 20px;
  flex-grow: 1;
}
</style>
