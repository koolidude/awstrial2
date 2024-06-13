import unittest
from unittest.mock import patch, Mock
from src.main import app
from src.config import Config

class MainTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home(self):
        result = self.app.get('/')
        self.assertEqual(result.status_code, 200)
        self.assertIn(b'Welcome to the Netflix Clone API', result.data)

    def test_get_movies(self):
        result = self.app.get('/movies')
        self.assertEqual(result.status_code, 200)

    def test_get_top_rated_movies(self):
        result = self.app.get('/movies/top-rated')
        self.assertEqual(result.status_code, 200)

    def test_get_upcoming_movies(self):
        result = self.app.get('/movies/upcoming')
        self.assertEqual(result.status_code, 200)

    def test_get_movie_details(self):
        # Assuming 550 is a valid movie ID for testing
        result = self.app.get('/movie/550')
        self.assertEqual(result.status_code, 200)

    def test_get_movies_by_genre(self):
        # Assuming 28 is a valid genre ID for testing
        result = self.app.get('/movies/genre/28')
        self.assertEqual(result.status_code, 200)

    def test_search_movies(self):
        # Assuming 'Inception' is a valid search term for testing
        result = self.app.get('/movies/search/Inception')
        self.assertEqual(result.status_code, 200)

    @patch('src.main.build')
    def test_search_youtube(self, mock_build):
        # Mock YouTube API response
        mock_youtube = Mock()
        mock_search = Mock()
        mock_list = Mock()
        mock_execute = Mock()
        
        mock_execute.return_value = {'items': [{'id': 'test_id', 'snippet': {'title': 'Test Video'}}]}
        mock_list.return_value = mock_execute
        mock_search.list.return_value = mock_list
        mock_youtube.search.return_value = mock_search
        mock_build.return_value = mock_youtube

        # Perform the test
        result = self.app.get('/youtube/search/godzilla')
        self.assertEqual(result.status_code, 200)
        self.assertIn('items', result.json)

if __name__ == '__main__':
    unittest.main()
