<template>
  <Pane :class="$style.dashboard" :title="`Dashboard - ${state.title}`">
    <SummaryPanels/>
    <SummaryChart :class="$style.summary"/>
  </Pane>
</template>

<script lang="ts" setup>
import Pane from '@shared/Pane.vue';
import {useStore} from '@state/index';
import SummaryChart from './widgets/charts/SummaryChart.vue';
import SummaryPanels from './widgets/header-panels/SummaryPanels.vue';

const {state} = useStore();
</script>

<style lang="scss" module>

.dashboard {
  display: grid;
  grid-template: min-content 1fr / 1fr;
  grid-gap: 20px;
  padding-top: 20px;
  flex-grow: 1;
}

.summary {
  height: 100%;
}

</style>
