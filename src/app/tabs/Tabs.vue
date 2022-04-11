<template>
  <div :class="$style.buttons">
    <ThemeButton />
    <div :class="$style.divider" />

    <Button
      v-for="button of buttons"
      :key="button.tab"
      :color="tab === button.tab ? 'primary' : 'dimmed'"
      :icon="button.icon"
      textual
      @click="tab = button.tab"
    />

    <ImportButton :class="$style.top" />
    <SaveButton />
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
import { computed, ref } from 'vue';
import Dashboard from './dashboard/Dashboard.vue';
import Expenses from './expenses/Expenses.vue';
import Income from './income/Income.vue';
import ImportButton from './navigation/import-button/ImportButton.vue';
import SaveButton from './navigation/SaveButton.vue';
import ThemeButton from './navigation/ThemeButton.vue';

type Tab = 'dashboard' | 'income' | 'expenses';

const tab = ref<Tab>('dashboard');
const component = computed(
  () => buttons.find((v) => v.tab === tab.value)?.component
);

/* eslint-disable @typescript-eslint/no-explicit-any */
const buttons: { icon: AppIcon; tab: Tab; component: any }[] = [
  { icon: 'donut-chart', tab: 'dashboard', component: Dashboard },
  { icon: 'shopping-basket-2', tab: 'expenses', component: Expenses },
  { icon: 'hand-coin', tab: 'income', component: Income },
];
</script>

<style lang="scss" module>
@use 'sass:math';

.transitionTarget {
  transition: all var(--transition-s);
}

.transitionOrigin {
  opacity: 0;
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

.panes {
  height: 100%;
  width: 100%;
}

.fromLeft {
  animation: var(--animation-fade-in-right) var(--transition-m);
}

.fromTop {
  animation: var(--animation-fade-in-top) var(--transition-m);
}

.fromBottom {
  animation: var(--animation-fade-in-bottom) var(--transition-m);
}
</style>
