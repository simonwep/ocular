<template>
  <div :class="[$style.placeholder, classes]">
    <div :class="$style.icons">
      <Icon icon="shopping-basket-2" :class="$style.icon" />
      <Icon icon="hand-coin" :class="$style.icon" />
    </div>
    <span>{{ t('shared.placeholder') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Icon from '@components/base/icon/Icon.vue';
import { ClassNames } from '@utils';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const { t } = useI18n();
</script>

<style lang="scss" module>
@use 'src/styles/globals';

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
