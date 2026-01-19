import requests
import time

BASE_URL = "http://localhost:5000"

def test_challenge_purchase():
    print("Starting Challenge Purchase Test...")
    
    # 1. Create a test user (or ensure they exist)
    test_email = f"test_challenge_{int(time.time())}@example.com"
    username = f"trader_{int(time.time())}"
    
    print(f"Creating/Checking user: {test_email}")
    
    # Create the user directly in DB (safest for test)
    from app import create_app, db
    from app.models import User
    
    app = create_app()
    with app.app_context():
        user = User.query.filter_by(username=test_email).first()
        if not user:
            user = User(username=test_email)
            user.balance = 0
            db.session.add(user)
            db.session.commit()
            print(f"Created test user: {test_email}")
        else:
            print(f"User already exists: {test_email}")
            
    # 2. Purchase a "Pro" Challenge (e.g. 100k)
    print("\nPurchasing 'Pro' Challenge ($100k)...")
    payload = {
        "email": test_email,
        "plan_name": "Pro Trader",
        "price": 499,
        "initial_capital": 100000
    }
    
    response = requests.post(f"{BASE_URL}/challenge/purchase", json=payload)
    if response.status_code == 200:
        print("Purchase request successful!")
        print(response.json())
    else:
        print(f"Purchase failed: {response.status_code} - {response.text}")
        return

    # 3. Verify Stats Updated
    print("\nVerifying Account Stats...")
    stats_response = requests.get(f"{BASE_URL}/challenge/challenge?email={test_email}")
    
    if stats_response.status_code == 200:
        stats = stats_response.json()
        print("Stats Received:")
        print(f" - Balance: {stats.get('balance')}")
        print(f" - Initial Capital: {stats.get('initial_capital')}")
        print(f" - Equity: {stats.get('equity')}")
        
        if stats.get('initial_capital') == 100000:
            print("SUCCESS: Initial capital updated to 100,000!")
        else:
            print(f"FAILURE: Initial capital is {stats.get('initial_capital')}, expected 100,000")
            
        if stats.get('balance') == 100000:
             print("SUCCESS: Balance reset to 100,000!")
        else:
             print(f"FAILURE: Balance is {stats.get('balance')}, expected 100,000")
             
    else:
        print(f"Failed to get stats: {stats_response.status_code}")

if __name__ == "__main__":
    try:
        test_challenge_purchase()
    except Exception as e:
        print(f"Test crashed: {e}")
