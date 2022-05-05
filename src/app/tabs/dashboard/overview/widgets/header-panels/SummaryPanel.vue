<template>
  <div :class="[$style.summaryPanel, classes]">
    <div :class="$style.header">
      <h3 :class="$style.head">{{ title }}</h3>
      <span :class="$style.title">
        <Currency :value="endingValue" />
      </span>
      <span v-if="subTitle" :class="$style.subTitle">{{ subTitle }}</span>
    </div>

    <SummaryPanelChart v-if="Array.isArray(values)" :class="$style.chart" :color="chartColor" :values="values" />
  </div>
</template>

<script lang="ts" setup>
import Currency from '@components/base/currency/Currency.vue';
import { ClassNames } from '@utils';
import { computed } from 'vue';
import SummaryPanelChart from './SummaryPanelChart.vue';

const props = defineProps<{
  class?: ClassNames;
  title: string;
  subTitle?: string;
  color: string;
  values: number[] | number;
}>();

const classes = computed(() => props.class);

const endingValue = computed(() =>
  Array.isArray(props.values) ? props.values[props.values.length - 1] : props.values
);

const shadow = computed(() => `var(${props.color}-shadow)`);
const backgroundColor = computed(() => `var(${props.color}-light)`);
const chartColor = computed(() => `var(${props.color}-light-dimmed)`);
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.summaryPanel {
  display: flex;
  justify-content: space-between;
  grid-gap: 2px;
  padding: 30px;
  width: 100%;
  border-radius: var(--border-radius-xxxl);
  background: v-bind('backgroundColor');
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
