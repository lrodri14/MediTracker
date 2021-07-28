import requests
from meditracker.settings import PAYPAL_ACCESS_TOKEN

url = 'https://api-m.sandbox.paypal.com/v1/catalogs/products'


def create_product(user_type='DOCTOR', plan='PREMIUM',
                   description='Sealena Premium subscription for medical information management capabilities'):
    user_type = user_type.upper()
    plan = plan.upper()
    description = description.capitalize()
    product_name_id = 'SEALENA-{}-{}'.format(user_type, plan)
    product_name = 'Sealena ' + user_type.capitalize() + ' ' + plan.capitalize() + ' Subscription'
    headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {}'.format(PAYPAL_ACCESS_TOKEN),
                'PayPal-Request-Id': product_name_id
              }
    data = {
                'name': product_name,
                'description': description,
                'type': 'SERVICE',
                'category': 'SOFTWARE',
           }
    response = requests.request('POST', url, headers=headers, json=data).json()
    print(response)


def collect_product_information():
    user_type = input('Please provide a user type for this product: (DOCTOR, ASSISTANT, CLINIC, PHARMACY, LABORATORY)\n')
    plan = input('Please provide a plan type for this product: (BASIC, PREMIUM, PLATINUM)\n')
    description = input('Please provide a description for this product: \n')
    create_product(user_type, plan, description)

collect_product_information()



