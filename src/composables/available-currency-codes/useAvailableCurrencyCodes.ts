import codes from './currencies.json' assert { type: 'json' };
import { computed, MaybeRefOrGetter, toValue } from 'vue';

const availableCurrencies = new Set(codes);
const supportedCurrenciesByBrowser = new Set(Intl.supportedValuesOf('currency'));
const currencies = availableCurrencies.intersection(supportedCurrenciesByBrowser);

export const useAvailableCurrencyCodes = (include?: MaybeRefOrGetter<string[]>) =>
  computed(() => Array.from(currencies.union(new Set(toValue(include) ?? []))).sort());
