import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [genreMovies, setGenreMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedMovies, setSearchedMovies] = useState([]);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetch(`${backendUrl}/movies`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setMovies(data.results))
            .catch(error => console.error('Error fetching movies:', error));

        fetch(`${backendUrl}/movies/top-rated`)
            .then(response => response.json())
            .then(data => setTopRatedMovies(data.results))
            .catch(error => console.error('Error fetching top-rated movies:', error));

        fetch(`${backendUrl}/movies/upcoming`)
            .then(response => response.json())
            .then(data => setUpcomingMovies(data.results))
            .catch(error => console.error('Error fetching upcoming movies:', error));

        fetch(`${backendUrl}/movies/genre/28`)  // Assuming 28 is a genre ID for testing
            .then(response => response.json())
            .then(data => setGenreMovies(data.results))
            .catch(error => console.error('Error fetching genre movies:', error));
    }, [backendUrl]);

    const handleSearch = () => {
        fetch(`${backendUrl}/movies/search/${searchQuery}`)
            .then(response => response.json())
            .then(data => setSearchedMovies(data.results))
            .catch(error => console.error('Error searching movies:', error));
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Netflix Clone</h1>
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </header>
            <main>
                <h2>Popular Movies</h2>
                <div className="movies">
                    {movies.map(movie => (
                        <div key={movie.id} className="movie-card">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>Rating: {movie.vote_average}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <h2>Top Rated Movies</h2>
                <div className="movies">
                    {topRatedMovies.map(movie => (
                        <div key={movie.id} className="movie-card">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>Rating: {movie.vote_average}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <h2>Upcoming Movies</h2>
                <div className="movies">
                    {upcomingMovies.map(movie => (
                        <div key={movie.id} className="movie-card">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>Release Date: {movie.release_date}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <h2>Genre Movies</h2>
                <div className="movies">
                    {genreMovies.map(movie => (
                        <div key={movie.id} className="movie-card">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>Rating: {movie.vote_average}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <h2>Searched Movies</h2>
                <div className="movies">
                    {searchedMovies.map(movie => (
                        <div key={movie.id} className="movie-card">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>Rating: {movie.vote_average}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;
