<template>
  <ContextMenu
    :tooltip="t('navigation.currency')"
    tooltip-position="right"
    :class="classes"
    :options="currencies"
    @select="changeCurrency($event.id as AvailableCurrency)"
  >
    <Button icon="currency-line" textual color="dimmed" />
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import { ContextMenuOption } from '@components/base/context-menu';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useDataStore } from '@store/state';
import { availableCurrencies, AvailableCurrency } from '@store/state/types';
import { ClassNames } from '@utils';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t, locale } = useI18n();
const { changeCurrency, state } = useDataStore();

const formatNumber = (currency: string, currencyDisplay?: string) => {
  const text = (0)
    .toLocaleString(locale.value, {
      style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay,
      currency
    })
    .replace(/\d/g, '')
    .trim();

  return text[0].toUpperCase() + text.slice(1);
};

const classes = computed(() => props.class);

const currencies = computed<ContextMenuOption[]>(() =>
  availableCurrencies.map((value) => ({
    id: value,
    icon: state.currency === value ? 'check' : undefined,
    label: `${formatNumber(value, 'name')} (${formatNumber(value)})`
  }))
);
</script>
