<template>
  <div :class="[$style.placeholder, classes]">
    <div :class="$style.icons">
      <RiShoppingBasket2Line :class="$style.icon" />
      <RiHandCoinLine :class="$style.icon" />
    </div>

    <span>{{ t('feature.chartPlaceholder.placeholder') }}</span>

    <Button
      v-if="appConfig?.demo"
      testId="load-demo-data-placeholder"
      :icon="RiMagicFill"
      size="xs"
      :text="t('navigation.tools.demo.loadDemoData')"
      @click="loadDemoData"
    />
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { useAppConfig } from '@composables/useAppConfig.ts';
import { RiHandCoinLine, RiMagicFill, RiShoppingBasket2Line } from '@remixicon/vue';
import { useDemoData } from '@store/state/demo-data/useDemoData.ts';
import { ClassNames } from '@utils/types.ts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { loadDemoData } = useDemoData();
const appConfig = useAppConfig();

const classes = computed(() => props.class);
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-grow: 1;

  &,
  .icon {
    color: var(--c-dimmed-pure);
  }

  .icons {
    display: grid;
    grid-template-columns: 24px 24px;
    gap: 10px;
  }
}
</style>
