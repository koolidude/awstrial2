import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Netflix Clone header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Netflix Clone/i);
  expect(linkElement).toBeInTheDocument();
});

test('fetches and displays movies', async () => {
  render(<App />);
  const movies = await screen.findAllByAltText(/poster/i);
  expect(movies.length).toBeGreaterThan(0);
});
