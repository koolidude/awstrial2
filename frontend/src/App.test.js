// src/App.test.js
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
  fetch.resetMocks();
  process.env.REACT_APP_BACKEND_URL = 'http://mock-backend-url'; // Set the environment variable for testing
});

test('fetches and displays movies', async () => {
  fetch.mockResponseOnce(JSON.stringify({ results: [{ title: 'Movie 1' }, { title: 'Movie 2' }] }));

  render(<App />);

  const popularMoviesElement = await waitFor(() => screen.getByText(/Popular Movies/i));
  expect(popularMoviesElement).toBeInTheDocument();
  expect(screen.getByText('Movie 1')).toBeInTheDocument();
  expect(screen.getByText('Movie 2')).toBeInTheDocument();
});

test('fetches and displays top rated movies', async () => {
  fetch.mockResponseOnce(JSON.stringify({ results: [{ title: 'Top Rated Movie 1' }, { title: 'Top Rated Movie 2' }] }));

  render(<App />);

  const topRatedMoviesElement = await waitFor(() => screen.getByText(/Top Rated Movies/i));
  expect(topRatedMoviesElement).toBeInTheDocument();
  expect(screen.getByText('Top Rated Movie 1')).toBeInTheDocument();
  expect(screen.getByText('Top Rated Movie 2')).toBeInTheDocument();
});

test('fetches and displays upcoming movies', async () => {
  fetch.mockResponseOnce(JSON.stringify({ results: [{ title: 'Upcoming Movie 1' }, { title: 'Upcoming Movie 2' }] }));

  render(<App />);

  const upcomingMoviesElement = await waitFor(() => screen.getByText(/Upcoming Movies/i));
  expect(upcomingMoviesElement).toBeInTheDocument();
  expect(screen.getByText('Upcoming Movie 1')).toBeInTheDocument();
  expect(screen.getByText('Upcoming Movie 2')).toBeInTheDocument();
});

test('fetches and displays genre movies', async () => {
  fetch.mockResponseOnce(JSON.stringify({ results: [{ title: 'Genre Movie 1' }, { title: 'Genre Movie 2' }] }));

  render(<App />);

  const genreMoviesElement = await waitFor(() => screen.getByText(/Genre Movies/i));
  expect(genreMoviesElement).toBeInTheDocument();
  expect(screen.getByText('Genre Movie 1')).toBeInTheDocument();
  expect(screen.getByText('Genre Movie 2')).toBeInTheDocument();
});

test('fetches and displays searched movies', async () => {
  fetch.mockResponseOnce(JSON.stringify({ results: [{ title: 'Searched Movie 1' }, { title: 'Searched Movie 2' }] }));

  render(<App />);

  const searchInput = screen.getByPlaceholderText(/Search movies.../i);
  fireEvent.change(searchInput, { target: { value: 'Searched' } });

  const searchedMoviesElement = await waitFor(() => screen.getByText(/Searched Movies/i));
  expect(searchedMoviesElement).toBeInTheDocument();
  expect(screen.getByText('Searched Movie 1')).toBeInTheDocument();
  expect(screen.getByText('Searched Movie 2')).toBeInTheDocument();
});
