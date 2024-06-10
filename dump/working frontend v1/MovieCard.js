import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

function MovieCard({ movie }) {
    return (
        <Card>
            <CardMedia
                component="img"
                height="500"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {movie.overview}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MovieCard;
