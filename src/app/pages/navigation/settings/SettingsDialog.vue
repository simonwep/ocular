<template>
  <Dialog :open="open" :title="t('navigation.settings.settings')" @close="emit('close')">
    <div :class="$style.settingsDialog">
      <Select
        :modelValue="state.locale"
        testId="change-locale"
        :label="t('navigation.settings.language')"
        :options="locales"
        @update:model-value="changeLocale($event as AvailableLocale)"
      />

      <Select
        :modelValue="state.currency"
        testId="change-currency"
        :label="t('navigation.settings.currency')"
        :options="currencies"
        @update:model-value="changeCurrency($event as AvailableCurrency)"
      />

      <Select
        :modelValue="settings.general.monthOffset"
        testId="change-month-offset"
        :label="t('navigation.settings.firstMonthOfYear')"
        :options="months"
        @update:model-value="setMonthOffset($event as number)"
      />

      <CheckBox
        :label="t('navigation.settings.showAnimationsAndTransitions')"
        :modelValue="settings.appearance.animations"
        @update:model-value="setAnimations"
      />

      <CheckBox
        :label="t('navigation.settings.carryOverNetSavings')"
        :subLabel="t('navigation.settings.carryOverNetSavingsInfo')"
        :modelValue="settings.general.carryOver"
        testId="carry-over-net-savings"
        @update:model-value="setCarryOver"
      />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import CheckBox from '@components/base/check-box/CheckBox.vue';
import { ContextMenuOption } from '@components/base/context-menu/ContextMenu.types.ts';
import Dialog from '@components/base/dialog/Dialog.vue';
import Select from '@components/base/select/Select.vue';
import { useMonthNames } from '@composables';
import { AvailableLocale, availableLocales, initialLocale } from '@i18n/index.ts';
import { RiCheckLine } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { useDataStore } from '@store/state';
import { availableCurrencies, AvailableCurrency } from '@store/state/types.ts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { t, locale } = useI18n();
const { setMonthOffset, setCarryOver, setAnimations, state: settings } = useSettingsStore();
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
