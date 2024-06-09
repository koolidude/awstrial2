import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// Mocking fetch to prevent actual API calls during tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ results: [{ id: 1, title: 'Test Movie', poster_path: '/test.jpg' }] }),
  })
);

describe('App Component', () => {
  test('renders Netflix Clone title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Netflix Clone/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<App />);
    const inputElement = screen.getByLabelText(/Search Movies/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('renders search button', () => {
    render(<App />);
    const buttonElement = screen.getByText(/Search/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('fetches and displays movies on load', async () => {
    render(<App />);
    const movieTitle = await screen.findByText('Test Movie');
    expect(movieTitle).toBeInTheDocument();
  });

  test('fetches and displays search results', async () => {
    render(<App />);
    const inputElement = screen.getByLabelText(/Search Movies/i);
    const buttonElement = screen.getByText(/Search/i);

    fireEvent.change(inputElement, { target: { value: 'Test' } });
    fireEvent.click(buttonElement);

    const movieTitle = await screen.findByText('Test Movie');
    expect(movieTitle).toBeInTheDocument();
  });
});
