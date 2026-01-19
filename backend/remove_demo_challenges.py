"""
Script pour supprimer tous les challenges demo/gratuits
et ne garder que les challenges payants.
"""
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models import User, UserChallenge

app = create_app()
with app.app_context():
    # Delete all demo/free challenges
    demo_challenges = UserChallenge.query.filter(
        (UserChallenge.plan_name == 'Demo Challenge') | 
        (UserChallenge.payment_method == 'free') |
        (UserChallenge.plan_price == 0)
    ).all()
    
    print(f"Found {len(demo_challenges)} demo/free challenges to delete:")
    
    for c in demo_challenges:
        user = User.query.get(c.user_id)
        print(f"  Deleting: ID={c.id} | User={user.username if user else 'Unknown'} | Plan={c.plan_name}")
        db.session.delete(c)
    
    db.session.commit()
    print(f"\n=== Deleted {len(demo_challenges)} demo challenges ===")
    
    # Show remaining challenges
    remaining = UserChallenge.query.filter(UserChallenge.challenge_status == 'active').all()
    print(f"\nRemaining active (PAID) challenges: {len(remaining)}")
    for c in remaining:
        user = User.query.get(c.user_id)
        print(f"  ID={c.id} | {user.username if user else 'Unknown'} | {c.plan_name} | ${c.plan_price}")
