import requests
from meditracker.settings import PAYPAL_ACCESS_TOKEN

url = 'https://api-m.sandbox.paypal.com/v1/billing/plans'


def create_plan(user_type='DOCTOR', plan='PREMIUM', description='', plan_type='REGULAR'):
    user_type = user_type.upper()
    plan = plan.upper()
    description = description.capitalize()
    plan_type = plan_type.upper()
    plan_name_id = 'SEALENA-{}-{}-PLAN'.format(user_type, plan)
    name = 'Sealena {} {} Plan'.format(user_type.capitalize(), plan.capitalize())
    headers = {
        'Authorization': 'Bearer {}'.format(PAYPAL_ACCESS_TOKEN),
        'Content-Type': 'application/json',
        'PayPal-Request-Id': plan_name_id
    }
    data = {
        'product_id': 'PROD-6JS41416XG325860S',
        'name': name,
        'status': 'ACTIVE',
        'description': description,
        'billing_cycles': [
            {
                'frequency': {
                    'interval_unit': 'MONTH',
                    'interval_count': 1,
                },
                'pricing_scheme': {
                    'fixed_price': {
                        'currency_code': 'USD',
                        'value': '25'
                    }
                },
                'tenure_type': plan_type,
                'sequence': 1,
                'total_cycles': 0,
            },
        ],
        'payment_preferences': {
            'auto_bill_outstanding': True,
            'setup_fee': {
                'currency_code': 'USD',
                'value': 25,
            },
            'setup_fee_failure_action': 'CANCEL',
            'payment_failure_threshold': '1',
        }
    }
    response = requests.request('POST', url, headers=headers, json=data).json()
    print(response)


def collect_plan_information():
    user_type = input('Please provide a user type: (DOCTOR, ASSISTANT): \n')
    plan = input('Please provide a plan type: (BASIC, PREMIUM): \n')
    description = input('Please provide a description for this plan: \n')
    plan_type = input('Please provide a plan type: (TRIAL, REGULAR): \n')
    create_plan(user_type, plan, description, plan_type)


collect_plan_information()