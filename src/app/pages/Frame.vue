<template>
  <div :class="$style.frame">
    <div ref="menu" :class="$style.buttons">
      <ThemeButton :class="$style.btn" />
      <div :class="$style.divider" />

      <Link
        v-for="button of buttons"
        :class="$style.btn"
        :key="button.id"
        :color="router.currentRoute.value.path.startsWith(button.link) ? 'primary' : 'dimmed'"
        :icon="button.icon"
        :to="button.link"
      />

      <ToolsButton :class="[$style.top, $style.btn]" />
      <SelectYearButton :class="$style.btn" />
      <ChangeLanguageButton :class="$style.btn" />
      <ChangeCurrencyButton :class="$style.btn" />
      <div :class="$style.divider" />
      <CloudButton :class="$style.btn" />
    </div>

    <div ref="panes" :class="$style.panes">
      <AnimatedRouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon } from '@components/base/icon/Icon.types';
import Link from '@components/base/link/Link.vue';
import AnimatedRouterView from '@components/misc/animated-router-view/AnimatedRouterView.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CloudButton from './navigation/CloudButton.vue';
import SelectYearButton from './navigation/year/SelectYearButton.vue';
import ThemeButton from './navigation/ThemeButton.vue';
import ToolsButton from './navigation/tools/ToolsButton.vue';
import ChangeLanguageButton from './navigation/language/ChangeLanguageButton.vue';
import ChangeCurrencyButton from './navigation/currency/ChangeCurrencyButton.vue';

const menu = ref<HTMLDivElement>();
const router = useRouter();

interface FrameButton {
  icon: AppIcon;
  id: string;
  link: string;
}

const buttons: FrameButton[] = [
  { icon: 'donut-chart', id: 'dashboard', link: '/dashboard' },
  { icon: 'hand-coin', id: 'income', link: '/income' },
  { icon: 'shopping-basket-2', id: 'expenses', link: '/expenses' }
];
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
