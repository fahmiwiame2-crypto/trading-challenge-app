import time
from app import create_app, db
from app.models import User, UserChallenge
from app.services.risk_manager import RiskManager

def verify_real_challenges():
    print("Starting Real Challenge Verification...")
    
    # Pre-check DB connection and fix URL if needed
    import os
    from urllib.parse import urlparse
    import pymysql
    
    db_url = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:root@127.0.0.1:3306/tradesense')
    print(f"Checking connection with configured URL...")
    
    def test_connection_string(url):
        try:
            p = urlparse(url.replace('mysql+pymysql://', 'http://'))
            conn = pymysql.connect(
                host=p.hostname, 
                user=p.username, 
                password=p.password, 
                port=p.port or 3306,
                database=p.path.lstrip('/')
            )
            conn.close()
            return True
        except Exception as e:
            return False

    if not test_connection_string(db_url):
        print("Connection failed with configured credentials. Trying empty password...")
        # Try empty password
        new_url = db_url.replace(':root@', ':@')
        if test_connection_string(new_url):
            print("Success with empty password! Updating environment for test.")
            os.environ['DATABASE_URL'] = new_url
        else:
            print("Could not connect with empty password either. Proceeding with original (might fail).")
    
    app = create_app()
    client = app.test_client()
    
    with app.app_context():
        # 1. Create Test User
        email = f"challenger_{int(time.time())}@test.com"
        print(f"Creating user: {email}")
        
        user = User(username=email, balance=0, status='ACTIVE')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        
        # 2. Purchase Challenge via API
        print("\nPurchasing 'Pro' Challenge...")
        response = client.post("/challenge/purchase", json={
            "email": email,
            "plan_name": "Pro Trader",
            "price": 499,
            "initial_capital": 100000
        })
        
        if response.status_code != 200:
            print(f"Purchase failed: {response.data}")
            return
        
        response_json = response.get_json()
        print(f"Purchase successful! ID: {response_json.get('challenge_id')}")
        
        # 3. Verify Database State
        challenge = UserChallenge.query.filter_by(user_id=user_id, challenge_status='active').first()
        if not challenge:
            print("No active challenge found in DB!")
            return
            
        print(f"Active challenge found: {challenge.plan_name}")
        print(f"   - Max Daily Loss: {challenge.max_daily_loss}%")
        print(f"   - Max Total Loss: {challenge.max_total_loss}%")
        
        # 4. Simulate Trading (Safe Risk)
        print("\nSimulating Safe Trade...")
        # Artificially update balance to 99000 (1% less than 100k)
        user.balance = 99000
        db.session.commit()
        
        can_trade, reason = RiskManager.can_trade(user_id)
        if can_trade:
            print("User can trade (Risk Within Limits)")
        else:
            print(f"User blocked unexpectedly: {reason}")
            
        # 5. Simulate Trading (Violation)
        print("\nSimulating CRITICAL Loss (15% drop)...")
        # Artificially update balance to 85000 (15% less than 100k, > 10% max total loss)
        user.balance = 85000
        db.session.commit()
        
        # Check Risk Manager directly
        risk_result = RiskManager.check_risk_rules(user_id)
        print(f"Risk Check Result: {risk_result['status']}")
        
        if risk_result['status'] == 'FAILED':
             print("System correctly flagged FAILURE")
        else:
             print(f"System failed to flag violation! Status: {risk_result['status']}")
             
        # Reload challenge to check status update
        db.session.refresh(challenge)
        if challenge.challenge_status == 'failed':
            print("UserChallenge record updated to 'failed'")
        else:
            print(f"UserChallenge record status is '{challenge.challenge_status}', expected 'failed'")

if __name__ == "__main__":
    try:
        verify_real_challenges()
    except Exception as e:
        print(f"Test Crashed: {e}")
