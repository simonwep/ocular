<template>
  <div :class="$style.summary">
    <AsyncComponent
      :show="media !== 'mobile'"
      :class="$style.chart"
      :import="() => import('./widgets/charts/DevelopmentChart.vue')"
    />

    <TotalsSummaryTable :income="income" :expenses="expenses" />
    <GroupsSummaryTable :title="t('page.dashboard.income')" :groups="state.income" />
    <GroupsSummaryTable :title="t('page.dashboard.expenses')" :groups="state.expenses" />
  </div>
</template>

<script lang="ts" setup>
import GroupsSummaryTable from './widgets/tables/GroupsSummaryTable.vue';
import TotalsSummaryTable from './widgets/tables/TotalsSummaryTable.vue';
import AsyncComponent from '@components/misc/async-component/AsyncComponent.vue';
import { useMediaQuery } from '@composables';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { state } = useDataStore();
const { t } = useI18n();
const media = useMediaQuery();

const income = computed(() => totals(state.income));
const expenses = computed(() => totals(state.expenses));
</script>

<style lang="scss" module>
.summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
  padding-bottom: 10px;
}

.chart {
  flex-grow: 1;
  min-height: 250px;
}
</style>
