<template>
  <div :class="$style.frame">
    <div ref="menu" :class="$style.buttons">
      <ThemeButton :class="$style.btn" />
      <div :class="$style.divider" />

      <Link
        v-for="button of buttons"
        :key="button.id"
        :tooltip="button.tooltip"
        tooltip-position="right"
        :class="$style.btn"
        :color="router.currentRoute.value.path.startsWith(button.link) ? 'primary' : 'dimmed'"
        :icon="button.icon"
        :to="button.link"
      />

      <ToolsButton :class="[$style.top, $style.btn]" />
      <AdminButton v-if="user?.admin" :class="$style.btn" />
      <SelectYearButton :class="$style.btn" />
      <template v-if="media !== 'mobile'">
        <ChangeLanguageButton :class="$style.btn" />
        <ChangeCurrencyButton :class="$style.btn" />
      </template>
      <div :class="$style.divider" />
      <CloudButton :class="$style.btn" />
    </div>

    <div ref="panes" :class="$style.panes">
      <AnimatedRouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { AppIcon } from '@components/base/icon/Icon.types';
import Link from '@components/base/link/Link.vue';
import AnimatedRouterView from '@components/misc/animated-router-view/AnimatedRouterView.vue';
import { useMediaQuery } from '@composables';
import { useStorage } from '@storage/index';
import ThemeButton from './navigation/ThemeButton.vue';
import AdminButton from './navigation/admin/AdminButton.vue';
import CloudButton from './navigation/auth/CloudButton.vue';
import ChangeCurrencyButton from './navigation/currency/ChangeCurrencyButton.vue';
import ChangeLanguageButton from './navigation/language/ChangeLanguageButton.vue';
import ToolsButton from './navigation/tools/ToolsButton.vue';
import SelectYearButton from './navigation/year/SelectYearButton.vue';

const menu = ref<HTMLDivElement>();
const router = useRouter();
const media = useMediaQuery();
const { user } = useStorage();
const { t } = useI18n();

interface FrameButton {
  icon: AppIcon;
  id: string;
  link: string;
  tooltip: string;
}

const buttons = computed<FrameButton[]>(() => [
  { icon: 'donut-chart', id: 'dashboard', link: '/dashboard', tooltip: t('navigation.menu.dashboard') },
  { icon: 'hand-coin', id: 'income', link: '/income', tooltip: t('navigation.menu.income') },
  { icon: 'shopping-basket-2', id: 'expenses', link: '/expenses', tooltip: t('navigation.menu.expenses') }
]);
</script>

<style lang="scss" module>
@use 'sass:math';
@use 'src/styles/globals';

.frame {
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
  grid-gap: 15px;

  .top {
    margin-top: auto;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: var(--app-border);
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

    .divider {
      display: none;
    }
  }
}
</style>
