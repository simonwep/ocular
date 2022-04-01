<template>
  <Pane :class="$style.dashboard" title="Dashboard">
    <SummaryPanels/>
    <SummaryChart :class="$style.graph"/>
  </Pane>
</template>

<script lang="ts" setup>
import Pane from '@shared/Pane.vue';
import SummaryChart from './widgets/SummaryChart.vue';
import SummaryPanels from './widgets/SummaryPanels.vue';</script>

<style lang="scss" module>

.dashboard {
  display: grid;
  grid-template: max-content max-content / 1fr;
  grid-gap: 20px;
  padding-top: 20px;
}

.graph {
  height: 250px;
}

</style>
