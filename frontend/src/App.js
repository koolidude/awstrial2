// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { searchMovies } from './api';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import TopRatedMovies from './components/TopRatedMovies';
import UpcomingMovies from './components/UpcomingMovies';
import GenreMovies from './components/GenreMovies';
import NavigationTabs from './components/NavigationTabs';
import LoadingSpinner from './components/LoadingSpinner';

const genres = [
  { id: 28, name: 'Action' },
  { id: 16, name: 'Animated' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 35, name: 'Comedy' },
  { id: 10752, name: 'War' },
  { id: 80, name: 'Crime' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 27, name: 'Horror' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 37, name: 'Western' },
  { id: 12, name: 'Adventure' }
];

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await searchMovies('Avengers');
        setMovies(data.results);
        setError(null);
      } catch (error) {
        setError('Error fetching initial movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const data = await searchMovies(query);
      setMovies(data.results);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Netflix Clone</h1>
          <NavigationTabs genres={genres} />
          <SearchBar onSearch={handleSearch} />
        </header>
        <main>
          <LoadingSpinner loading={loading} />
          {error && <div className="error">{error}</div>}
          <Routes>
            <Route path="/" element={<MovieList movies={movies} />} />
            <Route path="/top-rated" element={<TopRatedMovies />} />
            <Route path="/upcoming" element={<UpcomingMovies />} />
            {genres.map((genre) => (
              <Route
                key={genre.id}
                path={`/genre/${genre.id}`}
                element={<GenreMovies genreId={genre.id} />}
              />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
