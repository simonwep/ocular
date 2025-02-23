<template>
  <div
    ref="wrapper"
    v-tooltip="tooltip ? { position: 'bottom', text: tooltip } : undefined"
    :class="[$style.wrapper, { [$style.clickable]: !!to }]"
  >
    <div ref="container" :class="$style.container">
      <component :is="element" :to="to" :class="[$style.summaryPanel, classes]">
        <div :class="$style.header">
          <div v-if="alt" :class="$style.placeholder">
            <RiCalendar2Line :class="$style.icon" />
            <span :class="$style.text">{{ alt }}</span>
          </div>

          <template v-else>
            <h2 :class="$style.head">{{ title }}</h2>
            <Currency :class="$style.title" :testId="`${testId}-value`" :value="value" />
            <span v-if="subTitle || $slots.subTitle" :data-testid="`${testId}-sub`" :class="$style.subTitle">
              <span>{{ subTitle }}</span>
              <slot name="subTitle" />
            </span>
          </template>
        </div>

        <SummaryPanelChart v-if="values" :class="$style.chart" :color="theme.light.dimmed" :values="values" />
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SummaryPanelChart from './SummaryPanelChart.vue';
import Currency from '@components/base/currency/Currency.vue';
import Link from '@components/base/link/Link.vue';
import { Color, useSquircle, useThemeStyles } from '@composables';
import { RiCalendar2Line } from '@remixicon/vue';
import { ClassNames } from '@utils';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  title: string;
  subTitle?: string;
  tooltip?: string;
  to?: string;
  alt?: string;
  color: Color;
  values?: number[];
  value: number;
  testId?: string;
}>();

const classes = computed(() => props.class);
const theme = useThemeStyles(() => props.color);
const wrapper = useSquircle(0.25);
const container = useSquircle(0.25);

const element = computed(() => (props.to ? Link : 'div'));
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: v-bind('theme.light.base');
  transition: background var(--transition-s);

  &.clickable:hover {
    background: v-bind('theme.light.dimmed');
  }
}

.container {
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  background: v-bind('theme.light.base');
}

.summaryPanel {
  display: flex;
  justify-content: space-between;
  padding: 30px;
  width: 100%;
  height: 100%;
  position: relative;
  background: v-bind('theme.light.base');
}

.header {
  display: flex;
  flex-direction: column;
  color: v-bind('theme.text.accent');
  width: 100%;

  .head {
    font-weight: var(--font-weight-xl);
    font-size: var(--font-size-m);
  }

  .title {
    font-size: var(--font-size-xxl);
    font-weight: var(--font-weight-xxl);
  }

  .subTitle {
    display: flex;
    align-items: center;
    gap: 2px;
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
