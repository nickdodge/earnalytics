import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlatformData } from '../data/mockData';
import { CustomIncomeEntry } from '../types/CustomIncome';

interface CombinedLineChartProps {
  sources: (PlatformData | CustomIncomeEntry)[];
  showSeparateLines: boolean;
}

const CustomLegend = ({ sources, showSeparateLines, getPlatformColor }: { 
  sources: (PlatformData | CustomIncomeEntry)[]; 
  showSeparateLines: boolean;
  getPlatformColor: (name: string) => string;
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {showSeparateLines ? (
        sources.map(source => (
          <div key={source.name} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: getPlatformColor(source.name) }}
            />
            <span className="text-sm text-gray-600">{source.name}</span>
          </div>
        ))
      ) : (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-600">Total Earnings</span>
        </div>
      )}
    </div>
  );
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

const CombinedLineChart: React.FC<CombinedLineChartProps> = ({ sources, showSeparateLines }) => {
  const N = 6; // Show last 6 months including current
  const months = getLastNMonths(N);

  // Prepare data for the chart
  const chartData = months.map(month => {
    const monthData: { [key: string]: number | string } = { month };
    const isCurrentMonth = month === months[months.length - 1];

    if (showSeparateLines) {
      // Add each source's earnings for the month
      sources.forEach(source => {
        let value = 0;
        if (isCurrentMonth) {
          value = source.income;
        } else {
          const earnings = (source.historicalEarnings ?? []).find(he => he.month === month);
          value = earnings ? earnings.amount : 0;
        }
        monthData[source.name] = value;
      });
    } else {
      // Calculate total earnings for the month
      const totalEarnings = sources.reduce((sum, source) => {
        let value = 0;
        if (isCurrentMonth) {
          value = source.income;
        } else {
          const earnings = (source.historicalEarnings ?? []).find(he => he.month === month);
          value = earnings ? earnings.amount : 0;
        }
        return sum + value;
      }, 0);
      monthData['Total Earnings'] = totalEarnings;
    }

    return monthData;
  });

  // Get colors for each platform
  const getPlatformColor = (platformName: string) => {
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

  return (
    <div className="w-full">
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {showSeparateLines ? (
              sources.map(source => (
                <Line
                  key={source.name}
                  type="monotone"
                  dataKey={source.name}
                  stroke={getPlatformColor(source.name)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey="Total Earnings"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <CustomLegend 
        sources={sources} 
        showSeparateLines={showSeparateLines} 
        getPlatformColor={getPlatformColor} 
      />
    </div>
  );
};

export default CombinedLineChart; 