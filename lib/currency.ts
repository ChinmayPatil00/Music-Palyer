import { CurrencyCode } from '@/types';

// Baseline rates relative to INR (1 INR = X)
export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rateFromINR: number; rateToINR: number; name: string }> = {
  INR: { symbol: '₹', rateFromINR: 1, rateToINR: 1, name: 'Indian Rupee' },
  USD: { symbol: '$', rateFromINR: 0.0118, rateToINR: 84.7, name: 'US Dollar' },
  EUR: { symbol: '€', rateFromINR: 0.0109, rateToINR: 91.5, name: 'Euro' },
  GBP: { symbol: '£', rateFromINR: 0.0093, rateToINR: 107.5, name: 'British Pound' },
  AED: { symbol: 'AED ', rateFromINR: 0.0433, rateToINR: 23.1, name: 'UAE Dirham' }
};

export function convertFromINR(amountINR: number, targetCurrency: CurrencyCode): number {
  const rate = CURRENCY_RATES[targetCurrency]?.rateFromINR || 1;
  return Math.round(amountINR * rate);
}

export function convertToINR(amountTarget: number, sourceCurrency: CurrencyCode): number {
  const rate = CURRENCY_RATES[sourceCurrency]?.rateToINR || 1;
  return Math.round(amountTarget * rate);
}

export function formatPrice(amountINR: number, currency: CurrencyCode = 'INR'): string {
  const converted = convertFromINR(amountINR, currency);
  const symbol = CURRENCY_RATES[currency]?.symbol || '₹';
  
  if (currency === 'INR') {
    return `${symbol}${converted.toLocaleString('en-IN')}`;
  }
  return `${symbol}${converted.toLocaleString('en-US')}`;
}
