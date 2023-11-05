<template>
  <div :class="$style.summary">
    <AsyncComponent
      :show="media !== 'mobile'"
      :class="$style.chart"
      :import="() => import('./widgets/charts/DevelopmentChart.vue')"
    />

    <TotalsSummaryTable :title="t('dashboard.summary')" :income="income" :expenses="expenses" />
    <GroupsSummaryTable :title="t('dashboard.income')" :groups="state.income" />
    <GroupsSummaryTable :title="t('dashboard.expenses')" :groups="state.expenses" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AsyncComponent from '@components/misc/async-component/AsyncComponent.vue';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { useMediaQuery } from '../../../../composables/useMediaQuery';
import GroupsSummaryTable from './widgets/tables/GroupsSummaryTable.vue';
import TotalsSummaryTable from './widgets/tables/TotalsSummaryTable.vue';

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
  grid-gap: 20px;
  flex-grow: 1;
  padding-bottom: 10px;
}

.chart {
  flex-grow: 1;
  min-height: 250px;
}
</style>
