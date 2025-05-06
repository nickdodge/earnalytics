import React from 'react';

interface InsightsProps {
  platforms: any[];
}

const Insights: React.FC<InsightsProps> = ({ platforms }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
      {/* You can use the platforms prop here */}
      <pre>{JSON.stringify(platforms, null, 2)}</pre>
    </div>
  );
};

export default Insights; 