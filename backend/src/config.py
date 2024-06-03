import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    TMDB_API_KEY = os.getenv('TMDB_API_KEY', '0e7b0d47295286a3208fa98e638a12ad')
    DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')

config = Config()