<template>
  <div :class="$style.allTime">
    <div :class="$style.cards">
      <div v-for="card in cards" :key="card.title" :class="$style.card">
        <h2 :title="card.title" :class="$style.title">{{ card.title }}</h2>
        <div :class="$style.content">
          <component :is="card.icon" v-if="card.icon" :class="card.iconClass" />
          <span :class="$style.value">{{ card.value }}</span>
        </div>
      </div>
    </div>
    <div :class="$style.chart">
      <AllTimeChart />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RiArrowDownDoubleLine, RiArrowUpDoubleLine } from '@remixicon/vue';
import { computed, useCssModule } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { ClassNames, sum } from '@utils';
import AllTimeChart from './AllTimeChart.vue';
import type { Component } from 'vue';

interface Card {
  title: string;
  value: string;
  icon?: Component;
  iconClass?: ClassNames;
}

const { t, locale } = useI18n();
const { state } = useDataStore();
const styles = useCssModule();

const cards = computed((): Card[] => {
  const percent = new Intl.NumberFormat(locale.value, {
    style: 'percent',
    maximumFractionDigits: 2
  });

  const currency = new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: state.currency,
    maximumFractionDigits: 0
  });

  const lastYear = state.years.at(-2);
  const currentYear = state.years.at(-1);

  if (!lastYear || !currentYear) {
    return [];
  }

  const lastYearIncome = sum(totals(lastYear.income));
  const lastYearExpenses = sum(totals(lastYear.expenses));
  const currentYearIncome = sum(totals(currentYear.income));
  const currentYearExpenses = sum(totals(currentYear.expenses));
  const allTimeIncome = sum(totals(state.years.flatMap((v) => v.income)));
  const allTimeExpenses = sum(totals(state.years.flatMap((v) => v.expenses)));

  return [
    {
      title: t('page.dashboard.yoyIncomeGrowth'),
      value: percent.format((currentYearIncome - lastYearIncome) / lastYearIncome),
      icon: currentYearIncome > lastYearIncome ? RiArrowUpDoubleLine : RiArrowDownDoubleLine,
      iconClass: currentYearIncome > lastYearIncome ? styles.iconSuccess : styles.iconDanger
    },
    {
      title: t('page.dashboard.yoyExpenseGrowth'),
      value: percent.format((lastYearExpenses - currentYearExpenses) / currentYearExpenses),
      icon: lastYearExpenses > currentYearExpenses ? RiArrowUpDoubleLine : RiArrowDownDoubleLine,
      iconClass: lastYearExpenses > currentYearExpenses ? styles.iconDanger : styles.iconSuccess
    },
    {
      title: t('page.dashboard.allTimeIncome'),
      value: currency.format(allTimeIncome)
    },
    {
      title: t('page.dashboard.allTimeExpenses'),
      value: currency.format(allTimeExpenses)
    },
    {
      title: t('page.dashboard.allTimeSavings'),
      value: currency.format(allTimeIncome - allTimeExpenses)
    }
  ];
});
</script>

<style lang="scss" module>
.allTime {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.chart {
  flex: 1;
}

.cards {
  display: grid;
  grid-template: 1fr / repeat(5, 1fr);
  flex-shrink: 0;
  padding: 16px;
  gap: 8px;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background: var(--c-dimmed-light);
  border-radius: var(--border-radius-xxl);
  overflow: hidden;

  .content {
    display: flex;
    align-items: center;
    gap: 8px;

    .iconSuccess,
    .iconDanger {
      border-radius: 50%;
      padding: 3px;
    }

    .iconSuccess {
      background: var(--c-success);
      color: var(--c-success-text-accent);
    }

    .iconDanger {
      background: var(--c-danger);
      color: var(--c-danger-text-accent);
    }
  }

  .title {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-xl);
    color: var(--theme-text);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .value {
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-xl);
    color: var(--theme-text);
  }
}
</style>
