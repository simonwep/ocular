<template>
  <div ref="root" :style="$style.wrapper">
    <component :is="element" :to="to" :class="[$style.summaryPanel, classes]">
      <RiPencilFill v-if="to" :class="$style.editIcon" />

      <div :class="$style.header">
        <div v-if="alt" :class="$style.placeholder">
          <RiCalendar2Line :class="$style.icon" />
          <span :class="$style.text">{{ alt }}</span>
        </div>

        <template v-else>
          <h2 :class="$style.head">{{ title }}</h2>
          <Currency :class="$style.title" :value="endingValue" />
          <span v-if="subTitle" :class="$style.subTitle">{{ subTitle }}</span>
        </template>
      </div>

      <SummaryPanelChart
        v-if="Array.isArray(values)"
        :class="$style.chart"
        :color="theme.light.dimmed"
        :values="values"
      />
    </component>
  </div>
</template>

<script lang="ts" setup>
import Currency from '@components/base/currency/Currency.vue';
import Link from '@components/base/link/Link.vue';
import { Color, useSquircle, useThemeStyles } from '@composables';
import { RiCalendar2Line, RiPencilFill } from '@remixicon/vue';
import { ClassNames } from '@utils';
import { computed } from 'vue';
import SummaryPanelChart from './SummaryPanelChart.vue';

const props = defineProps<{
  class?: ClassNames;
  title: string;
  subTitle?: string;
  to?: string;
  alt?: string;
  color: Color;
  values: number[] | number;
}>();

const classes = computed(() => props.class);
const theme = useThemeStyles(() => props.color);
const root = useSquircle(0.25);

const endingValue = computed(() =>
  Array.isArray(props.values) ? props.values[props.values.length - 1] : props.values
);

const element = computed(() => (props.to ? Link : 'div'));
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.summaryPanel {
  display: flex;
  justify-content: space-between;
  padding: 30px;
  width: 100%;
  height: 100%;
  position: relative;
  background: v-bind('theme.light.base');

  .editIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 12px;
    right: 12px;
    opacity: 0;
    transform: translateX(5px);
    transition: all var(--transition-m);
    fill: v-bind('theme.text.accent');
  }

  &:hover .editIcon {
    opacity: 1;
    transform: none;
  }
}

.header {
  display: flex;
  flex-direction: column;
  color: v-bind('theme.text.accent');
  width: 100%;

  .head {
    font-weight: var(--font-weight-xl);
    font-size: var(--font-size-s);
  }

  .title {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-xxl);
  }

  .subTitle {
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-xxl);
    color: v-bind('theme.light.dimmed');
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 100%;
    text-align: center;

    .icon {
      height: 25px;
    }

    .text {
      font-size: var(--font-size-s);
      font-weight: var(--font-weight-l);
    }
  }
}

.chart {
  width: 30%;
}

@include globals.onMobileDevices {
  .summaryPanel {
    box-shadow: 0 2px 2px v-bind('theme.focus');
  }

  .header .title {
    margin-top: 5px;
  }

  .chart {
    width: 50%;
  }
}
</style>
