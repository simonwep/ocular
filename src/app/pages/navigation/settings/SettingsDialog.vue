<template>
  <Dialog :open="open" :title="t('navigation.settings.settings')" @close="emit('close')">
    <div :class="$style.settingsDialog">
      <Select
        :model-value="state.locale"
        :label="t('navigation.settings.language')"
        :options="locales"
        @update:model-value="changeLocale($event as AvailableLocale)"
      />

      <Select
        :model-value="state.currency"
        :label="t('navigation.settings.currency')"
        :options="currencies"
        @update:model-value="changeCurrency($event as AvailableCurrency)"
      />

      <Select
        :model-value="settings.general.monthOffset"
        :label="t('navigation.settings.firstMonthOfYear')"
        :options="months"
        @update:model-value="setMonthOffset($event as number)"
      />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from '@components/base/dialog/Dialog.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AvailableLocale, availableLocales, initialLocale } from '@i18n/index.ts';
import { RiCheckLine } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { ContextMenuOption } from '@components/base/context-menu/ContextMenu.types.ts';
import Select from '@components/base/select/Select.vue';
import { availableCurrencies, AvailableCurrency } from '@store/state/types.ts';
import { useSettingsStore } from '@store/settings';
import { useMonthNames } from '@composables';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { t, locale } = useI18n();
const { setMonthOffset, state: settings } = useSettingsStore();
const { changeCurrency, changeLocale, state } = useDataStore();
const monthNames = useMonthNames();

const locales = computed<ContextMenuOption[]>(() => {
  const displayNames = new Intl.DisplayNames(initialLocale, { type: 'language' });

  return availableLocales.map((value) => ({
    id: value,
    icon: state.locale === value ? RiCheckLine : undefined,
    label: displayNames.of(value)
  }));
});

const currencies = computed<ContextMenuOption[]>(() =>
  availableCurrencies.map((value) => ({
    id: value,
    icon: state.currency === value ? RiCheckLine : undefined,
    label: `${formatNumber(locale.value, value, 'name')} (${formatNumber(locale.value, value)})`
  }))
);

const months = computed<ContextMenuOption[]>(() =>
  monthNames.value.map((value, index) => ({
    id: index,
    label: value,
    icon: settings.general.monthOffset === index ? RiCheckLine : undefined
  }))
);

const formatNumber = (locale: string, currency: string, currencyDisplay?: Intl.NumberFormatOptionsCurrencyDisplay) => {
  const symbol = new Intl.NumberFormat(locale, {
    style: 'currency',
    currencyDisplay,
    currency
  })
    .formatToParts(0)
    .find((x) => x.type === 'currency')?.value;

  return symbol ? symbol[0].toUpperCase() + symbol.slice(1) : symbol;
};
</script>

<style lang="scss" module>
.settingsDialog {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
