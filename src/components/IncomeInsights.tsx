import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { PlatformData } from '../data/mockData';
import { CustomIncomeEntry } from '../types/CustomIncome';

interface IncomeInsightsProps {
  platforms: (PlatformData | CustomIncomeEntry)[];
  months?: string[];
}

const IncomeInsights: React.FC<IncomeInsightsProps> = ({ platforms, months }) => {
  if (!platforms || platforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <img src="/empty-state-illustration.svg" alt="No data" className="w-40 h-40 mb-4 opacity-80 transition-opacity duration-700 ease-in-out animate-fadein" />
        <div className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No data to display</div>
        <div className="text-gray-400 dark:text-gray-500">Try adjusting your filters or add more income sources.</div>
      </div>
    );
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

  const N = 6; // Show last 6 months including current
  const unifiedMonths = getLastNMonths(N);

  // Map each platform's earnings to unifiedMonths, using historicalEarnings and current income
  const platformsWithUnifiedEarnings = platforms.map(platform => {
    const earningsMap: { [month: string]: number } = {};
    platform.historicalEarnings.forEach(e => { earningsMap[e.month] = e.amount; });
    // Set current month to platform.income
    const currentMonth = unifiedMonths[unifiedMonths.length - 1];
    earningsMap[currentMonth] = platform.income;
    return {
      ...platform,
      unifiedEarnings: unifiedMonths.map(month => ({ month, amount: earningsMap[month] || 0 }))
    };
  });

  const totalEarnings = platforms.reduce((sum, platform) => sum + platform.income, 0);
  
  // Use provided months or default to all months
  const allMonths = platforms[0]?.historicalEarnings.map(e => e.month) || [];
  const filteredMonths = months && months.length > 0 ? months : allMonths;

  // Pie chart data (current month)
  const pieData = platformsWithUnifiedEarnings.map(platform => ({
    name: platform.name,
    value: platform.income,
    percentage: ((platform.income / totalEarnings) * 100).toFixed(1)
  }));

  // Top platform (current month)
  const topPlatform = platformsWithUnifiedEarnings.length > 0
    ? platformsWithUnifiedEarnings.reduce((prev, current) =>
        prev.income > current.income ? prev : current,
        platformsWithUnifiedEarnings[0]
      )
    : {
        name: '',
        income: 0,
        textColor: '',
        color: '',
        logo: '',
        tags: [],
        historicalEarnings: [],
        unifiedEarnings: []
      };

  // Growth calculation (from first to last in unifiedEarnings)
  const calculateGrowth = (platform: typeof platformsWithUnifiedEarnings[0]) => {
    if (platform.unifiedEarnings.length < 2) return '0.0';
    const first = platform.unifiedEarnings[0].amount;
    const last = platform.unifiedEarnings[platform.unifiedEarnings.length - 1].amount;
    return first === 0 ? '0.0' : (((last - first) / first) * 100).toFixed(1);
  };
  const averageGrowth = platformsWithUnifiedEarnings.reduce((sum, platform) =>
    sum + parseFloat(calculateGrowth(platform)), 0) / platformsWithUnifiedEarnings.length;

  const COLORS = ['#FF0000', '#9146FF', '#000000', '#1DA1F2', '#25F4EE'];

  // Unified total income data for line chart
  const totalIncomeData = unifiedMonths.map(month => ({
    month,
    total: platformsWithUnifiedEarnings.reduce((sum, p) => {
      const entry = p.unifiedEarnings.find(e => e.month === month);
      return sum + (entry ? entry.amount : 0);
    }, 0)
  }));

  // Unified stacked data for area chart
  const stackedData = unifiedMonths.map(month => {
    const entry: any = { month };
    platformsWithUnifiedEarnings.forEach(p => {
      const he = p.unifiedEarnings.find(e => e.month === month);
      entry[p.name] = he ? he.amount : 0;
    });
    return entry;
  });

  // --- New Insights Logic ---
  // 1. Best and Worst Month by Total Income
  const monthTotals = unifiedMonths.map(month => ({
    month,
    total: platformsWithUnifiedEarnings.reduce((sum, p) => {
      const entry = p.unifiedEarnings.find(e => e.month === month);
      return sum + (entry ? entry.amount : 0);
    }, 0)
  }));
  const bestMonth = monthTotals.length
    ? monthTotals.reduce((prev, curr) => (curr.total > prev.total ? curr : prev), monthTotals[0])
    : { month: '', total: 0 };
  const worstMonth = monthTotals.length
    ? monthTotals.reduce((prev, curr) => (curr.total < prev.total ? curr : prev), monthTotals[0])
    : { month: '', total: 0 };

  // 2. Most Consistent Platform (Lowest Variance)
  function variance(arr: number[]) {
    if (arr.length === 0) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  }
  function stddev(arr: number[]) {
    return Math.sqrt(variance(arr));
  }
  const platformVariances = platformsWithUnifiedEarnings.map(p => ({
    name: p.name,
    variance: variance(p.unifiedEarnings.map(e => e.amount)),
    stddev: stddev(p.unifiedEarnings.map(e => e.amount)),
  }));
  const mostConsistent = platformVariances.length
    ? platformVariances.reduce((prev, curr) => (curr.variance < prev.variance ? curr : prev), platformVariances[0])
    : { name: '', variance: 0, stddev: 0 };

  // AnimatedCard component for entrance animation
  type AnimatedCardProps = { children: React.ReactNode; className?: string };
  function AnimatedCard({ children, className = '' }: AnimatedCardProps) {
    const [show, setShow] = useState(false);
    useEffect(() => { setShow(true); }, []);
    return (
      <div
        className={`transition-all duration-700 ease-in-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Advanced Insights Section */}
      <AnimatedCard className="bg-gradient-to-br from-blue-50/80 via-white/80 to-green-50/80 dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 rounded-2xl shadow-xl p-6 space-y-2 border border-gray-100 dark:border-gray-800 hover:scale-[1.03] hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-2">
          <span>🔍 Advanced Insights</span>
        </h2>
        <div className="flex flex-wrap gap-6 text-base">
          <div>
            <span className="font-semibold">Best Month:</span> <span className="text-blue-600 dark:text-blue-400">{bestMonth.month}</span> <span className="font-mono">(${bestMonth.total.toLocaleString()})</span>
          </div>
          <div>
            <span className="font-semibold">Worst Month:</span> <span className="text-red-600 dark:text-red-400">{worstMonth.month}</span> <span className="font-mono">(${worstMonth.total.toLocaleString()})</span>
          </div>
          <div>
            <span className="font-semibold">Most Consistent Platform:</span> <span className="text-green-600 dark:text-green-400">{mostConsistent.name}</span> <span className="font-mono">(Variance: {mostConsistent.variance.toFixed(2)})</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="font-semibold">Income Volatility (Std Dev):</span>
          <ul className="list-disc ml-6 mt-1 text-base">
            {platformVariances.map(p => (
              <li key={p.name}>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{p.name}</span>: <span className="font-mono">{p.stddev.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </AnimatedCard>
      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
      {/* Top Platform Section */}
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4 border border-gray-100 dark:border-gray-800 hover:scale-[1.03] hover:shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-1">
          <span>🏆 Top Performing Platform</span>
        </h2>
        <div className="flex items-center space-x-4">
          <div className={`text-4xl font-bold ${'textColor' in topPlatform && topPlatform.textColor ? topPlatform.textColor : 'text-gray-600'}`}>{topPlatform.name}</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">${topPlatform.income.toLocaleString()}</div>
        </div>
        <div className="mt-2 text-base text-gray-500">
          {((topPlatform.income / totalEarnings) * 100).toFixed(1)}% of total earnings
        </div>
      </AnimatedCard>
      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
      {/* Growth Section */}
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4 border border-gray-100 dark:border-gray-800 hover:scale-[1.03] hover:shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-1">
          <span>📈 Monthly Growth</span>
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400">Growth of each platform over the selected months</p>
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
          +{averageGrowth}%
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {platformsWithUnifiedEarnings.map(platform => (
            <div key={platform.name} className="bg-blue-50 dark:bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col gap-1">
              <div className="text-base text-gray-500">{platform.name}</div>
              <div className={`text-lg font-bold ${parseFloat(calculateGrowth(platform)) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{parseFloat(calculateGrowth(platform)) >= 0 ? '+' : ''}{calculateGrowth(platform)}%</div>
            </div>
          ))}
        </div>
      </AnimatedCard>
      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
      {/* Pie Chart Section */}
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-800 hover:scale-[1.03] hover:shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-1">
          <span>📊 Income Distribution</span>
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400 mb-2">See how your income is distributed across platforms.</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Income']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-base text-gray-600 dark:text-gray-300">
          {pieData.map((entry, index) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </AnimatedCard>
      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
      {/* Line Chart: Total Income Trends */}
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4 border border-gray-100 dark:border-gray-800 hover:scale-[1.03] hover:shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-1">
          <span>📈 Total Income Trend</span>
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400 mb-2">Track your total income growth over time.</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={totalIncomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </AnimatedCard>
      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
      {/* Stacked Area Chart: Platform Contributions */}
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4 border border-gray-100 dark:border-gray-800 hover:scale-[1.03] hover:shadow-2xl">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-1">
          <span>🟦 Stacked Platform Contributions</span>
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400 mb-2">See how each platform contributed to your income each month.</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {platforms.map((p, idx) => (
                <Area
                  key={p.name}
                  type="monotone"
                  dataKey={p.name}
                  stackId="1"
                  stroke={COLORS[idx % COLORS.length]}
                  fill={COLORS[idx % COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default IncomeInsights; 