"""
Script pour corriger les challenges dupliqués: garde uniquement le plus récent comme 'active'
"""
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models import User, UserChallenge
from datetime import datetime

app = create_app()
with app.app_context():
    # Get all users
    users = User.query.all()
    
    for user in users:
        # Get all active challenges for this user
        active_challenges = UserChallenge.query.filter_by(
            user_id=user.id, 
            challenge_status='active'
        ).order_by(UserChallenge.created_at.desc()).all()
        
        if len(active_challenges) > 1:
            print(f"\nUser {user.username} has {len(active_challenges)} active challenges")
            
            # Keep only the most recent, archive the rest
            most_recent = active_challenges[0]
            print(f"  Keeping: ID={most_recent.id} | {most_recent.plan_name} | Created: {most_recent.created_at}")
            
            for old in active_challenges[1:]:
                print(f"  Archiving: ID={old.id} | {old.plan_name} | Created: {old.created_at}")
                old.challenge_status = 'replaced'
                old.completed_at = datetime.utcnow()
            
            # Update user balance to match the most recent challenge
            user.balance = most_recent.initial_capital
            user.initial_capital = most_recent.initial_capital
            user.daily_starting_equity = most_recent.initial_capital
    
    db.session.commit()
    print("\n\n=== CLEANUP COMPLETE ===")
    
    # Verify
    for user in users:
        active = UserChallenge.query.filter_by(
            user_id=user.id, 
            challenge_status='active'
        ).count()
        if active > 0:
            challenge = UserChallenge.query.filter_by(
                user_id=user.id, 
                challenge_status='active'
            ).first()
            print(f"{user.username}: {active} active challenge(s) - Current: {challenge.plan_name} (${challenge.initial_capital:,.0f})")
