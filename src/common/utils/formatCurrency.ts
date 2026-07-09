import { currencyConfig } from '../../config/currency.config';

export const formatCurrency = (value: number, locale?: string): string => {
  const usedLocale = locale || currencyConfig.locale || 'en-IN';
  const formatter = new Intl.NumberFormat(usedLocale, {
    style: 'currency',
    currency: currencyConfig.code || 'INR',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 2,
  });
  // Remove spaces (e.g., between symbol and number)
  return formatter.format(value).replace(/\s/g, '');
};
