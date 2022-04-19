<template>
  <Pane
    :class="$style.dashboard"
    :title="t('dashboard.dashboard', { title: state.title })"
  >
    <SummaryPanels />
    <DistributionChart />
  </Pane>
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/data';
import { useI18n } from 'vue-i18n';
import Pane from '../shared/Pane.vue';
import DistributionChart from './widgets/charts/DistributionChart.vue';
import SummaryPanels from './widgets/header-panels/SummaryPanels.vue';

const { state } = useDataStore();

const { t } = useI18n();
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
