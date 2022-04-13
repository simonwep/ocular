const formatters: Map<string, Intl.NumberFormat> = new Map();

export const formatCurrency = (
  v = 0,
  locale = 'en-us',
  code = 'USD'
): string => {
  const cacheKey = locale + code;
  const formatter =
    formatters.get(cacheKey) ??
    new Intl.NumberFormat(locale, {
      currency: code,
      style: 'currency',
    });

  formatters.set(cacheKey, formatter);
  return formatter.format(v);
};

const names: Map<string, string> = new Map();

export const getCurrencyName = (
  locale = 'en-us',
  code = 'USD'
): string | undefined => {
  const cacheKey = locale + code;
  const cache = names.get(cacheKey);

  if (cache) {
    return cache;
  }

  const str = (0).toLocaleString(locale, {
    style: 'currency',
    currency: code,
    currencyDisplay: 'name',
  });

  const name = str.replace(/[\d.]+/g, '');
  return name === code ? undefined : name;
};
