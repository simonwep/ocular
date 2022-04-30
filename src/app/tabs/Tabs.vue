<template>
  <div :class="$style.tabs">
    <div ref="menu" :class="$style.buttons">
      <ThemeButton :class="$style.btn" />
      <div :class="$style.divider" />

      <Button
        v-for="button of buttons"
        :class="$style.btn"
        :key="button.tab"
        :color="tab === button.tab ? 'primary' : 'dimmed'"
        :icon="button.icon"
        textual
        @click="tab = button.tab"
      />

      <ImportButton :class="[$style.top, $style.btn]" />
      <ExportButton :class="$style.btn" />
      <div :class="$style.divider" />
      <CloudButton :class="$style.btn" />
    </div>

    <div :class="$style.panes">
      <Transition
        :enter-active-class="$style.transitionTarget"
        :enter-from-class="$style.transitionOrigin"
        :leave-active-class="$style.transitionTarget"
        :leave-to-class="$style.transitionOrigin"
        mode="out-in"
      >
        <component v-if="component" :is="component" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { computed, ref } from 'vue';
import Dashboard from './dashboard/Dashboard.vue';
import Expenses from './expenses/Expenses.vue';
import Income from './income/Income.vue';
import CloudButton from './navigation/CloudButton.vue';
import ExportButton from './navigation/export/ExportButton.vue';
import ImportButton from './navigation/import/ImportButton.vue';
import ThemeButton from './navigation/ThemeButton.vue';

type Tab = 'dashboard' | 'income' | 'expenses' | 'settings';

const menu = ref<HTMLDivElement>();
const tab = ref<Tab>('dashboard');

const component = computed(
  () => buttons.find((v) => v.tab === tab.value)?.component
);

/* eslint-disable @typescript-eslint/no-explicit-any */
const buttons: { icon: AppIcon; tab: Tab; component: any }[] = [
  { icon: 'donut-chart', tab: 'dashboard', component: Dashboard },
  { icon: 'hand-coin', tab: 'income', component: Income },
  { icon: 'shopping-basket-2', tab: 'expenses', component: Expenses }
];
</script>

<style lang="scss" module>
@use 'sass:math';
@use 'src/styles/globals';

.transitionTarget {
  transition: all var(--transition-s);
}

.transitionOrigin {
  opacity: 0;
}

.tabs {
  display: flex;
  height: 100%;
  width: 100%;
}

.panes {
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.buttons {
  display: flex;
  height: 100%;
  flex-direction: column;
  border-right: 1px solid var(--app-border);
  padding: 15px 10px;
  grid-gap: 10px;

  .top {
    margin-top: auto;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: var(--app-border);
  }
}

@include globals.onMobileDevices {
  .tabs {
    flex-direction: column-reverse;
  }

  .panes {
    height: auto;
    flex-grow: 1;
  }

  .buttons {
    border: none;
    border-top: 3px solid var(--app-border);
    align-items: center;
    margin-top: 0;
    justify-content: space-evenly;
    flex-direction: row-reverse;
    height: auto;

    .divider {
      display: none;
    }
  }
}
</style>
