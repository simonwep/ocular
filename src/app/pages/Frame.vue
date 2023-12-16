<template>
  <div :class="$style.frame">
    <div ref="menu" :class="$style.buttons">
      <ThemeButton :class="$style.btn" />
      <div :class="$style.divider" />

      <Link
        v-for="button of buttons"
        :key="button.name"
        :tooltip="button.tooltip"
        tooltip-position="right"
        :class="$style.btn"
        :color="(currentRoute) => (currentRoute ? 'primary' : 'dimmed')"
        :icon="button.icon"
        :name="button.name"
      />

      <ToolsButton :class="[$style.top, $style.btn]" />
      <AdminButton v-if="user?.admin" :class="$style.btn" />
      <SelectYearButton :class="$style.btn" />
      <template v-if="media !== 'mobile'">
        <ChangeLanguageButton :class="$style.btn" />
        <ChangeCurrencyButton :class="$style.btn" />
        <InfoButton :class="$style.btn" />
      </template>
      <div :class="$style.divider" />
      <CloudButton :class="$style.btn" />
    </div>

    <div ref="panes" :class="$style.panes">
      <RouterView v-slot="{ Component }">
        <ComponentTransition :is="Component" />
      </RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InfoButton from '@app/pages/navigation/info/InfoButton.vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import Link from '@components/base/link/Link.vue';
import ComponentTransition from '@components/misc/component-transition/ComponentTransition.vue';
import { useMediaQuery } from '@composables';
import { useStorage } from '@storage/index';
import AdminButton from './navigation/admin/AdminButton.vue';
import CloudButton from './navigation/auth/CloudButton.vue';
import ChangeCurrencyButton from './navigation/currency/ChangeCurrencyButton.vue';
import ChangeLanguageButton from './navigation/language/ChangeLanguageButton.vue';
import ThemeButton from './navigation/theme/ThemeButton.vue';
import ToolsButton from './navigation/tools/ToolsButton.vue';
import SelectYearButton from './navigation/year/SelectYearButton.vue';

const menu = ref<HTMLDivElement>();
const media = useMediaQuery();
const { user } = useStorage();
const { t } = useI18n();

interface FrameButton {
  icon: AppIcon;
  name: string;
  tooltip: string;
}

const buttons = computed((): FrameButton[] => [
  { icon: 'donut-chart', name: 'dashboard', tooltip: t('page.dashboard.title') },
  { icon: 'hand-coin', name: 'income', tooltip: t('page.income.title') },
  { icon: 'shopping-basket-2', name: 'expenses', tooltip: t('page.expenses.title') }
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
