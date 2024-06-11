import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const branchName = process.env.REACT_APP_BRANCH_NAME;
    const backendUrl = `https://group-3-backend-${branchName}.sctp-sandbox.com:5000`;

    useEffect(() => {
        fetch(`${backendUrl}/movies`)
            .then(response => response.json())
            .then(data => setMovies(data.results))
            .catch(error => console.error('Error fetching movies:', error));
    }, [backendUrl]);

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
