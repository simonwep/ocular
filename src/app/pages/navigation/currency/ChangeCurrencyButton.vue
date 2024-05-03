<template>
  <ContextMenu
    :tooltip="t('navigation.currency.change')"
    tooltip-position="right"
    :options="currencies"
    @select="changeCurrency($event.id as AvailableCurrency)"
  >
    <template #default="{ toggle }">
      <Button :class="classes" :icon="RiCurrencyLine" textual color="dimmed" @click="toggle" />
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import { RiCheckLine, RiCurrencyLine } from '@remixicon/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import { ContextMenuOption } from '@components/base/context-menu/ContextMenu.types';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useDataStore } from '@store/state';
import { availableCurrencies, AvailableCurrency } from '@store/state/types';
import { ClassNames } from '@utils';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t, locale } = useI18n();
const { changeCurrency, state } = useDataStore();

const formatNumber = (locale: string, currency: string, currencyDisplay?: string) => {
  const symbol = new Intl.NumberFormat(locale, {
    style: 'currency',
    currencyDisplay,
    currency
  })
    .formatToParts(0)
    .find((x) => x.type === 'currency')?.value;

  return symbol ? symbol[0].toUpperCase() + symbol.slice(1) : symbol;
};

const classes = computed(() => props.class);

const currencies = computed<ContextMenuOption[]>(() =>
  availableCurrencies.map((value) => ({
    id: value,
    icon: state.currency === value ? RiCheckLine : undefined,
    label: `${formatNumber(locale.value, value, 'name')} (${formatNumber(locale.value, value)})`
  }))
);
</script>
