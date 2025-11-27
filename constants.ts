import { Transaction, Category, ThemeColor } from './types';

export const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Shopping',
  'Salary',
  'Investment',
  'Others',
];

export const THEME_COLORS: { [key in ThemeColor]: string } = {
  blue: 'bg-blue-600',
  green: 'bg-emerald-600',
  purple: 'bg-violet-600',
  orange: 'bg-orange-600',
};

export const GRADIENTS: { [key in ThemeColor]: string } = {
  blue: 'from-blue-600 to-indigo-600',
  green: 'from-emerald-500 to-teal-600',
  purple: 'from-violet-600 to-purple-600',
  orange: 'from-orange-500 to-red-500',
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 5000, type: 'income', category: 'Salary', description: 'Monthly Salary', date: new Date(new Date().setDate(1)).toISOString() },
  { id: '2', amount: 150, type: 'expense', category: 'Food', description: 'Grocery Shopping', date: new Date().toISOString() },
  { id: '3', amount: 45, type: 'expense', category: 'Transport', description: 'Uber ride', date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
  { id: '4', amount: 120, type: 'expense', category: 'Entertainment', description: 'Movie Night', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
  { id: '5', amount: 1200, type: 'expense', category: 'Bills', description: 'Rent Payment', date: new Date(new Date().setDate(5)).toISOString() },
  { id: '6', amount: 300, type: 'expense', category: 'Shopping', description: 'New Shoes', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
];

// Google AdMob Configuration
// Replace these with production IDs when releasing the native app
export const ADMOB_IDS = {
  APP_ID: 'ca-app-pub-1181009023938079~9536866246',
  BANNER: 'ca-app-pub-1181009023938079/8331595789',
  INTERSTITIAL: 'ca-app-pub-1181009023938079/7345817171',
  REWARDED: 'ca-app-pub-1181009023938079/2093490498',
};