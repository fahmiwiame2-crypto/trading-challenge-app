import requests
import json
import random
import string
import time

BASE_URL = 'http://localhost:5000/api'

def get_random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def run_verification():
    # 1. Register User
    username = f"user_{get_random_string()}"
    email = f"{username}@example.com"
    password = "password123"
    
    print(f"Registering user: {email}")
    resp = requests.post(f"{BASE_URL}/register", json={
        "username": username,
        "email": email,
        "password": password
    })
    
    if resp.status_code != 200:
        print(f"Registration failed: {resp.content}")
        return
        
    user_data = resp.json()['user']
    print(f"User registered. ID: {user_data['id']}")
    
    # Check Initial Dashboard State
    resp = requests.get(f"{BASE_URL}/challenge?email={email}")
    if resp.status_code != 200:
        print(f"Failed to get dashboard: {resp.content}")
    else:
        dash = resp.json()
        print(f"Initial Dashboard: Active Challenge={dash.get('active_challenge')}, Balance={dash.get('balance')}")

    # 2. Purchase Challenge - EXACT logic from Pricing.jsx for "Starter"
    # Pricing.jsx sends: plan_name: "Starter", price: 20, payment_method: ...
    print("\nPurchasing 'Starter' Challenge using payment.py handler...")
    payment_payload = {
        "plan_name": "Starter",
        "price": 20,
        "payment_method": "card",
        "email": email,
        "customerInfo": {"name": username}
    }
    
    # This hits /api/purchase -> payment.py
    resp = requests.post(f"{BASE_URL}/purchase", json=payment_payload)
    
    print(f"Response Code: {resp.status_code}")
    print(f"Response Content: {resp.text}")
    
    if resp.status_code != 200:
        print("❌ Payment Failed!")
        return

    # 3. Verify Updated State via /me
    print("\nVerifying via /me endpoint:")
    resp = requests.get(f"{BASE_URL}/me?email={email}")
    me_data = resp.json()['user']
    print(f"Status: {me_data.get('status')}")
    print(f"Has Active Challenge: {me_data.get('has_active_challenge')}")
    print(f"Balance: {me_data.get('balance')}")
    
    # 4. Verify via /challenge endpoint (Dashboard)
    print("\nVerifying via /challenge endpoint:")
    resp = requests.get(f"{BASE_URL}/challenge?email={email}")
    dash_data = resp.json()
    print(f"Active Challenge: {dash_data.get('active_challenge') is not None}")
    print(f"Balance: {dash_data.get('balance')}")
    
    if me_data.get('balance') == 5000 and dash_data.get('active_challenge'):
        print("\n✅ SUCCESS: Payment handler works and Dashboard sees the update.")
    else:
        print("\n❌ FAILURE: Dashboard does not see the update.")

if __name__ == "__main__":
    try:
        run_verification()
    except Exception as e:
        print(f"Error: {e}")
