import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Pagination } from '../Pagination';
import { ListingsPage } from '../ListingsPage';
import * as api from '../../api/client';

jest.mock('../../api/client', () => ({
  fetchProperties: jest.fn(),
  getPrimaryPhotoUrl: jest.fn(() => 'https://example.com/property.jpg'),
  parsePhotos: jest.fn(() => []),
}));

const buildProperties = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    price: 250000 + index * 5000,
    address: `123 Test St ${index + 1}`,
    city: 'Austin',
    state: 'TX',
    beds: 3,
    baths: 2,
    sqft: 1200 + index,
    L_Photos: [],
  }));

const renderListingsPage = () => render(
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ListingsPage />
  </MemoryRouter>
);

describe('Pagination component', () => {
  test('disables Previous on the first page and keeps Next enabled', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
  });

  test('disables Next on the last page and keeps Previous enabled', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-current', 'page');
  });

  test('renders the correct page numbers in the middle of the range', () => {
    render(<Pagination currentPage={5} totalPages={24} onPageChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '24' })).toBeInTheDocument();
  });

  test('calls onPageChange when a page number is clicked', () => {
    const onPageChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: '5' }));

    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  test('renders ellipsis correctly for large page counts', () => {
    render(<Pagination currentPage={10} totalPages={24} onPageChange={jest.fn()} />);

    const items = screen.getAllByRole('button').map((button) => button.textContent);
    expect(items).toContain('1');
    expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1);
    expect(items.filter((value) => value === '24')).toHaveLength(1);
  });

  test('returns null when there is only one page', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  test('does not duplicate the final page value near the end of the range', () => {
    render(<Pagination currentPage={22} totalPages={24} onPageChange={jest.fn()} />);

    const buttons = screen.getAllByRole('button').map((button) => button.textContent);
    const lastPageMatches = buttons.filter((value) => value === '24');

    expect(lastPageMatches).toHaveLength(1);
    expect(buttons.join(' ')).not.toContain('... 1');
  });
});

describe('ListingsPage pagination behavior', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    api.fetchProperties.mockReset();
  });

  test('renders the summary text for the first page of results', async () => {
    api.fetchProperties.mockResolvedValue({
      total: 43,
      results: buildProperties(20),
    });

    renderListingsPage();

    expect(await screen.findByText('Showing 1-20 of 43 properties')).toBeInTheDocument();
  });

  test('resets to page 1 when filters are applied and preserves the active filters', async () => {
    api.fetchProperties.mockResolvedValue({
      total: 43,
      results: buildProperties(20),
    });

    renderListingsPage();

    const cityInput = await screen.findByPlaceholderText(/e\.g\. Austin/i);
    fireEvent.change(cityInput, { target: { name: 'city', value: 'Austin' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(api.fetchProperties).toHaveBeenLastCalledWith({
        city: 'Austin',
        limit: 20,
        offset: 0,
      });
    });
  });

  test('changes pages, scrolls to the top, and requests the correct offset', async () => {
    api.fetchProperties.mockResolvedValue({
      total: 43,
      results: buildProperties(20),
    });

    renderListingsPage();

    const nextPageButton = await screen.findByRole('button', { name: '2' });
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(api.fetchProperties).toHaveBeenLastCalledWith({
        limit: 20,
        offset: 20,
      });
    });
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('resets pagination to the first page when filters change from a later page', async () => {
    api.fetchProperties.mockResolvedValue({
      total: 43,
      results: buildProperties(20),
    });

    renderListingsPage();

    fireEvent.click(await screen.findByRole('button', { name: '2' }));
    await waitFor(() => {
      expect(api.fetchProperties).toHaveBeenLastCalledWith({
        limit: 20,
        offset: 20,
      });
    });

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Austin/i), {
      target: { name: 'city', value: 'Austin' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(api.fetchProperties).toHaveBeenLastCalledWith({
        city: 'Austin',
        limit: 20,
        offset: 0,
      });
    });
  });

  test('resets pagination and removes filters when filters are cleared', async () => {
    api.fetchProperties.mockResolvedValue({
      total: 43,
      results: buildProperties(20),
    });

    renderListingsPage();

    fireEvent.change(await screen.findByPlaceholderText(/e\.g\. Austin/i), {
      target: { name: 'city', value: 'Austin' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(api.fetchProperties).toHaveBeenLastCalledWith({
        city: 'Austin',
        limit: 20,
        offset: 0,
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }));

    await waitFor(() => {
      expect(api.fetchProperties).toHaveBeenLastCalledWith({
        limit: 20,
        offset: 0,
      });
    });
  });
});
