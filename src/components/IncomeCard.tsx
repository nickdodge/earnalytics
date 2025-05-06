import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlatformData } from '../data/mockData';
import { calculateMonthlyIncomeChange } from '../utils/incomeCalculations';

interface IncomeCardProps {
  platform: PlatformData;
  onDelete?: () => void;
  onEdit?: () => void;
}

const getChartColor = (platformName: string) => {
  switch (platformName.toLowerCase()) {
    case 'youtube':
      return '#DC2626';
    case 'twitch':
      return '#9333EA';
    case 'tiktok':
      return '#000000';
    default:
      return '#4B5563';
  }
};

// Utility to get last N months ending at current month
function getLastNMonths(n: number) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short' }));
  }
  return months;
}

const IncomeCard: React.FC<IncomeCardProps> = ({ platform, onDelete, onEdit }) => {
  const monthlyChange = calculateMonthlyIncomeChange(platform);
  const chartColor = getChartColor(platform.name);

  // Get the color to use, falling back to textColor if color is not provided
  const getColorClass = () => {
    if (platform.color) {
      return `text-[${platform.color}]`;
    }
    return platform.textColor;
  };

  // Get last 6 months of data
  const N = 6;
  const months = getLastNMonths(N);
  const chartData = months.map(month => {
    const isCurrentMonth = month === months[months.length - 1];
    if (isCurrentMonth) {
      return { month, amount: platform.income };
    }
    const earnings = platform.historicalEarnings?.find(he => he.month === month);
    return { month, amount: earnings ? earnings.amount : 0 };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4" data-testid={`income-card-${platform.id}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-semibold ${getColorClass()}`} data-testid="income-card-name">{platform.name}</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100" data-testid="income-card-amount">
            ${platform.income.toLocaleString()}
          </p>
          <div className="mt-1 text-sm">
            <span className={`${monthlyChange.percentChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} data-testid="income-card-change">
              {monthlyChange.percentChange >= 0 ? '↑' : '↓'} {Math.abs(monthlyChange.percentChange)}%
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              vs last month
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              title="Edit platform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Delete platform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Income']}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                color: '#374151'
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={chartColor}
              strokeWidth={2}
              dot={{ fill: chartColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeCard; 