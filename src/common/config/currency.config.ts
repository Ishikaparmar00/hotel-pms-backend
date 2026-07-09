export const currencyConfig = {
  code: process.env.CURRENCY_CODE || 'INR',
  symbol: process.env.CURRENCY_SYMBOL || '₹',
  name: process.env.CURRENCY_NAME || 'Indian Rupee',
  locale: process.env.CURRENCY_LOCALE || 'en-IN',
};
