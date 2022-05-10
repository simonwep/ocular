<template>
  <Pane :class="$style.dashboard" :title="t('dashboard.dashboard')">
    <template #header>
      <div :class="$style.viewButtons">
        <Button
          v-for="button of buttons"
          textual
          @click="router.push(button.link)"
          :color="router.currentRoute.value.path.endsWith(button.link) ? 'primary' : 'dimmed'"
          :icon="button.icon"
          :key="button.id"
        />
      </div>
    </template>
    <RouterView />
  </Pane>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Pane from '../shared/Pane.vue';

const { t } = useI18n();
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
  grid-gap: 5px;
}
</style>
