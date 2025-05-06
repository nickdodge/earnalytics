import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { platformData } from '../data/mockData';
import { sanitizeInput } from '../utils/sanitize';

interface AddPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    name: string; 
    income: number; 
    notes?: string; 
    tags: string[]; 
    color?: string;
    logo?: string;
    type: 'platform' | 'manual';
    historicalEarnings: { month: string; amount: number }[];
  }) => void;
  existingPlatforms: string[];
}

const AddPlatformModal: React.FC<AddPlatformModalProps> = ({ isOpen, onClose, onSubmit, existingPlatforms }) => {
  const [incomeType, setIncomeType] = useState<'platform' | 'manual'>('platform');
  const [formData, setFormData] = useState<{
    name: string;
    income: string;
    notes: string;
    tags: string[];
    color: string;
    logo: string;
    type: 'platform' | 'manual';
  }>({
    name: '',
    income: '',
    notes: '',
    tags: [],
    color: '#000000',
    logo: '',
    type: 'platform'
  });
  const [errors, setErrors] = useState({
    name: '',
    income: '',
    notes: '',
    logo: '',
    tags: ''
  });
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [availablePlatforms, setAvailablePlatforms] = useState(platformData);

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

  const [historicalEarnings, setHistoricalEarnings] = useState<{ month: string; amount: number }[]>(
    getLastSixMonths().map(month => ({ month, amount: 0 }))
  );

  useEffect(() => {
    // Filter out already added platforms
    const filteredPlatforms = platformData.filter(
      platform => !existingPlatforms.includes(platform.name)
    );
    setAvailablePlatforms(filteredPlatforms);
  }, [existingPlatforms]);

  useEffect(() => {
    if (isOpen) {
      setHistoricalEarnings(getLastSixMonths().map(month => ({ month, amount: 0 })));
    }
  }, [isOpen]);

  const handlePlatformSelect = (platform: typeof platformData[0]) => {
    setFormData(prev => ({
      ...prev,
      name: platform.name,
      tags: platform.tags,
      color: platform.color || '#000000',
      logo: platform.logo || ''
    }));
    setShowPlatformDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      income: '',
      notes: '',
      logo: '',
      tags: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be at most 50 characters';
    }

    // Income validation
    const incomeValue = parseFloat(formData.income);
    if (isNaN(incomeValue)) {
      newErrors.income = 'Please enter a valid number';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.income)) {
      newErrors.income = 'Income must be a valid number with up to 2 decimals';
    } else if (incomeValue <= 0) {
      newErrors.income = 'Income must be greater than 0';
    } else if (incomeValue > 10000000) {
      newErrors.income = 'Income is too large';
    }

    // Notes validation
    if (formData.notes && formData.notes.length > 200) {
      newErrors.notes = 'Notes must be at most 200 characters';
    }

    // Logo validation
    if (formData.logo && formData.logo.length > 100) {
      newErrors.logo = 'Logo/URL must be at most 100 characters';
    }

    // Tags validation
    if (formData.tags.some(tag => tag.length < 2 || tag.length > 20)) {
      newErrors.tags = 'Each tag must be 2-20 characters';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      // Exclude the current month from historicalEarnings
      const filteredHistoricalEarnings = historicalEarnings.filter(entry => entry.month !== currentMonth);
      onSubmit({
        name: formData.name.trim(),
        income: parseFloat(formData.income),
        notes: sanitizeInput(formData.notes.trim()) || undefined,
        tags: formData.tags,
        color: formData.color,
        logo: formData.logo || undefined,
        type: incomeType,
        historicalEarnings: filteredHistoricalEarnings,
      });
      setFormData({ 
        name: '', 
        income: '', 
        notes: '', 
        tags: [], 
        color: '#000000',
        logo: '',
        type: 'platform'
      });
      setErrors({ name: '', income: '', notes: '', logo: '', tags: '' });
    }
  };

  const handleIncomeTypeChange = (type: 'platform' | 'manual') => {
    setIncomeType(type);
    setFormData(prev => ({ ...prev, type }));
    // Reset historical earnings when type changes
    setHistoricalEarnings(getLastSixMonths().map(month => ({ month, amount: 0 })));
  };

  const handleHistoricalChange = (idx: number, value: string) => {
    setHistoricalEarnings(prev => prev.map((entry, i) =>
      i === idx ? { ...entry, amount: parseFloat(value) || 0 } : entry
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8" data-testid="add-platform-modal">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
              Add New Income Source
            </h2>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleIncomeTypeChange('platform')}
                data-testid="platform-type-button"
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  incomeType === 'platform'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Platform
              </button>
              <button
                type="button"
                onClick={() => handleIncomeTypeChange('manual')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  incomeType === 'manual'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Manual
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {incomeType === 'platform' ? 'Platform Name' : 'Income Source Name'}
              </label>
              {incomeType === 'platform' ? (
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setShowPlatformDropdown(true)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    required
                    placeholder="Select or enter platform name"
                  />
                  {showPlatformDropdown && availablePlatforms.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                      {availablePlatforms.map((platform) => (
                        <div
                          key={platform.name}
                          onClick={() => handlePlatformSelect(platform)}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
                        >
                          {platform.logo && (
                            <span className="text-xl">{platform.logo}</span>
                          )}
                          <span className="text-gray-900 dark:text-gray-100">{platform.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  required
                  placeholder="Enter income source name"
                />
              )}
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
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.income ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              {errors.income && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.income}</p>
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
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-10 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">{formData.color}</span>
              </div>
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Logo (Emoji or URL)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter emoji or image URL"
                />
                {formData.logo && (
                  <div className="w-8 h-8 flex items-center justify-center text-xl">
                    {formData.logo.startsWith('http') ? (
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      formData.logo
                    )}
                  </div>
                )}
              </div>
              {errors.logo && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.logo}</p>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Add any additional notes about this income source"
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.notes}</p>
              )}
            </div>
            {/* Tag error display */}
            {errors.tags && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.tags}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Previous Months' Earnings
              </label>
              <div className="grid grid-cols-1 gap-2">
                {historicalEarnings.map((entry, idx) => (
                  <div key={entry.month} className="flex items-center space-x-2">
                    <span className="w-12 text-gray-600 dark:text-gray-300">{entry.month}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entry.amount}
                      onChange={e => handleHistoricalChange(idx, e.target.value)}
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
                Add Income
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddPlatformModal; 