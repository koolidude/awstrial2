import unittest
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

if __name__ == '__main__':
    unittest.main()
