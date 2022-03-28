<template>
  <div :class="$style.root">
    <h1 :class="$style.header">{{ state.title }}</h1>
    <div :class="$style.tabs">
      <div :class="$style.buttons">
        <Button icon="chart" textual @click="tab = 'dashboard'"/>
        <Button icon="shopping-basket" textual @click="tab = 'expenses'"/>
        <Button icon="hand-coin" textual @click="tab = 'income'"/>
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
import {ref} from 'vue';
import {useState} from '../state';
import Dashboard from './panes/dashboard/Dashboard.vue';
import Expenses from './panes/expenses/Expenses.vue';
import Income from './panes/income/Income.vue';

type Tabs = 'dashboard' | 'income' | 'expenses';

const tab = ref<Tabs>('expenses');
const state = useState();

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
    margin-top: 10px;
  }

  .panes {
    height: 100%;
    width: 100%;
  }
}

</style>
