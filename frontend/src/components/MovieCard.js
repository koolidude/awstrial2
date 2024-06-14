// src/components/MovieCard.js
import React from 'react';

const MovieCard = ({ movie, onClick }) => {
  return (
    <div className="movie-card" onClick={() => onClick(movie.title)}>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>Rating: {movie.vote_average}</p>
      </div>
    </div>
  );
};

export default MovieCard;
