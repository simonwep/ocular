import { watchEffect } from 'vue';
import { createI18n, IntlNumberFormat } from 'vue-i18n';
import de from './locales/de.json';
import en from './locales/en.json';
import br from './locales/pt-br.json';
import tr from './locales/tr.json';

export type MessageSchema = typeof en;

const browserLocale = navigator.language.slice(0, 2).toLowerCase();
const messages: Record<string, MessageSchema> = { en, de, br, tr } as const;

export const availableLocales = Object.keys(messages);
export const initialLocale = availableLocales.includes(browserLocale) ? browserLocale : 'en';

export type AvailableLocale = keyof typeof messages;

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

/* eslint-disable @typescript-eslint/no-explicit-any */
export const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  locale: initialLocale,
  messages: messages as any,
  numberFormats: Object.fromEntries(availableLocales.map((locale) => [locale, numberFormats]))
});

// Synchronize the i18n locale with the browser locale
watchEffect(() => {
  document.documentElement.lang = i18n.global.locale.value;
});
