// src/App.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { searchMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchGenreMovies } from './api';

// Mock the API functions
jest.mock('./api');

const mockMovies = [
  { id: 1, title: 'Movie 1', poster_path: '/path1.jpg', vote_average: 8.0 },
  { id: 2, title: 'Movie 2', poster_path: '/path2.jpg', vote_average: 7.5 }
];

const mockTopRatedMovies = [
  { id: 3, title: 'Top Rated Movie 1', poster_path: '/path3.jpg', vote_average: 9.0 },
  { id: 4, title: 'Top Rated Movie 2', poster_path: '/path4.jpg', vote_average: 8.5 }
];

const mockUpcomingMovies = [
  { id: 5, title: 'Upcoming Movie 1', poster_path: '/path5.jpg', vote_average: 7.0 },
  { id: 6, title: 'Upcoming Movie 2', poster_path: '/path6.jpg', vote_average: 6.5 }
];

const mockGenreMovies = [
  { id: 7, title: 'Genre Movie 1', poster_path: '/path7.jpg', vote_average: 8.0 },
  { id: 8, title: 'Genre Movie 2', poster_path: '/path8.jpg', vote_average: 7.5 }
];

beforeEach(() => {
  searchMovies.mockImplementation((query) => {
    if (query === 'Avengers') {
      return Promise.resolve({ results: mockMovies });
    } else if (query === 'Batman') {
      return Promise.resolve({ results: [] });
    }
    return Promise.resolve({ results: [] });
  });

  fetchTopRatedMovies.mockResolvedValue({ results: mockTopRatedMovies });
  fetchUpcomingMovies.mockResolvedValue({ results: mockUpcomingMovies });
  fetchGenreMovies.mockImplementation((genreId) => {
    if (genreId === 28) { // Assuming 28 is the genre ID for Action
      return Promise.resolve({ results: mockGenreMovies });
    }
    return Promise.resolve({ results: [] });
  });
});

test('initial load fetches and displays movies', async () => {
  render(<App />);

  await waitFor(() => expect(searchMovies).toHaveBeenCalledWith('Avengers'));

  expect(screen.getByText('Movie 1')).toBeInTheDocument();
  expect(screen.getByText('Movie 2')).toBeInTheDocument();
});

test('search bar functionality', async () => {
  render(<App />);

  const searchInput = screen.getByPlaceholderText('Search for movies...');
  fireEvent.change(searchInput, { target: { value: 'Batman' } });
  fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

  await waitFor(() => expect(searchMovies).toHaveBeenCalledWith('Batman'));
  expect(searchMovies).toHaveBeenCalledTimes(2);
});

test('navigation tabs functionality', async () => {
  render(<App />);

  const topRatedTab = screen.getByText('Top Rated');
  fireEvent.click(topRatedTab);

  await waitFor(() => expect(screen.getByText('Top Rated Movie 1')).toBeInTheDocument());
  expect(screen.getByText('Top Rated Movie 2')).toBeInTheDocument();

  const upcomingTab = screen.getByText('Upcoming');
  fireEvent.click(upcomingTab);

  await waitFor(() => expect(screen.getByText('Upcoming Movie 1')).toBeInTheDocument());
  expect(screen.getByText('Upcoming Movie 2')).toBeInTheDocument();
});

test('genre navigation functionality', async () => {
  render(<App />);

  const actionTab = screen.getByText('Action');
  fireEvent.click(actionTab);

  await waitFor(() => expect(screen.getByText('Genre Movie 1')).toBeInTheDocument());
  expect(screen.getByText('Genre Movie 2')).toBeInTheDocument();
});
