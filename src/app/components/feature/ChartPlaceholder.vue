<template>
  <div :class="[$style.placeholder, classes]">
    <div :class="$style.icons">
      <RiShoppingBasket2Line :class="$style.icon" />
      <RiHandCoinLine :class="$style.icon" />
    </div>
    <span>{{ t('shared.placeholder') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { RiHandCoinLine, RiShoppingBasket2Line } from '@remixicon/vue';
import { ClassNames } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const { t } = useI18n();
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
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
