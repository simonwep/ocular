<template>
  <div :class="[$style.buttons, { [$style.open]: open }]">
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

    <BurgerButton
      @click="open = !open"
      :active="open"
      :class="[$style.mobileMenuTrigger, $style.btn]"
    />
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
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import BurgerButton from '@components/base/burger-button/BurgerButton.vue';
import { computed, ref } from 'vue';
import Dashboard from './dashboard/Dashboard.vue';
import Expenses from './expenses/Expenses.vue';
import Income from './income/Income.vue';
import ExportButton from './navigation/export/ExportButton.vue';
import ImportButton from './navigation/import/ImportButton.vue';
import ThemeButton from './navigation/ThemeButton.vue';

type Tab = 'dashboard' | 'income' | 'expenses' | 'settings';

const open = ref(false);
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

.panes {
  overflow: hidden;
  height: 100%;
  flex-grow: 1;
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

  .mobileMenuTrigger {
    display: none;
  }
}

@include globals.onMobileDevices {
  .buttons {
    position: fixed;
    right: 10px;
    bottom: 10px;
    height: auto;
    border: none;
    z-index: 1000;

    .mobileMenuTrigger {
      display: flex;
    }

    .mobileMenuTrigger,
    .btn {
      background: var(--app-backround);
      border-radius: 100%;
      box-shadow: var(--app-box-shadow);
      padding: 0 !important;
      height: 42px;
      width: 42px;
    }

    &:not(.open) .btn:not(.mobileMenuTrigger) {
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
    }

    .divider {
      display: none;
    }

    .btn:not(.mobileMenuTrigger) {
      justify-content: center;

      &:hover {
        background: var(--app-backround);
      }
    }
  }
}
</style>
