"""
Script to verify payment fix:
1. Create a user with an active challenge.
2. Simulate a NEW purchase.
3. Verify old challenge is archived ('replaced').
4. Verify new challenge is active.
"""
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models import User, UserChallenge
from datetime import datetime, timedelta
import uuid

app = create_app()

def verify_fix():
    with app.app_context():
        email = "payment_test@example.com"
        
        # 1. Setup User
        user = User.query.filter_by(username=email).first()
        if not user:
            user = User(username=email, balance=0, status='PENDING', initial_capital=0)
            db.session.add(user)
            db.session.commit()
            print(f"Created user {email}")
        
        # 2. Setup OLD Active Challenge
        # Ensure we start fresh-ish
        UserChallenge.query.filter_by(user_id=user.id).delete()
        
        old_challenge = UserChallenge(
            user_id=user.id,
            plan_name="Old Plan",
            plan_price=10.0,
            initial_capital=5000,
            payment_method='card',
            payment_status='completed',
            challenge_status='active', # ACTIVE!
            created_at=datetime.utcnow() - timedelta(days=1)
        )
        db.session.add(old_challenge)
        db.session.commit()
        print(f"Created Initial Active Challenge ID={old_challenge.id}")
        
    # 3. Simulate Purchase via API
    client = app.test_client()
    print("\nSimulating Purchase of 'Starter' Plan...")
    response = client.post('/api/purchase', json={
        'plan': 'starter',
        'method': 'card',
        'email': email,
        'amount': 20
    })
    
    print(f"Purchase Status: {response.status_code}")
    print(f"Purchase Response: {response.get_json()}")
    
    if response.status_code != 200:
        print("❌ Purchase failed!")
        return

    # 4. Verify Database State
    with app.app_context():
        user = User.query.filter_by(username=email).first()
        challenges = UserChallenge.query.filter_by(user_id=user.id).order_by(UserChallenge.created_at).all()
        
        print("\n--- Challenge History ---")
        param_old_archived = False
        param_new_active = False
        
        for c in challenges:
            print(f"ID={c.id} | {c.plan_name} | Status: {c.challenge_status} | Created: {c.created_at}")
            
            if c.plan_name == "Old Plan":
                if c.challenge_status == 'replaced':
                    print("  ✅ Old plan correctly archived (replaced)")
                    param_old_archived = True
                else:
                    print(f"  ❌ FAIL: Old plan status is {c.challenge_status} (expected 'replaced')")
            
            if c.plan_name == "Starter":
                if c.challenge_status == 'active':
                    print("  ✅ New plan is active")
                    param_new_active = True
                else:
                    print(f"  ❌ FAIL: New plan status is {c.challenge_status} (expected 'active')")

        if param_old_archived and param_new_active:
            print("\n✅ VERIFICATION SUCCESSFUL: System correctly handles challenge replacement.")
        else:
            print("\n❌ VERIFICATION FAILED: Check logs.")

if __name__ == "__main__":
    verify_fix()
