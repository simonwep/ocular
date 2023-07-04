<template>
  <Pane :class="$style.dashboard" :title="t('dashboard.header', { year: state.activeYear })">
    <template v-if="state.years.length" #beforeTitle>
      <Button icon="arrow-left-s-line" @click="rotateYear(-1)" />
      <Button icon="arrow-right-s-line" @click="rotateYear(1)" />
    </template>
    <template #header>
      <div :class="$style.viewButtons">
        <Link
          v-for="button of buttons"
          :key="button.id"
          :to="button.link"
          :color="router.currentRoute.value.path.endsWith(button.link) ? 'primary' : 'dimmed'"
          :icon="button.icon"
        />
      </div>
    </template>
    <AnimatedRouterView />
  </Pane>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import Link from '@components/base/link/Link.vue';
import AnimatedRouterView from '@components/misc/animated-router-view/AnimatedRouterView.vue';
import { useDataStore } from '@store/state';
import Pane from '../shared/Pane.vue';

const { t } = useI18n();
const { state, changeYear } = useDataStore();
const router = useRouter();

interface DashboardTab {
  icon: AppIcon;
  id: string;
  link: string;
}

const buttons = [
  { id: 'charts', icon: 'pi-chart-line', link: '' },
  { id: 'tables', icon: 'grid-line', link: '/summary' }
].map((v) => ({ ...v, link: `/dashboard${v.link}` })) as DashboardTab[];

const rotateYear = (dir: -1 | 1) => {
  const possibleYears = state.years.map((v) => v.year);
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
</style>
