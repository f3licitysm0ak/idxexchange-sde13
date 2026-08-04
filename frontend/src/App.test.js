// src/App.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ results: [], total: 0 }),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders Property Directory app heading', async () => {
  render(<App />);

  // Check static header text immediately
  const headingElement = screen.getByText(/Property Directory/i);
  expect(headingElement).toBeInTheDocument();

  // FIX: Wait for async state updates in ListingsPage to settle
  await waitFor(() => {
    expect(screen.queryByText(/loading properties\.\.\./i)).not.toBeInTheDocument();
  });
});