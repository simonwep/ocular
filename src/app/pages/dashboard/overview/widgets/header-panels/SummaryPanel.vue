<template>
  <div ref="root" :style="$style.wrapper">
    <component :is="element" :to="to" :class="[$style.summaryPanel, classes]">
      <Icon v-if="to" :class="$style.editIcon" icon="pencil-fill" />

      <div :class="$style.header">
        <h2 :class="$style.head">{{ title }}</h2>
        <span :class="$style.title">
          <Currency :value="endingValue" />
        </span>
        <span v-if="subTitle" :class="$style.subTitle">{{ subTitle }}</span>
      </div>

      <SummaryPanelChart v-if="Array.isArray(values)" :class="$style.chart" :color="chartColor" :values="values" />
    </component>
  </div>
</template>

<script lang="ts" setup>
import Currency from '@components/base/currency/Currency.vue';
import Icon from '@components/base/icon/Icon.vue';
import Link from '@components/base/link/Link.vue';
import { ClassNames } from '@utils';
import { computed } from 'vue';
import SummaryPanelChart from './SummaryPanelChart.vue';
import { useSquircle } from '@composables';

const props = defineProps<{
  class?: ClassNames;
  title: string;
  subTitle?: string;
  to?: string;
  color: string;
  values: number[] | number;
}>();

const classes = computed(() => props.class);
const root = useSquircle(0.25);

const endingValue = computed(() =>
  Array.isArray(props.values) ? props.values[props.values.length - 1] : props.values
);

const shadow = computed(() => `var(${props.color}-shadow)`);
const backgroundColor = computed(() => `var(${props.color}-light)`);
const chartColor = computed(() => `var(${props.color}-light-dimmed)`);
const element = computed(() => (props.to ? Link : 'div'));
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.summaryPanel {
  display: flex;
  justify-content: space-between;
  grid-gap: 2px;
  padding: 30px;
  width: 100%;
  height: 100%;
  position: relative;
  background: v-bind('backgroundColor');

  .editIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 18px;
    right: 18px;
    opacity: 0;
    transform: translateX(5px);
    transition: all var(--transition-m);
  }

  &:hover .editIcon {
    opacity: 1;
    transform: none;
  }
}

.header {
  display: flex;
  flex-direction: column;

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
    color: v-bind('chartColor');
  }
}

.chart {
  width: 30%;
}

@include globals.onMobileDevices {
  .summaryPanel {
    box-shadow: 0 2px 2px v-bind('shadow');
  }

  .header .title {
    margin-top: 5px;
  }

  .chart {
    width: 50%;
  }
}
</style>
