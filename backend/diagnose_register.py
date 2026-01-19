
import sys
import os

# Add the current directory to the Python path
sys.path.append(os.getcwd())

from app import create_app, db
from app.models import User
from datetime import datetime

app = create_app()

with app.app_context():
    print("--- Database Diagnostics ---")
    try:
        from sqlalchemy import text
        db.session.execute(text("SELECT 1"))
        print("[OK] Database connection successful")
    except Exception as e:
        print(f"[FAIL] Database connection failed: {e}")
        sys.exit(1)

    print("\n--- Testing Registration Logic ---")
    test_email = f"test_{int(datetime.now().timestamp())}@example.com"
    try:
        # Check if table exists and columns match
        print("Checking User table...")
        user_cols = User.__table__.columns.keys()
        print(f"User columns: {user_cols}")
        
        new_user = User(
            username=test_email,
            balance=0,
            status='PENDING',
            initial_capital=0,
            daily_starting_equity=0,
            last_equity_reset=datetime.utcnow(),
            failure_reason=None,
            avatar_url=None
        )
        db.session.add(new_user)
        db.session.commit()
        print(f"[OK] Successfully registered {test_email}")
        
        # Cleanup
        db.session.delete(new_user)
        db.session.commit()
        print("[OK] Cleanup successful")
        
    except Exception as e:
        print(f"[FAIL] Registration logic failed: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
