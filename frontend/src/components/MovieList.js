// src/components/MovieList.js
import React from 'react';

const MovieList = ({ movies }) => {
  if (!movies.length) {
    return <div>No movies found.</div>;
  }

  const handleMovieClick = (movieTitle) => {
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle)}`;
    window.open(youtubeSearchUrl, '_blank');
  };

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.title)}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>Rating: {movie.vote_average}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
