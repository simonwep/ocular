<template>
  <Pane :class="$style.dashboard" :title="t('dashboard.dashboard')">
    <template #header>
      <div :class="$style.viewButtons">
        <Button
          v-for="btn of buttons"
          textual
          @click="view = btn.id"
          :color="btn.id === view ? 'primary' : 'dimmed'"
          :icon="btn.icon"
          :key="btn.id"
        />
      </div>
    </template>
    <Tabs :components="buttons" :active-tab="view" />
  </Pane>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { AsyncTab } from '@components/misc/tabs/Tabs.types';
import Tabs from '@components/misc/tabs/Tabs.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Pane from '../shared/Pane.vue';
import Overview from './overview/Overview.vue';
import Summary from './summary/Summary.vue';

const { t } = useI18n();

type View = 'charts' | 'tables';

interface ViewButton extends AsyncTab {
  icon: AppIcon;
}

const view = ref<View>('charts');
const buttons: ViewButton[] = [
  { id: 'charts', icon: 'pi-chart-line', component: Overview },
  { id: 'tables', icon: 'grid-line', component: Summary }
];
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.dashboard {
  flex-grow: 1;
}

.viewButtons {
  display: flex;
  grid-gap: 5px;
}
</style>
