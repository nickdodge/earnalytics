import { PlatformData } from '../data/mockData';

export interface MonthlyIncomeChange {
  platform: string;
  currentMonth: number;
  previousMonth: number;
  change: number;
  percentChange: number;
}

export const calculateMonthlyIncomeChange = (platform: PlatformData): MonthlyIncomeChange => {
  const historicalEarnings = platform.historicalEarnings || [];
  
  // Get the last two months of data, with fallbacks to 0 if data is missing
  const currentMonthData = historicalEarnings[historicalEarnings.length - 1] || { amount: 0 };
  const previousMonthData = historicalEarnings[historicalEarnings.length - 2] || { amount: 0 };
  
  const currentMonth = currentMonthData.amount || 0;
  const previousMonth = previousMonthData.amount || 0;
  const change = currentMonth - previousMonth;
  const percentChange = previousMonth === 0 ? 0 : (change / previousMonth) * 100;
  
  return {
    platform: platform.name,
    currentMonth,
    previousMonth,
    change,
    percentChange: Number(percentChange.toFixed(1))
  };
};

export const calculateAllPlatformsMonthlyChanges = (platforms: PlatformData[]): MonthlyIncomeChange[] => {
  return platforms.map(platform => calculateMonthlyIncomeChange(platform));
};

export const generateRevenueAlerts = (changes: MonthlyIncomeChange[]): string[] => {
  const alerts: string[] = [];
  const ALERT_THRESHOLD = 20; // 20% threshold for alerts

  changes.forEach(change => {
    const absChange = Math.abs(change.percentChange);
    if (absChange >= ALERT_THRESHOLD) {
      if (change.percentChange < 0) {
        alerts.push(`Your ${change.platform} income dropped ${absChange}% compared to last month.`);
      } else {
        alerts.push(`Your ${change.platform} income grew ${absChange}% this month — keep it up!`);
      }
    }
  });

  return alerts;
}; 