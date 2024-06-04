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

if __name__ == '__main__':
    unittest.main()
