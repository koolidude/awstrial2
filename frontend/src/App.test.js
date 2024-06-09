import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';  // Ensure this is imported
import App from './App';

describe('App Component', () => {
    test('renders Netflix Clone title', () => {
        render(<App />);
        const linkElement = screen.getByText(/Netflix Clone/i);
        expect(linkElement).toBeInTheDocument();
    });

    test('fetches and displays movies', async () => {
        // Mock the fetch call to the backend API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    results: [
                        { id: 1, title: 'Movie 1', poster_path: '/path1.jpg' },
                        { id: 2, title: 'Movie 2', poster_path: '/path2.jpg' },
                    ]
                }),
            })
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Movie 1')).toBeInTheDocument();
            expect(screen.getByText('Movie 2')).toBeInTheDocument();
        });

        // Clean up fetch mock
        global.fetch.mockClear();
    });

    test('displays movie posters', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    results: [
                        { id: 1, title: 'Movie 1', poster_path: '/path1.jpg' },
                        { id: 2, title: 'Movie 2', poster_path: '/path2.jpg' },
                    ]
                }),
            })
        );

        render(<App />);

        await waitFor(() => {
            const imgElements = screen.getAllByRole('img');
            expect(imgElements).toHaveLength(2);
            expect(imgElements[0]).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/path1.jpg');
            expect(imgElements[1]).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/path2.jpg');
        });

        // Clean up fetch mock
        global.fetch.mockClear();
    });
});
