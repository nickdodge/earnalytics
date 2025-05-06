import React, { useState, useEffect } from 'react';
import { CustomIncomeEntry } from '../types/CustomIncome';
import Modal from './Modal';

interface EditManualIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomIncomeEntry) => void;
  income: CustomIncomeEntry | null;
}

const EditManualIncomeModal: React.FC<EditManualIncomeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  income
}) => {
  const [formData, setFormData] = useState<CustomIncomeEntry>({
    id: '',
    name: '',
    income: 0,
    notes: '',
    tags: [],
    color: '#000000',
    logo: '',
    type: 'manual',
    historicalEarnings: []
  });
  const [errors, setErrors] = useState({
    name: '',
    income: '',
    notes: '',
    tags: ''
  });

  // Utility to get last 6 months ending at current month (excluding current month)
  function getLastSixMonths() {
    const months = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    for (let i = 5; i >= 1; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const month = d.toLocaleString('default', { month: 'short' });
      months.push(month);
    }
    return months;
  }

  useEffect(() => {
    if (isOpen && income) {
      const lastSixMonths = getLastSixMonths();
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const existingEarnings = income.historicalEarnings || [];
      // Get current month's earnings
      const currentMonthEarnings = existingEarnings.find(e => e.month === currentMonth);
      const currentIncome = currentMonthEarnings ? currentMonthEarnings.amount : income.income;
      // Get historical earnings (excluding current month)
      const historicalEarnings = lastSixMonths.map(month => {
        const existing = existingEarnings.find(e => e.month === month);
        return existing || { month, amount: income.income };
      });
      setFormData({ ...income, income: currentIncome, historicalEarnings });
    }
  }, [isOpen, income]);

  const handleHistoricalEarningsChange = (index: number, value: string) => {
    const newHistoricalEarnings = [...formData.historicalEarnings];
    newHistoricalEarnings[index] = {
      ...newHistoricalEarnings[index],
      amount: value === '' ? 0 : parseFloat(value)
    };
    setFormData({ ...formData, historicalEarnings: newHistoricalEarnings });
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      income: '',
      notes: '',
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
      // Exclude the current month from historicalEarnings
      const filteredHistoricalEarnings = formData.historicalEarnings.filter(entry => entry.month !== currentMonth);
      onSubmit({
        ...formData,
        historicalEarnings: filteredHistoricalEarnings
      });
      onClose();
    }
  };

  if (!income) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Edit Income Source
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Income Source Name
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
                Current Month's Income ({new Date().toLocaleString('default', { month: 'short' })})
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
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
              />
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
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Logo (URL or emoji)
              </label>
              <input
                type="text"
                id="logo"
                value={formData.logo || ''}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter URL or emoji"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Previous Months' Earnings
              </label>
              <div className="grid grid-cols-1 gap-2">
                {formData.historicalEarnings.map((entry, idx) => (
                  <div key={entry.month} className="flex items-center space-x-2">
                    <span className="w-12 text-gray-600 dark:text-gray-300">{entry.month}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entry.amount}
                      onChange={e => handleHistoricalEarningsChange(idx, e.target.value)}
                      className="w-32 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
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

export default EditManualIncomeModal; 