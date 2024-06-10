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

    return (
        <Container>
            <header className="App-header">
                <Typography variant="h2">Netflix Clone</Typography>
                <TextField 
                    label="Search Movies" 
                    variant="outlined" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
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
