// src/components/tests/PropertyFilters.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyFilters } from '../PropertyFilters';

describe('PropertyFilters Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and select filter controls', () => {
    render(<PropertyFilters onSearch={mockOnSearch} onClear={mockOnClear} />);

    expect(screen.getByPlaceholderText(/e\.g\. Austin/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min \$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max \$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/beds/i)).toBeInTheDocument();
  });

  test('submits form with non-empty active filters', () => {
    render(<PropertyFilters onSearch={mockOnSearch} onClear={mockOnClear} />);

    const cityInput = screen.getByPlaceholderText(/e\.g\. Austin/i);
    fireEvent.change(cityInput, { target: { name: 'city', value: 'Austin' } });

    const submitButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(submitButton);

    expect(mockOnSearch).toHaveBeenCalledWith({ city: 'Austin' });
  });

  test('calls onClear and resets form when reset button is clicked', () => {
    render(<PropertyFilters onSearch={mockOnSearch} onClear={mockOnClear} />);

    const cityInput = screen.getByPlaceholderText(/e\.g\. Austin/i);
    fireEvent.change(cityInput, { target: { name: 'city', value: 'Austin' } });

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
    expect(cityInput.value).toBe('');
  });
});