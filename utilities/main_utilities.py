"""
    This main_utilities.py file contains all the variable declarations and function for the main app to perform
    correctly.
"""
import requests
import random
from meditracker.settings import X_RAPID_API_KEY_QUOTES, X_RAPID_API_KEY_HOST_QUOTES

api_key = X_RAPID_API_KEY_QUOTES
host = X_RAPID_API_KEY_HOST_QUOTES
quote_categories = ['love', 'god', 'wisdom', 'beauty', 'dreams']
endpoint = "https://famous-quotes4.p.rapidapi.com/random"
headers = {'x-rapidapi-key': api_key, 'x-rapidapi-host': host}
querystring = {'category': random.choice(quote_categories), 'count': '1'}


def collect_quote():
    response = requests.get(endpoint, headers=headers, params=querystring).json()
    quote = response[0]['text']
    author = response[0]['author']
    return tuple([quote, author])
