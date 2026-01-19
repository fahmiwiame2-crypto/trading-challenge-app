"""
Fix for existing users without challenges.
This script creates a Demo Challenge for all users who don't have an active challenge.
"""
from app import create_app, db
from app.models import User, UserChallenge
from datetime import datetime

def fix_users_without_challenges():
    app = create_app()
    
    with app.app_context():
        # Find all users
        all_users = User.query.all()
        print(f"Found {len(all_users)} total users")
        
        fixed_count = 0
        for user in all_users:
            # Check if user has an active challenge
            active_challenge = UserChallenge.query.filter_by(
                user_id=user.id, 
                challenge_status='active'
            ).first()
            
            if not active_challenge:
                print(f"  Creating challenge for user: {user.username}")
                
                # Use user's current initial_capital or default to 5000
                initial_capital = user.initial_capital if user.initial_capital > 0 else 5000.0
                
                # Create a Demo Challenge
                new_challenge = UserChallenge(
                    user_id=user.id,
                    plan_name="Demo Challenge",
                    plan_price=0.0,
                    initial_capital=initial_capital,
                    payment_method='free',
                    payment_status='completed',
                    challenge_status='active',
                    profit_target=10.0,
                    max_daily_loss=5.0,
                    max_total_loss=10.0,
                    created_at=datetime.utcnow()
                )
                db.session.add(new_challenge)
                
                # Also sync user's balance if needed
                if user.balance == 0:
                    user.balance = initial_capital
                    user.daily_starting_equity = initial_capital
                    
                fixed_count += 1
            else:
                print(f"  User {user.username} already has active challenge: {active_challenge.plan_name}")
        
        if fixed_count > 0:
            db.session.commit()
            print(f"\n✅ Fixed {fixed_count} users without challenges!")
        else:
            print("\n✅ All users already have active challenges!")

if __name__ == "__main__":
    print("=== Fixing Users Without Challenges ===\n")
    fix_users_without_challenges()
