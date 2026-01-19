"""Verification script to check user challenge status"""
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models import User, UserChallenge

app = create_app()
with app.app_context():
    email = "wiwi@gmail.com"
    user = User.query.filter_by(username=email).first()
    
    if user:
        print(f"User: {user.username} (ID: {user.id})")
        print(f"Balance: ${user.balance:,.2f}")
        print(f"Initial Capital: ${user.initial_capital:,.2f}")
        print(f"Status: {user.status}")
        
        # Get active challenge
        active = UserChallenge.query.filter_by(
            user_id=user.id, 
            challenge_status='active'
        ).order_by(UserChallenge.created_at.desc()).first()
        
        if active:
            print(f"\n--- ACTIVE CHALLENGE ---")
            print(f"Plan: {active.plan_name}")
            print(f"Capital: ${active.initial_capital:,.2f}")
            print(f"Created: {active.created_at}")
            print(f"Transaction: {active.transaction_id}")
        else:
            print("\nNO ACTIVE CHALLENGE!")
        
        # Count all challenges
        all_challenges = UserChallenge.query.filter_by(user_id=user.id).all()
        print(f"\nTotal Challenges: {len(all_challenges)}")
        for c in all_challenges:
            print(f"  - ID={c.id} | {c.plan_name} | {c.challenge_status} | Created: {c.created_at}")
    else:
        print(f"User {email} not found!")
