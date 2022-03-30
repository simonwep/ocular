<template>
  <div :class="$style.root">
    <h1 :class="$style.header">{{ state.title }}</h1>

    <div :class="$style.tabs">
      <div :class="$style.buttons">
        <Button v-for="button of buttons"
                :key="button.tab"
                :color="tab === button.tab ? 'primary' : 'dimmed'"
                :icon="button.icon"
                textual
                @click="tab = button.tab"/>

        <UploadButton :class="$style.top"/>
        <SaveButton/>
      </div>
      <div :class="$style.panes">
        <Dashboard v-if="tab === 'dashboard'"/>
        <Expenses v-else-if="tab === 'expenses'"/>
        <Income v-else-if="tab === 'income'"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/button/Button.vue';
import {AppIcon} from '@components/icon/Icon.types';
import {provideStore} from '@state/index';
import {ref} from 'vue';
import Dashboard from './panes/dashboard/Dashboard.vue';
import Expenses from './panes/expenses/Expenses.vue';
import Income from './panes/income/Income.vue';
import SaveButton from './SaveButton.vue';
import UploadButton from './UploadButton.vue';

type Tab = 'dashboard' | 'income' | 'expenses';

const tab = ref<Tab>('dashboard');
const {state} = provideStore();

const buttons: {icon: AppIcon; tab: Tab;}[] = [
  {icon: 'donut-chart', tab: 'dashboard'},
  {icon: 'shopping-basket-2', tab: 'expenses'},
  {icon: 'hand-coin', tab: 'income'},
];

</script>

<style lang="scss" module>
@use 'sass:math';

$maxWidth: 1450px;
$maxHeight: math.div($maxWidth, 1.6);

.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: $maxWidth;
  max-height: $maxHeight;
  box-shadow: var(--app-box-shadow);
  border-radius: var(--border-radius-xl);
  background: var(--app-backround);

  @media all and (max-width: $maxWidth), all and (max-height: $maxHeight) {
    border-radius: 0;
  }
}

.header {
  font-weight: var(--font-weight-m);
  font-size: var(--font-size-m);
  padding: 10px 20px;
  border-bottom: 1px solid var(--app-border);
}

.tabs {
  display: flex;
  flex-grow: 1;
  overflow: hidden;

  .buttons {
    display: flex;
    height: 100%;
    flex-direction: column;
    border-right: 1px solid var(--app-border);
    padding: 10px 0;
    grid-gap: 6px;

    .top {
      margin-top: auto;
    }
  }

  .panes {
    height: 100%;
    width: 100%;
  }
}

</style>
