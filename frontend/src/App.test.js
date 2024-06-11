import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock the fetch function to return sample data for the movies endpoint
beforeEach(() => {
  process.env.REACT_APP_BACKEND_URL = 'https://mock-backend-url.com:5000';

  global.fetch = jest.fn((url) => {
    if (url === `${process.env.REACT_APP_BACKEND_URL}/movies`) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 1, title: 'Movie Title', poster_path: '/path/to/poster.jpg' }] }),
      });
    } else {
      return Promise.reject(new Error('Unknown URL'));
    }
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders Netflix Clone header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Netflix Clone/i);
  expect(headerElement).toBeInTheDocument();
});

test('fetches and displays movies', async () => {
  render(<App />);
  const movieElement = await waitFor(() => screen.getByText(/Movie Title/i));
  expect(movieElement).toBeInTheDocument();
});
