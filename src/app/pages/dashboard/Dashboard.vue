<template>
  <Pane :class="$style.dashboard">
    <template v-if="state.years.length > 1" #beforeTitle>
      <Button icon="arrow-left-s-line" rounded @click="rotateYear(-1)" />
      <Button icon="arrow-right-s-line" rounded @click="rotateYear(1)" />
    </template>
    <template #title>
      <span>
        <i18n-t keypath="dashboard.header">
          <template #year>
            <TextWheel :values="allYears" :value="state.activeYear" />
          </template>
        </i18n-t>
      </span>
    </template>
    <template #header>
      <div :class="$style.viewButtons">
        <Link
          :tooltip="t('navigation.menu.dashboard')"
          tooltip-position="bottom-end"
          to="/dashboard"
          :color="router.currentRoute.value.path.endsWith('/dashboard') ? 'primary' : 'dimmed'"
          icon="pi-chart-line"
        />
        <Link
          :tooltip="t('dashboard.tableOverview')"
          tooltip-position="bottom-end"
          to="/dashboard/summary"
          :color="router.currentRoute.value.path.endsWith('/dashboard/summary') ? 'primary' : 'dimmed'"
          icon="grid-line"
        />
      </div>
    </template>
    <AnimatedRouterView />
  </Pane>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Button from '@components/base/button/Button.vue';
import Link from '@components/base/link/Link.vue';
import TextWheel from '@components/base/text-wheel/TextWheel.vue';
import AnimatedRouterView from '@components/misc/animated-router-view/AnimatedRouterView.vue';
import { useDataStore } from '@store/state';
import Pane from '../shared/Pane.vue';

const { t } = useI18n();
const { state, changeYear } = useDataStore();
const router = useRouter();

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
  grid-gap: 10px;
}

.version {
  color: var(--c-text-dark-muted);
  font-size: var(--font-size-xs);
}
</style>
