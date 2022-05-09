<template>
  <div :class="[$style.placeholder, classes]">
    <div :class="$style.icons">
      <Icon icon="shopping-basket-2" />
      <Icon icon="hand-coin" />
    </div>
    <span>{{ t('dashboard.graph.placeholder') }}</span>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@components/base/icon/Icon.vue';
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
@use 'src/styles/globals';

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-gap: 10px;
  flex-grow: 1;

  .icons {
    display: flex;
    grid-gap: 10px;
    color: var(--theme-text);
  }
}
</style>
