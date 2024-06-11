import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        fetch(`${backendUrl}/movies`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (error) {
                        throw new Error('Invalid JSON response');
                    }
                });
            })
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
