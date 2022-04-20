const formatters: Map<string, Intl.NumberFormat> = new Map();

export const formatCurrency = (
  v = 0,
  locale = 'en-us',
  code = 'GBP'
): string => {
  const cacheKey = locale + code;
  const formatter =
    formatters.get(cacheKey) ??
    new Intl.NumberFormat(locale, {
      currency: code,
      style: 'currency'
    });

  formatters.set(cacheKey, formatter);
  return formatter.format(v);
};
