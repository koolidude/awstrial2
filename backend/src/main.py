from flask import Flask, jsonify
from flask_cors import CORS
import requests
from config import Config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Welcome to the Netflix Clone API"

@app.route('/movies')
def get_movies():
    # Fetch data from TMDB API using the API key from config
    response = requests.get(f"https://api.themoviedb.org/3/movie/popular?api_key={Config.TMDB_API_KEY}")
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
