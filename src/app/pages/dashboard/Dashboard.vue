<template>
  <Pane :class="$style.dashboard">
    <template v-if="state.years.length > 1" #beforeTitle>
      <Button icon="arrow-left-s-line" rounded @click="rotateYear(-1)" />
      <Button icon="arrow-right-s-line" rounded @click="rotateYear(1)" />
    </template>
    <template #title>
      <span>
        <i18n-t keypath="page.dashboard.header" scope="global">
          <template #year>
            <TextWheel :values="allYears" :value="state.activeYear" />
          </template>
        </i18n-t>
      </span>
    </template>
    <template #header>
      <div :class="$style.viewButtons">
        <Button
          textual
          size="l"
          icon="pi-chart-line"
          :tooltip="t('page.dashboard.title')"
          :color="view === Overview ? 'primary' : 'dimmed'"
          @click="view = Overview"
        />
        <Button
          textual
          size="l"
          icon="grid-line"
          :tooltip="t('page.dashboard.tables')"
          :color="view === Summary ? 'primary' : 'dimmed'"
          @click="view = Summary"
        />
      </div>
    </template>
    <ComponentTransition :is="view" />
  </Pane>
</template>

<script lang="ts" setup>
import { computed, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import TextWheel from '@components/base/text-wheel/TextWheel.vue';
import ComponentTransition from '@components/misc/component-transition/ComponentTransition.vue';
import { useDataStore } from '@store/state';
import Pane from '../shared/Pane.vue';
import Overview from './overview/Overview.vue';
import Summary from './summary/Summary.vue';

const { t } = useI18n();
const { state, changeYear } = useDataStore();
const view = shallowRef(Overview);

const allYears = computed(() => state.years.map((v) => v.year));

const rotateYear = (dir: -1 | 1) => {
  const possibleYears = allYears.value;
  const currentIndex = possibleYears.indexOf(state.activeYear);
  const newIndex = (currentIndex + dir + possibleYears.length) % possibleYears.length;
  const newYear = possibleYears[newIndex];
  changeYear(newYear);
};
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.dashboard {
  flex-grow: 1;
}

.viewButtons {
  display: flex;
  gap: 4px;
}

.version {
  color: var(--c-text-dark-muted);
  font-size: var(--font-size-xs);
}

@include globals.onMobileDevices {
  .viewButtons {
    gap: 8px;
  }
}
</style>
