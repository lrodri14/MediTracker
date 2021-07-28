import requests
from meditracker.settings import PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY

url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'


def request_access_token(client_id, secret_key):
    headers = {
        'Content-Type': 'application/json',
        'Accept-Language': 'en_US',
    }
    data = {'grant_type': 'client_credentials'}
    response = requests.request('POST', url, headers=headers, data=data, auth=(client_id, secret_key)).json()
    print(response)


request_access_token(PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY)


