
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

    test('searches for movies', async () => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                json: () => {
                    if (url.includes('search')) {
                        return Promise.resolve({
                            results: [
                                { id: 3, title: 'Search Result 1', poster_path: '/path3.jpg' },
                                { id: 4, title: 'Search Result 2', poster_path: '/path4.jpg' },
                            ]
                        });
                    }
                    return Promise.resolve({ results: [] });
                }
            })
        );

        render(<App />);

        fireEvent.change(screen.getByLabelText(/Search Movies/i), { target: { value: 'Test' } });
        fireEvent.click(screen.getAllByRole('button', { name: /Search/i })[0]);

        await waitFor(() => {
            expect(screen.getByText('Search Result 1')).toBeInTheDocument();
            expect(screen.getByText('Search Result 2')).toBeInTheDocument();
        });

        // Clean up fetch mock
        global.fetch.mockClear();
    });

    test('fetches and displays top-rated movies', async () => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                json: () => {
                    if (url.includes('top-rated')) {
                        return Promise.resolve({
                            results: [
                                { id: 5, title: 'Top Rated Movie 1', poster_path: '/path5.jpg' },
                                { id: 6, title: 'Top Rated Movie 2', poster_path: '/path6.jpg' },
                            ]
                        });
                    }
                    return Promise.resolve({ results: [] });
                }
            })
        );

        render(<App />);

        fireEvent.click(screen.getByText(/Top Rated Movies/i));

        await waitFor(() => {
            expect(screen.getByText('Top Rated Movie 1')).toBeInTheDocument();
            expect(screen.getByText('Top Rated Movie 2')).toBeInTheDocument();
        });

        // Clean up fetch mock
        global.fetch.mockClear();
    });

    test('fetches and displays upcoming movies', async () => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                json: () => {
                    if (url.includes('upcoming')) {
                        return Promise.resolve({
                            results: [
                                { id: 7, title: 'Upcoming Movie 1', poster_path: '/path7.jpg' },
                                { id: 8, title: 'Upcoming Movie 2', poster_path: '/path8.jpg' },
                            ]
                        });
                    }
                    return Promise.resolve({ results: [] });
                }
            })
        );

        render(<App />);

        fireEvent.click(screen.getByText(/Upcoming Movies/i));

        await waitFor(() => {
            expect(screen.getByText('Upcoming Movie 1')).toBeInTheDocument();
            expect(screen.getByText('Upcoming Movie 2')).toBeInTheDocument();
        });

        // Clean up fetch mock
        global.fetch.mockClear();
    });

    test('fetches and displays action movies by genre', async () => {
        global.fetch = jest.fn(url =>
            Promise.resolve({
                json: () => {
                    if (url.includes('genre')) {
                        return Promise.resolve({
                            results: [
                                { id: 9, title: 'Action Movie 1', poster_path: '/path9.jpg' },
                                { id: 10, title: 'Action Movie 2', poster_path: '/path10.jpg' },
                            ]
                        });
                    }
                    return Promise.resolve({ results: [] });
                }
            })
        );

        render(<App />);

        fireEvent.click(screen.getByText(/Action Movies/i));

        await waitFor(() => {
            expect(screen.getByText('Action Movie 1')).toBeInTheDocument();
            expect(screen.getByText('Action Movie 2')).toBeInTheDocument();
        });

        // Clean up fetch mock
        global.fetch.mockClear();
    });
});
