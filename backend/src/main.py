from flask import Flask, jsonify
from flask_cors import CORS
import requests
from src.config import Config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Welcome to the Netflix Clone API"

@app.route('/movies')
def get_movies():
    # Fetch popular movies from TMDB API using the API key from config
    response = requests.get(f"https://api.themoviedb.org/3/movie/popular?api_key={Config.TMDB_API_KEY}")
    return jsonify(response.json())

@app.route('/movies/top-rated')
def get_top_rated_movies():
    response = requests.get(f"https://api.themoviedb.org/3/movie/top_rated?api_key={Config.TMDB_API_KEY}")
    return jsonify(response.json())

@app.route('/movies/upcoming')
def get_upcoming_movies():
    response = requests.get(f"https://api.themoviedb.org/3/movie/upcoming?api_key={Config.TMDB_API_KEY}")
    return jsonify(response.json())

@app.route('/movie/<int:movie_id>')
def get_movie_details(movie_id):
    response = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={Config.TMDB_API_KEY}")
    return jsonify(response.json())

@app.route('/movies/genre/<int:genre_id>')
def get_movies_by_genre(genre_id):
    response = requests.get(f"https://api.themoviedb.org/3/discover/movie?with_genres={genre_id}&api_key={Config.TMDB_API_KEY}")
    return jsonify(response.json())

@app.route('/movies/search/<query>')
def search_movies(query):
    response = requests.get(f"https://api.themoviedb.org/3/search/movie?query={query}&api_key={Config.TMDB_API_KEY}")
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
