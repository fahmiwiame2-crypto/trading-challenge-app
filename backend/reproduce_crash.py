
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models import User, UserChallenge
import json

app = create_app()

def test_no_challenge_api():
    with app.app_context():
        # Setup: Ensure user exists with NO challenge
        email = "crash_test@example.com"
        user = User.query.filter_by(username=email).first()
        if not user:
            user = User(username=email, status='PENDING', balance=0, initial_capital=0)
            db.session.add(user)
            db.session.commit()
            print(f"Created user {email}")
        else:
            # Delete any challenges
            UserChallenge.query.filter_by(user_id=user.id).delete()
            db.session.commit()
            print(f"Cleaned challenges for {email}")
            
    # Test API
    client = app.test_client()
    try:
        print("Sending GET request to /api/challenge...")
        response = client.get(f'/api/challenge?email={email}')
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.get_json()}")
        
        if response.status_code == 500:
            print("❌ CRASH CONFIRMED: 500 Internal Server Error")
        else:
            print("✅ SUCCESS: API handled no-challenge user gracefully")
            
    except Exception as e:
        print(f"❌ Exception during request: {e}")

if __name__ == "__main__":
    test_no_challenge_api()
