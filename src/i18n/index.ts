import { createI18n, IntlNumberFormat } from 'vue-i18n';
import type en from './locales/en.json';

const imports: Record<string, () => Promise<{ default: string }>> = {
  cze: () => import('./locales/cze.json?raw'),
  en: () => import('./locales/en.json?raw'),
  de: () => import('./locales/de.json?raw'),
  tr: () => import('./locales/tr.json?raw'),
  'pt-br': () => import('./locales/pt-br.json?raw')
} as const;

export type MessageSchema = typeof en;

const browserLocale = navigator.language.slice(0, 2).toLowerCase();

export const availableLocales = Object.keys(imports);
export const initialLocale = availableLocales.includes(browserLocale) ? browserLocale : 'en';

export type AvailableLocale = keyof typeof imports;

const numberFormats: IntlNumberFormat = {
  currency: {
    minimumFractionDigits: 0,
    style: 'currency'
  },
  percent: {
    maximumFractionDigits: 0,
    style: 'percent'
  }
};

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale
});

export const changeLocale = async (locale: AvailableLocale, currency?: Intl.NumberFormatOptions) => {
  const messages = JSON.parse((await imports[locale]()).default);
  const numberFormat: IntlNumberFormat = { ...numberFormats, currency: { ...numberFormats.currency, ...currency } };

  document.documentElement.lang = locale;
  i18n.global.setLocaleMessage(locale, messages);
  i18n.global.setNumberFormat(locale, numberFormat);
  i18n.global.locale.value = locale;
};

await changeLocale(browserLocale);
