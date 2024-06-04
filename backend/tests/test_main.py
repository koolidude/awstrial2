import unittest
from src.main import app

class BasicTests(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode(), "Welcome to the Netflix Clone API")

    def test_get_movies(self):
        response = self.app.get('/movies')
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.json)

if __name__ == "__main__":
    unittest.main()
