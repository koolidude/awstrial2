from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from src.config import Config
from googleapiclient.discovery import build
import logging
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def home():
    return "Welcome to the Netflix Clone API"

@app.route('/movies')
def get_movies():
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

@app.route('/youtube/search/<query>')
def search_youtube(query):
    try:
        youtube = build('youtube', 'v3', developerKey=Config.YOUTUBE_API_KEY)
        request = youtube.search().list(
            q=query,
            part='snippet',
            maxResults=10
        )
        response = request.execute()
        return jsonify(response)
    except Exception as e:
        logging.error(f"Error fetching YouTube data: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
