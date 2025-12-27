<template>
  <div ref="frame" :class="$style.frame">
    <div ref="menu" :class="$style.buttons">
      <template v-if="media !== 'mobile'">
        <ThemeButton :class="$style.btn" />
        <div :class="$style.divider" />
      </template>

      <Link
        v-for="button of buttons"
        :key="button.name"
        :tooltip="button.tooltip"
        tooltipPosition="right"
        testId="navigation"
        :class="$style.btn"
        :color="(currentRoute) => (currentRoute ? 'primary' : 'dimmed')"
        :icon="button.icon"
        :to="button.name"
      />

      <div v-if="media !== 'mobile'" style="flex-grow: 1" />

      <ToolsButton :class="$style.btn" />
      <AdminButton v-if="user?.admin" :class="$style.btn" />
      <ChangeYearButton :class="$style.btn" />

      <template v-if="media !== 'mobile'">
        <SettingsButton :class="$style.btn" />
        <InfoButton :class="$style.btn" />
      </template>

      <div :class="$style.divider" />
      <UpdateAppButton v-if="media !== 'mobile'" :class="$style.btn" />
      <CloudButton :class="$style.btn" />
    </div>

    <div ref="panes" :class="$style.panes">
      <StatusBar />

      <!-- eslint-disable vue/no-template-shadow -->
      <RouterView v-slot="{ Component }">
        <ComponentTransition :is="Component" v-if="Component" />
      </RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AdminButton from '@app/pages/navigation/admin/AdminButton.vue';
import CloudButton from '@app/pages/navigation/auth/CloudButton.vue';
import InfoButton from '@app/pages/navigation/info/InfoButton.vue';
import SettingsButton from '@app/pages/navigation/settings/SettingsButton.vue';
import ThemeButton from '@app/pages/navigation/theme/ThemeButton.vue';
import ToolsButton from '@app/pages/navigation/tools/ToolsButton.vue';
import UpdateAppButton from '@app/pages/navigation/update/UpdateAppButton.vue';
import ChangeYearButton from '@app/pages/navigation/year/ChangeYearButton.vue';
import Link from '@components/base/link/Link.vue';
import StatusBar from '@components/feature/status-bar/StatusBar.vue';
import ComponentTransition from '@components/misc/component-transition/ComponentTransition.vue';
import { useMediaQuery } from '@composables/useMediaQuery.ts';
import { useSquircle } from '@composables/useSquircle.ts';
import { RiDonutChartLine, RiHandCoinLine, RiShoppingBagLine } from '@remixicon/vue';
import { useStorage } from '@storage/index';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Component } from 'vue';

const menu = ref<HTMLDivElement>();
const media = useMediaQuery();
const frame = useSquircle(() => (['minimized', 'mobile'].includes(media.value) ? 0 : 0.035));
const { user } = useStorage();
const { t } = useI18n();

interface FrameButton {
  icon: Component;
  name: string;
  tooltip: string;
}

const buttons = computed((): FrameButton[] => [
  { icon: RiDonutChartLine, name: 'dashboard', tooltip: t('page.dashboard.title') },
  { icon: RiHandCoinLine, name: 'income', tooltip: t('page.income.title') },
  { icon: RiShoppingBagLine, name: 'expenses', tooltip: t('page.expenses.title') }
]);
</script>

<style lang="scss" module>
@use '@styles/globals.scss';
@use 'sass:math';

.frame {
  display: flex;
  height: 100%;
  width: 100%;
  background: var(--app-background);
}

.panes {
  display: flex;
  flex-direction: column;
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
  gap: 15px;

  .top {
    margin-top: auto;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: var(--app-border);
  }

  .mobileDivider {
    display: none;
    width: 1px;
    background: var(--app-border);
    height: 100%;
    margin: 0 -15px;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@include globals.onMobileDevices {
  .frame {
    flex-direction: column-reverse;
  }

  .panes {
    height: auto;
    flex-grow: 1;
  }

  .buttons {
    border: none;
    border-top: 1px solid var(--app-border);
    align-items: center;
    margin-top: 0;
    justify-content: space-evenly;
    flex-direction: row-reverse;
    height: auto;
    padding: 14px 4px;

    .divider {
      display: none;
    }
  }
}
</style>
