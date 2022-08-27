import { createI18n } from 'vue-i18n';
import de from './locales/de.json';
import en from './locales/en.json';

export type MessageSchema = typeof en;

const browserLocale = navigator.language.slice(0, 2).toLowerCase();
const messages: Record<string, MessageSchema> = { en, de } as const;

export const availableLocales = ['en', 'de'];
export const initialLocale = availableLocales.includes(browserLocale) ? browserLocale : 'en';

export type AvailableLocale = keyof typeof messages;

const datetimeFormats = Object.fromEntries(Object.entries(messages).map((v) => [[v[0]], v[1]._dateTimeFormats]));

const numberFormats = Object.fromEntries(Object.entries(messages).map((v) => [[v[0]], v[1]._numberFormats]));

/* eslint-disable @typescript-eslint/no-explicit-any */
export const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en',
  locale: initialLocale,
  messages: messages as any,
  datetimeFormats,
  numberFormats
});
