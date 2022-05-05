<template>
  <div :class="$style.summary">
    <DevelopmentChart :class="$style.chart" />
    <TotalsSummaryTable :title="t('dashboard.summary')" :income="income" :expenses="expenses" />
    <GroupsSummaryTable :title="t('dashboard.income')" :groups="state.income" />
    <GroupsSummaryTable :title="t('dashboard.expenses')" :groups="state.expenses" />
  </div>
</template>

<script lang="ts" setup>
import { useDataStore } from '@store/data';
import { totals } from '@store/data/utils/budgets';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DevelopmentChart from './widgets/charts/DevelopmentChart.vue';
import GroupsSummaryTable from './widgets/tables/GroupsSummaryTable.vue';
import TotalsSummaryTable from './widgets/tables/TotalsSummaryTable.vue';

const { state } = useDataStore();
const { t } = useI18n();

const income = computed(() => totals(state.income));
const expenses = computed(() => totals(state.expenses));
</script>

<style lang="scss" module>
.summary {
  display: flex;
  flex-direction: column;
  grid-gap: 20px;
  width: max-content;
  min-width: 100%;
  min-height: 100%;
  padding-bottom: 10px;
}

.chart {
  flex-grow: 1;
}
</style>
