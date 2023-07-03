<template>
  <Pane :class="$style.dashboard" :title="t('dashboard.header', { year: state.activeYear })">
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
import { AppIcon } from '@components/base/icon/Icon.types';
import Link from '@components/base/link/Link.vue';
import AnimatedRouterView from '@components/misc/animated-router-view/AnimatedRouterView.vue';
import { useDataStore } from '@store/state';
import Pane from '../shared/Pane.vue';

const { t } = useI18n();
const { state } = useDataStore();
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
