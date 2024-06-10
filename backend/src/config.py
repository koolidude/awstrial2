import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', '123')
    TMDB_API_KEY = os.getenv('15c9a39e65b8d2031035ea322b3e2880')
    DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')

config = Config()