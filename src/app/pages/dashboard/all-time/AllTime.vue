<template>
  <div :class="$style.allTime">
    <div :class="$style.cards">
      <div
        v-for="card of cards"
        :key="card.title"
        :class="[$style.card, { [$style.hoverable]: !!card.onPointerEnter }]"
        @pointerenter="card.onPointerEnter"
        @pointerleave="card.onPointerLeave"
        @pointercancel="card.onPointerLeave"
      >
        <RiFocus2Fill v-if="card.onPointerEnter" size="14" :class="$style.clickIndicator" />
        <h2 :title="card.title" :class="$style.title">{{ card.title }}</h2>
        <div :class="$style.content">
          <component :is="card.icon" v-if="card.icon" :class="card.iconClass" />
          <span v-if="card.text" :data-testid="card.testId" :class="$style.value">{{ card.text }}</span>
          <Currency v-if="card.value" :testId="card.testId" :value="card.value" :class="$style.value" />
        </div>
      </div>
    </div>
    <div :class="$style.chart">
      <AllTimeChart :highlight="highlight" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AllTimeChart from './AllTimeChart.vue';
import Currency from '@components/base/currency/Currency.vue';
import { RiArrowDownDoubleLine, RiArrowUpDoubleLine, RiFocus2Fill } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets';
import { sum } from '@utils/array/array.ts';
import { ClassNames } from '@utils/types.ts';
import { computed, ref, useCssModule } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Component } from 'vue';

type Card = {
  title: string;
  text?: string;
  value?: number;
  icon?: Component;
  iconClass?: ClassNames;
  testId?: string;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

const { t, locale } = useI18n();
const { state } = useDataStore();
const styles = useCssModule();

const highlight = ref<'income' | 'expenses'>();

const cards = computed((): Card[] => {
  const percent = new Intl.NumberFormat(locale.value, {
    style: 'percent',
    maximumFractionDigits: 2
  });

  const year = new Date().getFullYear();
  const lastYear = state.years.find((v) => v.year === year - 1);
  const currentYear = state.years.find((v) => v.year === year);

  const lastYearIncome = lastYear?.income ? sum(totals(lastYear.income)) : 0;
  const lastYearExpenses = lastYear?.expenses ? sum(totals(lastYear.expenses)) : 0;
  const currentYearIncome = currentYear?.income ? sum(totals(currentYear.income)) : 0;
  const currentYearExpenses = currentYear?.expenses ? sum(totals(currentYear.expenses)) : 0;
  const allTimeIncome = sum(totals(state.years.flatMap((v) => v.income)));
  const allTimeExpenses = sum(totals(state.years.flatMap((v) => v.expenses)));

  return [
    {
      title: t('page.dashboard.yoyIncomeGrowth'),
      text: lastYear ? percent.format((currentYearIncome - lastYearIncome) / lastYearIncome) : '—',
      icon: lastYear ? (currentYearIncome > lastYearIncome ? RiArrowUpDoubleLine : RiArrowDownDoubleLine) : undefined,
      iconClass: currentYearIncome > lastYearIncome ? styles.iconSuccess : styles.iconDanger,
      testId: 'yoy-income-growth'
    },
    {
      title: t('page.dashboard.yoyExpenseGrowth'),
      text: lastYear ? percent.format((lastYearExpenses - currentYearExpenses) / currentYearExpenses) : '—',
      icon: lastYear
        ? lastYearExpenses > currentYearExpenses
          ? RiArrowUpDoubleLine
          : RiArrowDownDoubleLine
        : undefined,
      iconClass: lastYearExpenses > currentYearExpenses ? styles.iconDanger : styles.iconSuccess,
      testId: 'yoy-expense-growth'
    },
    {
      title: t('page.dashboard.allTimeIncome'),
      value: allTimeIncome,
      text: allTimeIncome ? undefined : '—',
      testId: 'all-time-income',
      onPointerEnter: () => (highlight.value = 'income'),
      onPointerLeave: () => (highlight.value = undefined)
    },
    {
      title: t('page.dashboard.allTimeExpenses'),
      value: allTimeExpenses,
      text: allTimeExpenses ? undefined : '—',
      testId: 'all-time-expenses',
      onPointerEnter: () => (highlight.value = 'expenses'),
      onPointerLeave: () => (highlight.value = undefined)
    },
    {
      title: t('page.dashboard.allTimeSavings'),
      value: allTimeIncome - allTimeExpenses,
      text: allTimeIncome && allTimeExpenses ? undefined : '—',
      testId: 'all-time-savings'
    }
  ];
});
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.allTime {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  @include globals.onMobileDevices {
    padding: 0 6px;
  }
}

.chart {
  display: grid;
  place-items: center;
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
  position: relative;
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

  .clickIndicator {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: var(--font-size-l);
    color: var(--theme-text-dimmed);
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

  &.hoverable {
    cursor: pointer;
    transition: background 0.2s ease-in-out;

    &:hover {
      background: var(--c-primary);

      .title,
      .value {
        color: var(--c-primary-text);
      }
    }
  }
}

@include globals.onMobileDevices {
  .cards {
    overflow: auto;
    padding: 0 0 16px 0;

    .card {
      min-width: 150px;
    }
  }
}
</style>
