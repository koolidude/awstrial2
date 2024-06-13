import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from main import app

class NetflixCloneAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch('main.requests.get')
    def test_get_movies(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [{"id": 1, "title": "Test Movie"}]}
        mock_get.return_value = mock_response

        response = self.app.get('/movies')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Test Movie", response.get_data(as_text=True))

    @patch('main.requests.get')
    def test_get_top_rated_movies(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [{"id": 1, "title": "Top Rated Movie"}]}
        mock_get.return_value = mock_response

        response = self.app.get('/movies/top-rated')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Top Rated Movie", response.get_data(as_text=True))

    @patch('main.requests.get')
    def test_get_upcoming_movies(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [{"id": 1, "title": "Upcoming Movie"}]}
        mock_get.return_value = mock_response

        response = self.app.get('/movies/upcoming')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Upcoming Movie", response.get_data(as_text=True))

    @patch('main.requests.get')
    def test_get_movie_details(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {"id": 1, "title": "Movie Details"}
        mock_get.return_value = mock_response

        response = self.app.get('/movie/1')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Movie Details", response.get_data(as_text=True))

    @patch('main.requests.get')
    def test_get_movies_by_genre(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [{"id": 1, "title": "Genre Movie"}]}
        mock_get.return_value = mock_response

        response = self.app.get('/movies/genre/1')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Genre Movie", response.get_data(as_text=True))

    @patch('main.requests.get')
    def test_search_movies(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [{"id": 1, "title": "Searched Movie"}]}
        mock_get.return_value = mock_response

        response = self.app.get('/movies/search/Test')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Searched Movie", response.get_data(as_text=True))

    @patch('main.build')
    def test_search_youtube(self, mock_build):
        mock_youtube = MagicMock()
        mock_search = MagicMock()
        mock_request = MagicMock()
        mock_response = MagicMock()
        mock_response.execute.return_value = {"items": [{"id": {"videoId": "1234"}, "snippet": {"title": "YouTube Video"}}]}
        
        mock_request.list.return_value = mock_request
        mock_search.return_value = mock_request
        mock_youtube.search = mock_search
        mock_build.return_value = mock_youtube

        response = self.app.get('/youtube/search/Test')
        self.assertEqual(response.status_code, 200)
        self.assertIn("YouTube Video", response.get_data(as_text=True))

if __name__ == '__main__':
    unittest.main()
