export type TransactionType = 'expense' | 'income';

export type Category = 
  | 'Food' 
  | 'Transport' 
  | 'Bills' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Salary'
  | 'Investment'
  | 'Others';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string; // ISO string
}

export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange';

export interface AppSettings {
  currency: string;
  themeColor: ThemeColor;
  darkMode: boolean;
  passcode: string | null;
  initialBalance: number;
}

export interface AiTip {
  title: string;
  description: string;
  icon: 'alert' | 'idea' | 'check';
  action?: string; // To handle clicks like 'review_bills'
}