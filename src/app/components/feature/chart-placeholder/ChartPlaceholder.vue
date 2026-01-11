<template>
  <div :class="[$style.placeholder, classes]">
    <div :class="$style.icons">
      <RiShoppingBasket2Line :class="$style.icon" />
      <RiHandCoinLine :class="$style.icon" />
    </div>

    <span>{{ t('feature.chartPlaceholder.placeholder') }}</span>

    <Button
      v-if="!OCULAR_GENESIS_HOST"
      testId="load-demo-data-placeholder"
      :icon="RiMagicFill"
      size="xs"
      :text="t('navigation.tools.demo.loadDemoData')"
      @click="loadTemplateData('demo')"
    />
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { useTemplateData } from '@store/state/template/useTemplateData.ts';
import { ClassNames } from '@utils/types.ts';
import { RiHandCoinLine, RiMagicFill, RiShoppingBasket2Line } from '@remixicon/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { OCULAR_GENESIS_HOST } = import.meta.env;

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { loadTemplateData } = useTemplateData();

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
