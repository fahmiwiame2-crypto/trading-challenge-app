"""
Test registration to see exact error
"""
import os
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models import User, UserChallenge
from datetime import datetime

def test_register():
    app = create_app()
    
    with app.app_context():
        email = "wiwi@gmail.com"
        username = "wimy"
        
        # Check if user already exists
        existing = User.query.filter_by(username=email).first()
        if existing:
            print(f"User already exists: ID={existing.id}")
            return
        
        try:
            initial_capital = 5000.0
            
            new_user = User(
                username=email,
                balance=initial_capital,
                status='ACTIVE',
                initial_capital=initial_capital,
                daily_starting_equity=initial_capital,
                last_equity_reset=datetime.utcnow(),
                failure_reason=None,
                avatar_url=None
            )
            db.session.add(new_user)
            db.session.flush()
            print(f"User created with ID: {new_user.id}")
            
            # Create challenge
            initial_challenge = UserChallenge(
                user_id=new_user.id,
                plan_name="Demo Challenge",
                plan_price=0.0,
                initial_capital=initial_capital,
                payment_method='free',
                payment_status='completed',
                challenge_status='active',
                profit_target=10.0,
                max_daily_loss=5.0,
                max_total_loss=10.0
            )
            db.session.add(initial_challenge)
            db.session.commit()
            print(f"Challenge created! User {email} is ready.")
            
        except Exception as e:
            db.session.rollback()
            print(f"ERROR: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_register()
