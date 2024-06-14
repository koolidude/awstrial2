// src/components/GenreMovies.js
import React, { useEffect, useState } from 'react';
import { fetchGenreMovies } from '../api';
import MovieList from './MovieList';

const GenreMovies = ({ genreId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchGenreMovies(genreId);
        setMovies(data.results);
        setError(null);
      } catch (error) {
        setError('Error fetching genre movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Genre Movies</h2>
      <MovieList movies={movies} />
    </div>
  );
};

export default GenreMovies;
