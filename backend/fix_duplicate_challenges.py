"""
Fix duplicate active challenges.
Keep only the most recent active challenge per user.
"""
from app import create_app, db
from app.models import User, UserChallenge
from sqlalchemy import desc
from datetime import datetime

def fix_duplicate_challenges():
    app = create_app()
    
    with app.app_context():
        # Find all users
        all_users = User.query.all()
        print(f"Found {len(all_users)} total users")
        
        for user in all_users:
            # Get all active challenges for this user, ordered by creation date (newest first)
            active_challenges = UserChallenge.query.filter_by(
                user_id=user.id, 
                challenge_status='active'
            ).order_by(desc(UserChallenge.created_at)).all()
            
            if len(active_challenges) > 1:
                print(f"User {user.username} has {len(active_challenges)} active challenges. Fixing...")
                
                # Keep the first (newest), archive the rest
                latest = active_challenges[0]
                print(f"  Keeping: {latest.plan_name} (ID={latest.id}, capital={latest.initial_capital})")
                
                for old_challenge in active_challenges[1:]:
                    print(f"  Archiving: {old_challenge.plan_name} (ID={old_challenge.id})")
                    old_challenge.challenge_status = 'replaced'
                    old_challenge.completed_at = datetime.utcnow()
                    
        db.session.commit()
        print("\nDone! All users now have at most 1 active challenge.")

if __name__ == "__main__":
    print("=== Fixing Duplicate Active Challenges ===\n")
    fix_duplicate_challenges()
