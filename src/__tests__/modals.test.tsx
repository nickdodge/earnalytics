import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPlatformModal from '../components/AddPlatformModal';
import EditPlatformModal from '../components/EditPlatformModal';
import EditManualIncomeModal from '../components/EditManualIncomeModal';
import PlatformConnectionModal from '../components/PlatformConnectionModal';
import { PlatformData } from '../data/mockData';
import { CustomIncomeEntry } from '../types/CustomIncome';

// Mock the Modal component
jest.mock('../components/Modal', () => {
  return function MockModal({ children, isOpen, onClose }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-modal">
        {children}
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  };
});

describe('Modal Components', () => {
  const mockPlatform: PlatformData = {
    name: 'YouTube',
    income: 1000,
    textColor: 'text-red-600',
    color: '#FF0000',
    tags: ['video', 'content'],
    historicalEarnings: [
      { month: 'Jan', amount: 800 },
      { month: 'Feb', amount: 900 },
      { month: 'Mar', amount: 1000 }
    ]
  };

  const mockCustomIncome: CustomIncomeEntry = {
    id: '1',
    name: 'Freelance',
    income: 500,
    notes: 'Test notes',
    tags: ['freelance', 'work'],
    color: '#000000',
    logo: '💼',
    historicalEarnings: [
      { month: 'Jan', amount: 400 },
      { month: 'Feb', amount: 450 },
      { month: 'Mar', amount: 500 }
    ]
  };

  describe('AddPlatformModal', () => {
    it('renders correctly when open', () => {
      const onSubmit = jest.fn();
      const onClose = jest.fn();
      
      render(
        <AddPlatformModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
          existingPlatforms={[]}
        />
      );

      expect(screen.getByText('Add New Income Source')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
      expect(screen.getByText('Manual')).toBeInTheDocument();
    });

    it('submits form data correctly', async () => {
      const onSubmit = jest.fn();
      const onClose = jest.fn();
      
      render(
        <AddPlatformModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
          existingPlatforms={[]}
        />
      );

      // Fill in the form
      const nameInput = screen.getByPlaceholderText('Select or enter platform name');
      const incomeInput = screen.getByRole('spinbutton', { name: /income/i });

      fireEvent.change(nameInput, {
        target: { value: 'Test Income' }
      });
      fireEvent.change(incomeInput, {
        target: { value: '1000' }
      });

      // Submit the form
      fireEvent.click(screen.getByText('Add Income'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('EditPlatformModal', () => {
    it('renders correctly with platform data', () => {
      const onSubmit = jest.fn();
      const onClose = jest.fn();
      
      render(
        <EditPlatformModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
          platform={mockPlatform}
        />
      );

      expect(screen.getByText('Edit Platform')).toBeInTheDocument();
      expect(screen.getByDisplayValue('YouTube')).toBeInTheDocument();
      // Use getByRole for the income input
      expect(screen.getByRole('spinbutton', { name: /income/i })).toHaveValue(1000);
    });

    it('updates platform data correctly', async () => {
      const onSubmit = jest.fn();
      const onClose = jest.fn();
      
      render(
        <EditPlatformModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
          platform={mockPlatform}
        />
      );

      // Update the income using getByRole
      const incomeInput = screen.getByRole('spinbutton', { name: /income/i });
      fireEvent.change(incomeInput, {
        target: { value: '1500' }
      });

      // Submit the form
      fireEvent.click(screen.getByText('Save Changes'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('EditManualIncomeModal', () => {
    it('renders correctly with manual income data', async () => {
      const onSubmit = jest.fn();
      const onClose = jest.fn();
      
      render(
        <EditManualIncomeModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
          income={mockCustomIncome}
        />
      );

      // Wait for the form data to be initialized
      await waitFor(() => {
        expect(screen.getByText('Edit Income Source')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Freelance')).toBeInTheDocument();
        // Use getByRole for the income input
        expect(screen.getByRole('spinbutton', { name: /income/i })).toHaveValue(500);
      });
    });

    it('updates manual income data correctly', async () => {
      const onSubmit = jest.fn();
      const onClose = jest.fn();
      
      render(
        <EditManualIncomeModal
          isOpen={true}
          onClose={onClose}
          onSubmit={onSubmit}
          income={mockCustomIncome}
        />
      );

      // Wait for the form to be initialized
      await waitFor(() => {
        const incomeInput = screen.getByRole('spinbutton', { name: /income/i });
        fireEvent.change(incomeInput, {
          target: { value: '600' }
        });
      });

      // Submit the form
      fireEvent.click(screen.getByText('Save Changes'));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('PlatformConnectionModal', () => {
    it('renders correctly with platform options', () => {
      const onConnect = jest.fn();
      const onClose = jest.fn();
      
      render(
        <PlatformConnectionModal
          isOpen={true}
          onClose={onClose}
          onConnect={onConnect}
        />
      );

      expect(screen.getByText('Connect Platform')).toBeInTheDocument();
      expect(screen.getByText('YouTube')).toBeInTheDocument();
      expect(screen.getByText('Twitch')).toBeInTheDocument();
      expect(screen.getByText('TikTok')).toBeInTheDocument();
    });

    it('handles platform connection correctly', () => {
      const onConnect = jest.fn();
      const onClose = jest.fn();
      
      render(
        <PlatformConnectionModal
          isOpen={true}
          onClose={onClose}
          onConnect={onConnect}
        />
      );

      // Click on YouTube platform
      fireEvent.click(screen.getByText('YouTube'));

      expect(onConnect).toHaveBeenCalledWith('youtube');
    });
  });
}); 