import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const backendUrl = 'https://group-3-backend.sctp-sandbox.com:5000'

    useEffect(() => {
        //const backendUrl = process.env.REACT_APP_BACKEND_URL;
        let isMounted = true;
        fetch(`${backendUrl}/movies`)
            .then(response => response.json())
            .then(data => setMovies(data.results))
            .catch(error => console.error('Error fetching movies:', error));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Netflix Clone</h1>
            </header>
            <main>
                <div className="movies">
                    {movies.map(movie => (
                        <div key={movie.id} className="movie">
                            <h2>{movie.title}</h2>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;