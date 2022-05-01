<template>
  <div :class="$style.tabs">
    <div ref="menu" :class="$style.buttons">
      <ThemeButton :class="$style.btn" />
      <div :class="$style.divider" />

      <Button
        v-for="button of buttons"
        :class="$style.btn"
        :key="button.id"
        :color="tab === button.id ? 'primary' : 'dimmed'"
        :icon="button.icon"
        textual
        @click="tab = button.id"
      />

      <ImportButton :class="[$style.top, $style.btn]" />
      <ExportButton :class="$style.btn" />
      <div :class="$style.divider" />
      <CloudButton :class="$style.btn" />
    </div>

    <div :class="$style.panes">
      <Tabs :components="buttons" :active-tab="tab" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { AsyncTab } from '@components/misc/tabs/Tabs.types';
import Tabs from '@components/misc/tabs/Tabs.vue';
import { ref } from 'vue';
import Dashboard from './dashboard/Dashboard.vue';
import Expenses from './expenses/Expenses.vue';
import Income from './income/Income.vue';
import CloudButton from './navigation/CloudButton.vue';
import ExportButton from './navigation/export/ExportButton.vue';
import ImportButton from './navigation/import/ImportButton.vue';
import ThemeButton from './navigation/ThemeButton.vue';

type Tab = 'dashboard' | 'income' | 'expenses' | 'settings';

interface TabItem extends AsyncTab {
  icon: AppIcon;
}

const menu = ref<HTMLDivElement>();
const tab = ref<Tab>('dashboard');

const buttons: TabItem[] = [
  { icon: 'donut-chart', id: 'dashboard', component: Dashboard },
  { icon: 'hand-coin', id: 'income', component: Income },
  { icon: 'shopping-basket-2', id: 'expenses', component: Expenses }
];
</script>

<style lang="scss" module>
@use 'sass:math';
@use 'src/styles/globals';

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
