export interface CustomIncomeEntry {
  id: string;
  name: string;
  income: number;
  notes?: string;
  tags: string[];
  color?: string; // HEX or Tailwind class
  logo?: string;  // Optional image URL or emoji
  type: 'platform' | 'manual';
  historicalEarnings: { month: string; amount: number }[];
} 