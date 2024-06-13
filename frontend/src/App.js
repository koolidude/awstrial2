import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedMovies, setSearchedMovies] = useState([]);
    const [youtubeVideos, setYoutubeVideos] = useState([]);

    useEffect(() => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        console.log('Backend URL:', backendUrl);
        fetch(`${backendUrl}/movies`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setMovies(data.results))
            .catch(error => console.error('Error fetching movies:', error));
    }, []);

    const handleSearch = () => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        fetch(`${backendUrl}/movies/search/${searchQuery}`)
            .then(response => response.json())
            .then(data => setSearchedMovies(data.results))
            .catch(error => console.error('Error searching movies:', error));
    };

    const handleMovieClick = (movieId) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        fetch(`${backendUrl}/youtube/search/${movieId}`)
            .then(response => response.json())
            .then(data => setYoutubeVideos(data.items))
            .catch(error => console.error('Error fetching YouTube videos:', error));
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
                <div className="movies">
                    {movies.map(movie => (
                        <div key={movie.id} className="movie" onClick={() => handleMovieClick(movie.id)}>
                            <h2>{movie.title}</h2>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        </div>
                    ))}
                </div>
                <div className="searched-movies">
                    {searchedMovies.map(movie => (
                        <div key={movie.id} className="movie" onClick={() => handleMovieClick(movie.id)}>
                            <h2>Searched Movie: {movie.title}</h2>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        </div>
                    ))}
                </div>
                <div className="youtube-videos">
                    {youtubeVideos.map(video => (
                        <div key={video.id.videoId} className="youtube-video">
                            <h2>{video.snippet.title}</h2>
                            <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                title={video.snippet.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;
