"""
Script pour corriger les utilisateurs existants sans challenge actif.
Crée un Demo Challenge pour chaque utilisateur sans challenge actif.
"""
import os
from dotenv import load_dotenv

load_dotenv()

from app import create_app, db
from app.models import User, UserChallenge
from datetime import datetime

def fix_existing_users():
    app = create_app()
    
    with app.app_context():
        # Find all users without an active challenge
        users_without_challenge = db.session.query(User).outerjoin(
            UserChallenge, 
            (User.id == UserChallenge.user_id) & (UserChallenge.challenge_status == 'active')
        ).filter(UserChallenge.id == None).all()
        
        print(f"Found {len(users_without_challenge)} users without active challenges:")
        
        for user in users_without_challenge:
            print(f"  - {user.username} (ID: {user.id})")
            
            initial_capital = user.initial_capital if user.initial_capital > 0 else 5000.0
            
            # Create demo challenge
            demo_challenge = UserChallenge(
                user_id=user.id,
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
            db.session.add(demo_challenge)
            
            # Update user if needed
            if user.balance <= 0:
                user.balance = initial_capital
            if user.initial_capital <= 0:
                user.initial_capital = initial_capital
                user.daily_starting_equity = initial_capital
                user.last_equity_reset = datetime.utcnow()
                
            print(f"    Created Demo Challenge with capital: {initial_capital}")
        
        db.session.commit()
        print(f"\nFixed {len(users_without_challenge)} users!")

if __name__ == "__main__":
    fix_existing_users()
