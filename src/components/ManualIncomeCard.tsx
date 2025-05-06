import React from 'react';
import { CustomIncomeEntry } from '../types/CustomIncome';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ManualIncomeCardProps {
  income: CustomIncomeEntry;
  onEdit?: () => void;
  onDelete?: () => void;
}

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

const ManualIncomeCard: React.FC<ManualIncomeCardProps> = ({ income, onEdit, onDelete }) => {
  // Get last 6 months of data
  const N = 6;
  const months = getLastNMonths(N);
  const chartData = months.map(month => {
    const isCurrentMonth = month === months[months.length - 1];
    if (isCurrentMonth) {
      return { month, amount: income.income };
    }
    const earnings = income.historicalEarnings?.find(he => he.month === month);
    return { month, amount: earnings ? earnings.amount : 0 };
  });

  // Get the color to use, falling back to a default if not provided
  const getColorClass = () => {
    if (income.color) {
      if (income.color.startsWith('#')) {
        return `text-[${income.color}]`;
      }
      return income.color;
    }
    return 'text-gray-600';
  };

  return (
    <div 
      data-testid={`income-card-${income.id}`}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4"
      style={income.color?.startsWith('#') ? { borderLeft: `4px solid ${income.color}` } : undefined}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={income.color?.startsWith('#') ? { backgroundColor: `${income.color}20` } : undefined}
          >
            {income.logo ? (
              income.logo.startsWith('http') ? (
                <img src={income.logo} alt={income.name} className="w-8 h-8 object-contain" />
              ) : (
                income.logo
              )
            ) : (
              '💼'
            )}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${getColorClass()}`}>{income.name}</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              ${income.income.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              title="Edit income"
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
              title="Delete income"
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

      {income.notes && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {income.notes}
        </p>
      )}

      <div className="h-24">
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
              hide
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
              stroke={income.color?.startsWith('#') ? income.color : '#4B5563'}
              strokeWidth={2}
              dot={{ fill: income.color?.startsWith('#') ? income.color : '#4B5563' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManualIncomeCard; 