<template>
  <div :class="[$style.summaryPanel, classes]">
    <div :class="$style.header">
      <h3 :class="$style.head">{{ title }}</h3>
      <span :class="$style.title"><Currency :value="endingValue"/></span>
      <span v-if="subTitle" :class="$style.subTitle">{{ subTitle }}</span>
    </div>

    <SummaryPanelChart :class="$style.chart"
                       :color="chartColor"
                       :values="values"/>
  </div>
</template>

<script lang="ts" setup>
import Currency from '@components/currency/Currency.vue';
import {computed} from 'vue';
import SummaryPanelChart from './SummaryPanelChart.vue';

const props = defineProps<{
  class?: any;
  title: string;
  subTitle?: string;
  color: string;
  values: number[];
}>();

const classes = computed(() => props.class);
const endingValue = computed(() => props.values[props.values.length - 1]);
const backgroundColor = computed(() => `var(${props.color}-light)`);
const chartColor = computed(() => `var(${props.color}-light-dimmed)`);
</script>

<style lang="scss" module>

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

</style>
