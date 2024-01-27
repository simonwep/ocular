<template>
  <div ref="root" :style="$style.wrapper">
    <component :is="element" :to="to" :class="[$style.summaryPanel, classes]">
      <Icon v-if="to" :class="$style.editIcon" icon="pencil-fill" />

      <div :class="$style.header">
        <div v-if="alt" :class="$style.placeholder">
          <Icon :class="$style.icon" icon="calendar-2-line" />
          <span :class="$style.text">{{ alt }}</span>
        </div>

        <template v-else>
          <h2 :class="$style.head">{{ title }}</h2>
          <Currency :class="$style.title" :value="endingValue" />
          <span v-if="subTitle" :class="$style.subTitle">{{ subTitle }}</span>
        </template>
      </div>

      <SummaryPanelChart v-if="Array.isArray(values)" :class="$style.chart" :color="chartColor" :values="values" />
    </component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import Currency from '@components/base/currency/Currency.vue';
import Icon from '@components/base/icon/Icon.vue';
import Link from '@components/base/link/Link.vue';
import { useSquircle } from '@composables';
import { ClassNames } from '@utils';
import SummaryPanelChart from './SummaryPanelChart.vue';

const props = defineProps<{
  class?: ClassNames;
  title: string;
  subTitle?: string;
  to?: string;
  alt?: string;
  color: string;
  values: number[] | number;
}>();

const classes = computed(() => props.class);
const root = useSquircle(0.25);

const endingValue = computed(() =>
  Array.isArray(props.values) ? props.values[props.values.length - 1] : props.values
);

const shadow = computed(() => `var(--c-${props.color}-shadow)`);
const textColor = computed(() => `var(--c-${props.color}-text-accent)`);
const backgroundColor = computed(() => `var(--c-${props.color}-light)`);
const chartColor = computed(() => `var(--c-${props.color}-light-dimmed)`);
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
  gap: 2px;
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
  color: v-bind(textColor);
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
    color: v-bind('chartColor');
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
