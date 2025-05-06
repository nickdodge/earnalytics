import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AddPlatformModal from '../../components/AddPlatformModal';
import Dashboard from '../../components/Dashboard';
import { CustomIncomeEntry } from '../../types/CustomIncome';
import { PlatformData } from '../../data/mockData';

// Mock the Modal component
jest.mock('../../components/Modal', () => {
  return function MockModal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
    if (!isOpen) return null;
    return <div data-testid="mock-modal">{children}</div>;
  };
});

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
global.localStorage = mockLocalStorage as unknown as Storage;

describe('Income Flow Integration', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockOnSubmit.mockClear();
    mockOnClose.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    // Restore the original Date
    global.Date = RealDate;
  });

  it('adds manual Twitch income and updates dashboard', async () => {
    // 1. First test the AddPlatformModal
    const { unmount: unmountModal } = render(
      <AddPlatformModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        existingPlatforms={[]}
      />
    );

    // 2. Switch to manual income type
    fireEvent.click(screen.getByText('Manual'));

    // 3. Fill in the form
    const nameInput = screen.getByPlaceholderText('Enter income source name');
    const incomeInput = screen.getByRole('spinbutton', { name: /income/i });
    const colorInput = screen.getByLabelText(/color/i);
    const logoInput = screen.getByPlaceholderText('Enter emoji or image URL');

    // Fill in the form fields
    await act(async () => {
      fireEvent.change(nameInput, {
        target: { value: 'Twitch Manual' }
      });

      fireEvent.change(incomeInput, {
        target: { value: '150' }
      });

      fireEvent.change(colorInput, {
        target: { value: '#9146FF' } // Twitch purple color
      });

      fireEvent.change(logoInput, {
        target: { value: '🎮' }
      });
    });

    // 4. Submit the form
    await act(async () => {
      fireEvent.click(screen.getByText('Add Income'));
    });

    // 5. Wait for form submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // 6. Verify the submitted data
    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData).toEqual(expect.objectContaining({
      name: 'Twitch Manual',
      income: 150,
      type: 'manual',
      color: '#9146FF',
      logo: '🎮',
      historicalEarnings: expect.arrayContaining([
        expect.objectContaining({
          month: 'May',
          amount: 150
        })
      ])
    }));

    // Clean up the modal
    unmountModal();

    // 7. Now test the Dashboard with the new income
    const mockIncomes: CustomIncomeEntry[] = [{
      id: '1',
      name: 'Twitch Manual',
      income: 150,
      notes: '',
      tags: ['streaming', 'manual'],
      color: '#9146FF',
      logo: '🎮',
      historicalEarnings: [
        { month: 'May', amount: 150 }
      ]
    }];

    render(
      <Dashboard
        platforms={[]}
        manualIncomes={mockIncomes}
        onAddPlatform={() => {}}
        onDeletePlatform={() => {}}
        onUpdateManualIncome={() => {}}
        onUpdatePlatform={() => {}}
        isModalOpen={false}
        onModalClose={() => {}}
        onModalOpen={() => {}}
      />
    );

    // 8. Verify the dashboard shows the new income
    await waitFor(() => {
      // Check for the income card
      expect(screen.getByText('Twitch Manual')).toBeInTheDocument();
      expect(screen.getByText('$150')).toBeInTheDocument();
      
      // Check for the correct color and logo
      const incomeCard = screen.getByText('Twitch Manual').closest('.bg-white');
      expect(incomeCard).toHaveStyle({ borderLeftColor: '#9146FF' });
      expect(screen.getByText('🎮')).toBeInTheDocument();
    });
  });
}); 