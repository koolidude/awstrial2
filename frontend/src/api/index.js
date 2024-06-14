// src/api/index.js
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${backendUrl}/movies/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error.response || error.message);
    throw new Error('Error searching movies.');
  }
};

export const fetchTopRatedMovies = async () => {
  try {
    const response = await axios.get(`${backendUrl}/movies/top-rated`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top-rated movies:', error.response || error.message);
    throw new Error('Error fetching top-rated movies.');
  }
};

export const fetchUpcomingMovies = async () => {
  try {
    const response = await axios.get(`${backendUrl}/movies/upcoming`);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.response || error.message);
    throw new Error('Error fetching upcoming movies.');
  }
};

export const fetchGenreMovies = async (genreId) => {
  try {
    const response = await axios.get(`${backendUrl}/movies/genre/${genreId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching genre movies:', error.response || error.message);
    throw new Error('Error fetching genre movies.');
  }
};
