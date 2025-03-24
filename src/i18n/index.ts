import cze from './locales/cze.json?url';
import de from './locales/de.json?url';
import en from './locales/en.json?url';
import es from './locales/es.json?url';
import fr from './locales/fr.json?url';
import hu from './locales/hu.json?url';
import id from './locales/id.json?url';
import it from './locales/it.json?url';
import pl from './locales/pl.json?url';
import ptbr from './locales/pt-br.json?url';
import ru from './locales/ru.json?url';
import tr from './locales/tr.json?url';

import { createI18n, IntlNumberFormat } from 'vue-i18n';

const localeUrls = { de, en, tr, it, 'pt-br': ptbr, cze, hu, pl, ru, es, fr, id };

export const availableLocales = Object.keys(localeUrls);

export const initialLocale =
  (navigator.languages
    .flatMap((v) => [v, ...v.split('-')])
    .find((locale) => availableLocales.includes(locale)) as AvailableLocale) ?? 'en';

export type AvailableLocale = keyof typeof localeUrls;

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
  const messages = await fetch(localeUrls[locale]).then((res) => res.json());

  const numberFormat: IntlNumberFormat = {
    ...numberFormats,
    currency: { ...numberFormats.currency, ...currency }
  };

  document.documentElement.lang = locale;
  i18n.global.setLocaleMessage(locale, messages);
  i18n.global.setNumberFormat(locale, numberFormat);
  i18n.global.locale.value = locale;
};
