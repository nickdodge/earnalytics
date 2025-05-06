import React, { useState, useEffect } from 'react';
import { PlatformData } from '../data/mockData';
import Modal from './Modal';

interface EditPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlatformData) => void;
  platform: PlatformData | null;
}

const EditPlatformModal: React.FC<EditPlatformModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  platform
}) => {
  const getLastSixMonths = () => {
    const months = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    for (let i = 5; i >= 1; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const month = d.toLocaleString('default', { month: 'short' });
      // Only add months that are not in the future
      if (d.getMonth() <= currentMonth || d.getFullYear() < currentYear) {
        months.push(month);
      }
    }
    return months;
  };

  const [formData, setFormData] = useState<PlatformData>({
    id: '',
    name: '',
    income: 0,
    textColor: 'text-gray-600',
    color: '#000000',
    tags: [],
    historicalEarnings: getLastSixMonths().map(month => ({ month, amount: 0 }))
  });
  const [errors, setErrors] = useState({
    name: '',
    income: '',
    tags: ''
  });

  useEffect(() => {
    if (isOpen && platform) {
      const lastSixMonths = getLastSixMonths();
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const existingEarnings = platform.historicalEarnings || [];
      
      // Get current month's earnings
      const currentMonthEarnings = existingEarnings.find(e => e.month === currentMonth);
      const currentIncome = currentMonthEarnings ? currentMonthEarnings.amount : platform.income;
      
      // Get historical earnings (excluding current month)
      const historicalEarnings = lastSixMonths.map(month => {
        const existing = existingEarnings.find(e => e.month === month);
        return existing || { month, amount: platform.income };
      });

      setFormData({
        ...platform,
        income: currentIncome,
        historicalEarnings
      });
    }
  }, [isOpen, platform]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      income: '',
      tags: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.income || formData.income <= 0) {
      newErrors.income = 'Income must be greater than 0';
    }
    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      onSubmit({
        ...formData,
        historicalEarnings: [
          ...formData.historicalEarnings,
          { month: currentMonth, amount: formData.income }
        ]
      });
      onClose();
    }
  };

  const handleHistoricalEarningsChange = (index: number, value: string) => {
    const newHistoricalEarnings = [...formData.historicalEarnings];
    newHistoricalEarnings[index] = {
      ...newHistoricalEarnings[index],
      amount: value === '' ? 0 : parseFloat(value)
    };
    setFormData({ ...formData, historicalEarnings: newHistoricalEarnings });
  };

  if (!platform) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Edit Platform
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Income Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  id="income"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: parseFloat(e.target.value) })}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.income ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
              {errors.income && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.income}</p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tags ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                required
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.tags}</p>
              )}
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="color"
                  value={formData.color || '#000000'}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-10 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">{formData.color || '#000000'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Historical Earnings
              </label>
              <div className="space-y-2">
                {formData.historicalEarnings.map((earning, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-16 text-sm text-gray-500 dark:text-gray-400">
                      {earning.month}:
                    </span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                      <input
                        type="text"
                        value={earning.amount === 0 ? '' : earning.amount.toString()}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow empty string or valid number
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            handleHistoricalEarningsChange(index, value);
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          // If empty or invalid, set to 0
                          if (value === '' || isNaN(parseFloat(value))) {
                            handleHistoricalEarningsChange(index, '0');
                          }
                        }}
                        className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        inputMode="decimal"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditPlatformModal; 