// src/components/UpcomingMovies.js
import React, { useEffect, useState } from 'react';
import { fetchUpcomingMovies } from '../api';
import MovieList from './MovieList';

const UpcomingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUpcomingMovies();
        setMovies(data.results);
        setError(null);
      } catch (error) {
        setError('Error fetching upcoming movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Upcoming Movies</h2>
      <MovieList movies={movies} />
    </div>
  );
};

export default UpcomingMovies;
