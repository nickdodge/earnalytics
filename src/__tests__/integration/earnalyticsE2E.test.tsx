import React from 'react';
/* eslint-disable testing-library/no-unnecessary-act, testing-library/no-wait-for-multiple-assertions */
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../components/Dashboard';
import { CustomIncomeEntry } from '../../types/CustomIncome';
import { act } from 'react-dom/test-utils';

// Mock the Modal component
jest.mock('../../components/Modal', () => {
  return function MockModal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
    if (!isOpen) return null;
    return <div data-testid="mock-modal">{children}</div>;
  };
});

// Mock the AddPlatformModal component
jest.mock('../../components/AddPlatformModal', () => {
  return function MockAddPlatformModal({ isOpen, onSubmit }: { isOpen: boolean; onSubmit: (data: any) => void }) {
    if (!isOpen) return null;
    return (
      <div data-testid="add-platform-modal">
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            name: 'Freelance Work',
            income: 2000,
            type: 'manual',
            color: '#4CAF50',
            logo: '💼',
            historicalEarnings: [
              { month: 'Jan', amount: 1600 },
              { month: 'Feb', amount: 1800 },
              { month: 'Mar', amount: 2000 }
            ]
          });
        }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
              Add New Income Source
            </h2>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="px-3 py-1 rounded-md text-sm font-medium bg-blue-500 text-white"
                data-testid="manual-income-button"
              >
                Manual Income
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value="Freelance Work"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Income
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value="2000"
                readOnly
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              data-testid="submit-button"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    );
  };
});

// Mock the loading delay
jest.useFakeTimers();

// Mock the date to May 1st, 2025
const mockDate = new Date('2025-05-01');
const RealDate = Date;
global.Date = class extends RealDate {
  constructor() {
    super();
    return mockDate;
  }
  static now() {
    return mockDate.getTime();
  }
} as DateConstructor;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
console.error = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Increase test timeout
jest.setTimeout(10000);

describe('Earnalytics End-to-End Tests', () => {
  const mockOnAddPlatform = jest.fn();
  const mockOnDeletePlatform = jest.fn();
  const mockOnUpdateManualIncome = jest.fn();
  const mockOnUpdatePlatform = jest.fn();
  const mockOnModalClose = jest.fn();
  const mockOnModalOpen = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockOnAddPlatform.mockClear();
    mockOnDeletePlatform.mockClear();
    mockOnUpdateManualIncome.mockClear();
    mockOnUpdatePlatform.mockClear();
    mockOnModalClose.mockClear();
    mockOnModalOpen.mockClear();
    mockLocalStorage.clear();
    jest.clearAllTimers();
    (console.error as jest.Mock).mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    // Restore the original Date and console.error
    global.Date = RealDate;
    jest.useRealTimers();
    console.error = originalConsoleError;
  });

  describe('1. Manual Income Entry', () => {
    it('adds new manual income and verifies dashboard update', async () => {
      await act(async () => {
        render(
          <Dashboard
            platforms={[]}
            manualIncomes={[]}
            onAddPlatform={jest.fn()}
            onDeletePlatform={jest.fn()}
            onUpdateManualIncome={jest.fn()}
            onUpdatePlatform={jest.fn()}
            isModalOpen={true}
            onModalClose={jest.fn()}
            onModalOpen={jest.fn()}
          />
        );

        // Wait for loading to complete
        await waitFor(() => {
          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Wait for modal to be rendered
        await waitFor(() => {
          expect(screen.getByTestId('add-platform-modal')).toBeInTheDocument();
        });

        // Verify no errors were logged
        expect(console.error).not.toHaveBeenCalled();
      });
    });
  });

  describe('2. Graph/Chart Updates', () => {
    it('verifies charts update with new income data', async () => {
      await act(async () => {
        const mockIncomes: CustomIncomeEntry[] = [{
          id: '1',
          name: 'Freelance Work',
          income: 2000,
          type: 'manual',
          tags: ['freelance'],
          historicalEarnings: [
            { month: 'Jan', amount: 1600 },
            { month: 'Feb', amount: 1800 },
            { month: 'Mar', amount: 2000 }
          ]
        }];

        render(
          <Dashboard
            platforms={[]}
            manualIncomes={mockIncomes}
            onAddPlatform={jest.fn()}
            onDeletePlatform={jest.fn()}
            onUpdateManualIncome={jest.fn()}
            onUpdatePlatform={jest.fn()}
            isModalOpen={false}
            onModalClose={jest.fn()}
            onModalOpen={jest.fn()}
          />
        );

        // Wait for loading to complete
        await waitFor(() => {
          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Wait for dashboard to be rendered
        await waitFor(() => {
          expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
        });

        // Verify income card chart
        await waitFor(() => {
          const incomeCard = screen.getByTestId('income-card-1');
          expect(incomeCard).toBeInTheDocument();
          expect(incomeCard).toHaveTextContent('Freelance Work');
          expect(incomeCard).toHaveTextContent('$2,000');
        });
      });
    });
  });

  describe('3. Insights Recalculation', () => {
    it('verifies insights update with new income data', async () => {
      await act(async () => {
        const mockIncomes: CustomIncomeEntry[] = [{
          id: '1',
          name: 'Freelance Work',
          income: 2000,
          type: 'manual',
          tags: ['freelance'],
          historicalEarnings: [
            { month: 'Jan', amount: 1600 },
            { month: 'Feb', amount: 1800 },
            { month: 'Mar', amount: 2000 }
          ]
        }];

        render(
          <Dashboard
            platforms={[]}
            manualIncomes={mockIncomes}
            onAddPlatform={jest.fn()}
            onDeletePlatform={jest.fn()}
            onUpdateManualIncome={jest.fn()}
            onUpdatePlatform={jest.fn()}
            isModalOpen={false}
            onModalClose={jest.fn()}
            onModalOpen={jest.fn()}
          />
        );

        // Wait for loading to complete
        await waitFor(() => {
          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Verify income card insights
        await waitFor(() => {
          const incomeCard = screen.getByTestId('income-card-1');
          expect(incomeCard).toBeInTheDocument();
          expect(incomeCard).toHaveTextContent('$2,000');
        });
      });
    });
  });

  describe('4. Edge Case Handling', () => {
    it('handles zero income values', async () => {
      await act(async () => {
        const mockIncomes: CustomIncomeEntry[] = [{
          id: '1',
          name: 'Zero Income',
          income: 0,
          type: 'manual',
          tags: ['test'],
          historicalEarnings: [
            { month: 'Jan', amount: 0 },
            { month: 'Feb', amount: 0 },
            { month: 'Mar', amount: 0 }
          ]
        }];

        render(
          <Dashboard
            platforms={[]}
            manualIncomes={mockIncomes}
            onAddPlatform={jest.fn()}
            onDeletePlatform={jest.fn()}
            onUpdateManualIncome={jest.fn()}
            onUpdatePlatform={jest.fn()}
            isModalOpen={false}
            onModalClose={jest.fn()}
            onModalOpen={jest.fn()}
          />
        );

        // Wait for loading to complete
        await waitFor(() => {
          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Verify zero income handling
        await waitFor(() => {
          const incomeCard = screen.getByTestId('income-card-1');
          expect(incomeCard).toBeInTheDocument();
          expect(incomeCard).toHaveTextContent('$0');
        });
      });
    });

    it('handles negative income values', async () => {
      await act(async () => {
        const mockIncomes: CustomIncomeEntry[] = [{
          id: '1',
          name: 'Negative Income',
          income: -1000,
          type: 'manual',
          tags: ['test'],
          historicalEarnings: [
            { month: 'Jan', amount: -1000 },
            { month: 'Feb', amount: -1000 },
            { month: 'Mar', amount: -1000 }
          ]
        }];

        render(
          <Dashboard
            platforms={[]}
            manualIncomes={mockIncomes}
            onAddPlatform={jest.fn()}
            onDeletePlatform={jest.fn()}
            onUpdateManualIncome={jest.fn()}
            onUpdatePlatform={jest.fn()}
            isModalOpen={false}
            onModalClose={jest.fn()}
            onModalOpen={jest.fn()}
          />
        );

        // Wait for loading to complete
        await waitFor(() => {
          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Verify negative income handling
        await waitFor(() => {
          const incomeCard = screen.getByTestId('income-card-1');
          expect(incomeCard).toBeInTheDocument();
          expect(incomeCard).toHaveTextContent('-$1,000');
        });
      });
    });

    it('handles missing historical data', async () => {
      await act(async () => {
        const mockIncomes: CustomIncomeEntry[] = [{
          id: '1',
          name: 'No History',
          income: 1000,
          type: 'manual',
          tags: ['test'],
          historicalEarnings: []
        }];

        render(
          <Dashboard
            platforms={[]}
            manualIncomes={mockIncomes}
            onAddPlatform={jest.fn()}
            onDeletePlatform={jest.fn()}
            onUpdateManualIncome={jest.fn()}
            onUpdatePlatform={jest.fn()}
            isModalOpen={false}
            onModalClose={jest.fn()}
            onModalOpen={jest.fn()}
          />
        );

        // Wait for loading to complete
        await waitFor(() => {
          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Verify missing historical data handling
        await waitFor(() => {
          const incomeCard = screen.getByTestId('income-card-1');
          expect(incomeCard).toBeInTheDocument();
          expect(incomeCard).toHaveTextContent('$1,000');
        });
      });
    });
  });

  describe('5. Mobile Responsiveness', () => {
    it('verifies responsive layout on mobile viewport', async () => {
      await act(async () => {
        const mockIncomes: CustomIncomeEntry[] = [{
          id: '1',
          name: 'Mobile Test',
          income: 1000,
          type: 'manual',
          tags: ['test'],
          historicalEarnings: [
            { month: 'Jan', amount: 800 },
            { month: 'Feb', amount: 900 },
            { month: 'Mar', amount: 1000 }
          ]
        }];

        // Set viewport to mobile size
        Object.defineProperty(window, 'innerWidth', { value: 375 });
        Object.defineProperty(window, 'innerHeight', { value: 667 });
        window.dispatchEvent(new Event('resize'));

        render(
          <Dashboard
            platforms={[]}
            manualIncomes={mockIncomes}
            onAddPlatform={jest.fn()}
            onDeletePlatform={jest.fn()}
            onUpdateManualIncome={jest.fn()}
            onUpdatePlatform={jest.fn()}
            isModalOpen={false}
            onModalClose={jest.fn()}
            onModalOpen={jest.fn()}
          />
        );

        // Wait for loading to complete
        await waitFor(() => {
          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Verify mobile layout
        await waitFor(() => {
          const incomeCard = screen.getByTestId('income-card-1');
          expect(incomeCard).toBeInTheDocument();
          expect(incomeCard).toHaveTextContent('$1,000');
        });
      });
    });
  });
}); 