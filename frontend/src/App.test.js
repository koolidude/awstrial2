import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import App from './App';

// Mock the fetch function to return sample data for the movies endpoint
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url === `/movies`) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 1, title: 'Movie Title', poster_path: '/path/to/poster.jpg' }] }),
      });
    } else if (url.startsWith(`/movies/search/`)) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 2, title: 'Searched Movie', poster_path: '/path/to/searched_movie.jpg' }] }),
      });
    } else if (url.startsWith(`/youtube/search/`)) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: [{ id: { videoId: 'abc123' }, snippet: { title: 'Test Video' } }] }),
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

test('fetches and displays searched movies', async () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search movies/i);

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: 'Inception' } });
    fireEvent.click(screen.getByText(/Search/i));
  });

  const searchedMovieElement = await waitFor(() => screen.getByText(/Searched Movie: Searched Movie/i));
  expect(searchedMovieElement).toBeInTheDocument();
});

test('fetches and displays YouTube search results', async () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search movies/i);

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: 'Inception' } });
    fireEvent.click(screen.getByText(/Search/i));
  });

  const searchedMovieElement = await waitFor(() => screen.getByText(/Searched Movie: Searched Movie/i));

  await act(async () => {
    fireEvent.click(searchedMovieElement);
  });

  const youtubeVideoElement = await waitFor(() => screen.getByText(/Test Video/i));
  expect(youtubeVideoElement).toBeInTheDocument();
});
