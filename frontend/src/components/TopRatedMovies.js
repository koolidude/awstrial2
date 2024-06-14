// src/components/TopRatedMovies.js
import React, { useEffect, useState } from 'react';
import { fetchTopRatedMovies } from '../api';
import MovieList from './MovieList';

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTopRatedMovies();
        console.log('Fetched top-rated movies:', data);
        setMovies(data.results);
        setError(null);
      } catch (error) {
        console.error('Error fetching top-rated movies:', error);
        setError('Error fetching top-rated movies.');
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
      <h2>Top Rated Movies</h2>
      <MovieList movies={movies} />
    </div>
  );
};

export default TopRatedMovies;
