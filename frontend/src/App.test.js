import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Netflix Clone header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Netflix Clone/i);
  expect(headerElement).toBeInTheDocument();
});
