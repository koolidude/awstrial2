import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the fetch function to return sample data for the movies endpoint
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ results: [{ id: 1, title: 'Movie Title', poster_path: '/path/to/poster.jpg' }] }),
    })
  );
});

test('renders Netflix Clone header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Netflix Clone/i);
  expect(headerElement).toBeInTheDocument();
});

test('fetches and displays movies', async () => {
  render(<App />);
  const movieElement = await screen.findByText(/Movie Title/i);
  expect(movieElement).toBeInTheDocument();
});
