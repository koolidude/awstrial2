import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    TMDB_API_KEY = os.getenv('TMDB_API_KEY')
    DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')

config = Config()