export interface PlatformData {
  id: string;
  name: string;
  income: number;
  textColor: string;
  color?: string;
  logo?: string;
  tags: string[];
  historicalEarnings: {
    month: string;
    amount: number;
  }[];
}

export const platformData: PlatformData[] = [
  {
    id: '1',
    name: 'YouTube',
    income: 2500,
    textColor: 'text-red-600',
    tags: ['Ad Revenue', 'Sponsorships', 'Memberships', 'Super Chat', 'Merch Shelf'],
    historicalEarnings: [
      { month: 'Jan', amount: 2200 },
      { month: 'Feb', amount: 2350 },
      { month: 'Mar', amount: 2400 },
      { month: 'Apr', amount: 2450 },
      { month: 'May', amount: 2480 },
      { month: 'Jun', amount: 2500 }
    ]
  },
  {
    id: '2',
    name: 'Twitch',
    income: 1800,
    textColor: 'text-purple-600',
    tags: ['Subscriptions', 'Bits', 'Ad Revenue', 'Gift Subs', 'Sponsorships'],
    historicalEarnings: [
      { month: 'Jan', amount: 1500 },
      { month: 'Feb', amount: 1600 },
      { month: 'Mar', amount: 1650 },
      { month: 'Apr', amount: 1700 },
      { month: 'May', amount: 1750 },
      { month: 'Jun', amount: 1800 }
    ]
  },
  {
    id: '3',
    name: 'TikTok',
    income: 3200,
    textColor: 'text-black',
    tags: ['Creator Fund', 'LIVE Gifts', 'Brand Deals', 'TikTok Shop', 'Ad Revenue'],
    historicalEarnings: [
      { month: 'Jan', amount: 2800 },
      { month: 'Feb', amount: 2900 },
      { month: 'Mar', amount: 3000 },
      { month: 'Apr', amount: 3100 },
      { month: 'May', amount: 3150 },
      { month: 'Jun', amount: 3200 }
    ]
  }
]; 