<template>
  <div :class="$style.root">
    <h1 :class="$style.header">{{ state.title }}</h1>
    <div :class="$style.tabs">
      <div :class="$style.buttons">
        <button>🏠</button>
        <button>📈</button>
        <button>📉</button>
      </div>
      <div :class="$style.panes">
        <Budget/>
        <BudgetGroup/>
        <BudgetSummary/>
        <Dashboard/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useState} from '../state';
import BudgetGroup from './components/budget-group/BudgetGroup.vue';
import BudgetSummary from './components/budget-summary/BudgetSummary.vue';
import Budget from './components/budget/Budget.vue';
import Dashboard from './components/dashboard/Dashboard.vue';

const state = useState();
const tab = ref(0);

</script>

<style lang="scss" module>

.root {
  width: 100%;
  height: 100%;
  max-width: 1000px;
  max-height: 500px;
  box-shadow: var(--app-box-shadow);
  border-radius: var(--border-radius-xl);
  background: var(--app-backround);
}

.header {
  font-weight: var(--font-weight-m);
  font-size: var(--font-size-m);
  padding: 10px 20px;
  border-bottom: 1px solid var(--app-border);
}

.tabs {
  display: flex;

  .buttons {
    border-left: 1px solid var(--app-border);
  }

  .panes {

  }
}

</style>
