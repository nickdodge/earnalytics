import React, { useState, useMemo, useEffect } from 'react';
import IncomeInsights from './IncomeInsights';
import { PlatformData } from '../data/mockData';
import { CustomIncomeEntry } from '../types/CustomIncome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface InsightsProps {
  platforms: (PlatformData | CustomIncomeEntry)[];
}

const Insights: React.FC<InsightsProps> = ({ platforms }) => {
  // Get all unique months from all platforms
  const allMonths = useMemo(() => {
    const monthSet = new Set<string>();
    platforms.forEach(platform => {
      (platform.historicalEarnings ?? []).forEach(earning => {
        monthSet.add(earning.month);
      });
    });
    // Always include the current month
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'short' });
    monthSet.add(currentMonth);
    return Array.from(monthSet).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a) - months.indexOf(b);
    });
  }, [platforms]);

  // Calendar state (month granularity)
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 5, 1);
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Convert months to Date objects for filtering
  const monthsToDates = allMonths.map(m => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const idx = months.indexOf(m);
    const now = new Date();
    let year = now.getFullYear();
    if (idx > now.getMonth()) year--;
    return new Date(year, idx, 1);
  });

  // Filtered months between startDate and endDate
  const filteredMonths = allMonths.filter((m, i) => {
    const d = monthsToDates[i];
    return d >= startDate && d <= endDate;
  });

  // Platform selector (reflects dashboard cards)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Ensure all platforms are selected on mount and when platforms change
  useEffect(() => {
    setSelectedPlatforms(platforms.map(p => p.name));
  }, [platforms]);

  const handlePlatformChange = (name: string) => {
    setSelectedPlatforms(prev => {
      // If trying to deselect the last platform, prevent it
      if (prev.length === 1 && prev.includes(name)) {
        return prev;
      }
      return prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
    });
  };

  const allSelected = selectedPlatforms.length === platforms.length;
  const handleSelectAll = () => {
    // Always select all platforms
    setSelectedPlatforms(platforms.map(p => p.name));
  };

  const filteredPlatforms = platforms.filter(p => selectedPlatforms.includes(p.name));

  // Summary
  const totalEarnings = filteredPlatforms.reduce((sum, platform) => sum + platform.income, 0);
  const averageGrowth =
    filteredPlatforms.length > 0
      ? filteredPlatforms.reduce((sum, platform) => {
          const firstMonth = platform.historicalEarnings?.[0]?.amount || 0;
          const lastMonth = platform.historicalEarnings?.[platform.historicalEarnings.length - 1]?.amount || 0;
          return sum + ((lastMonth - firstMonth) / (firstMonth || 1)) * 100;
        }, 0) / filteredPlatforms.length
      : 0;

  return (
    <div className="space-y-10 text-sm max-w-5xl mx-auto px-2 sm:px-4 md:px-8">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-white/90 dark:from-gray-900/90 to-transparent py-3 mb-2 rounded-full shadow flex flex-wrap gap-4 items-center justify-between px-4 border border-gray-100 dark:border-gray-800">
        {/* Calendar Date Range Picker (month granularity) */}
        <div className="flex flex-col gap-1 min-w-[220px]">
          <label className="font-semibold flex items-center gap-1"><span className="text-blue-500">🗓️</span> Date Range:</label>
          <div className="flex items-center gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => { if (date) setStartDate(date); }}
              dateFormat="MMM yyyy"
              showMonthYearPicker
              maxDate={endDate}
              className="px-2 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <span>-</span>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => { if (date) setEndDate(date); }}
              dateFormat="MMM yyyy"
              showMonthYearPicker
              minDate={startDate}
              className="px-2 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        {/* Platform Multi-Select (with Select All) */}
        <div>
          <label className="font-semibold flex items-center gap-1"><span className="text-green-500">🪙</span> Platforms:</label>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="flex items-center gap-1 cursor-pointer font-semibold bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="accent-blue-500"
              />
              <span>Select All</span>
            </label>
            {platforms.map(p => (
              <label key={p.name} className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded-full ${selectedPlatforms.includes(p.name) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(p.name)}
                  onChange={() => handlePlatformChange(p.name)}
                  className="accent-blue-500"
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {/* Summary Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between px-4">
        <span>📊 <strong>{filteredPlatforms.length}</strong> platforms tracked</span>
        <span>💰 Total Income: <strong className="text-lg text-blue-600 dark:text-blue-400">${totalEarnings.toLocaleString()}</strong></span>
        <span>🚀 Avg Growth: <strong className="text-lg text-green-600 dark:text-green-400">+{averageGrowth.toFixed(1)}%</strong></span>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Income Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 text-base">Visualize your earnings, growth, and platform performance. Use the filters above to focus your analysis.</p>
      </div>
      {/* Empty State */}
      {filteredPlatforms.length === 0 || filteredMonths.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <img src="/empty-state-illustration.svg" alt="No data" className="w-40 h-40 mb-4 opacity-80" />
          <div className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No data to display</div>
          <div className="text-gray-400 dark:text-gray-500">Try adjusting your filters or add more income sources.</div>
        </div>
      ) : (
        <IncomeInsights platforms={filteredPlatforms as (PlatformData | CustomIncomeEntry)[]} months={filteredMonths} />
      )}
    </div>
  );
};

export default Insights; 