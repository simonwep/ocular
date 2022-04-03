export const formatCurrency = (
    v = 0,
    locale = 'en-us',
    currency = 'USD'
): string => new Intl.NumberFormat(locale, {
    currency: currency,
    style: 'currency'
}).format(v);
