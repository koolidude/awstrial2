import React, { useEffect, useState } from 'react';
import './App.css';
import { Container, Typography, Grid, TextField, Button } from '@mui/material';
import MovieCard from './MovieCard';

function App() {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const backendUrl = 'https://group-3-backend.sctp-sandbox.com:5000';

    useEffect(() => {
        let isMounted = true;
        fetch(`${backendUrl}/movies`)
            .then(response => response.json())
            .then(data => {
                if (isMounted) {
                    setMovies(data.results);
                }
            })
            .catch(error => console.error('Error fetching movies:', error));

        return () => {
            isMounted = false;
        };
    }, [backendUrl]);

    const handleSearch = () => {
        fetch(`${backendUrl}/movies/search/${searchQuery}`)
            .then(response => response.json())
            .then(data => setMovies(data.results))
            .catch(error => console.error('Error searching movies:', error));
    };

    const fetchTopRatedMovies = () => {
        fetch(`${backendUrl}/movies/top-rated`)
            .then(response => response.json())
            .then(data => setMovies(data.results))
            .catch(error => console.error('Error fetching top rated movies:', error));
    };

    const fetchUpcomingMovies = () => {
        fetch(`${backendUrl}/movies/upcoming`)
            .then(response => response.json())
            .then (data => setMovies(data.results))
            .catch(error => console.error('Error fetching upcoming movies:', error));
    };

    const fetchMoviesByGenre = (genreId) => {
        fetch(`${backendUrl}/movies/genre/${genreId}`)
            .then(response => response.json())
            .then(data => setMovies(data.results))
            .catch(error => console.error('Error fetching movies by genre:', error));
    };

    return (
        <Container>
            <header className="App-header">
                <Typography variant="h2">Netflix Clone</Typography>
                <TextField 
                    label="Search Movies" 
                    variant="outlined" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputLabelProps={{ style: { color: '#ffffff' } }} /* Set label color to white */
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
                <Button variant="contained" color="primary" onClick={fetchTopRatedMovies}>Top Rated Movies</Button>
                <Button variant="contained" color="primary" onClick={fetchUpcomingMovies}>Upcoming Movies</Button>
                <Button variant="contained" color="primary" onClick={() => fetchMoviesByGenre(28)}>Action Movies</Button>
            </header>
            <main>
                <Grid container spacing={3}>
                    {movies.map(movie => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                            <MovieCard movie={movie} />
                        </Grid>
                    ))}
                </Grid>
            </main>
        </Container>
    );
}

export default App;
