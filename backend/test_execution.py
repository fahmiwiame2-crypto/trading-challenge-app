
import sys
import os

# Add backend directory to python path
sys.path.append(os.getcwd())

try:
    from app import create_app, db
    from app.models import User
    from app.services.risk_manager import RiskManager
    from app.services.feed_service import FeedService
except ImportError as e:
    print(f"Import Error: {e}")
    # Try different path if running from root
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from app import create_app, db
    from app.models import User
    from app.services.risk_manager import RiskManager
    from app.services.feed_service import FeedService

app = create_app()

with app.app_context():
    print("=== DEBUGGING EXECUTION ===")
    
    # 1. Test FeedService
    print("\n1. Testing Feed Service (BTC-USD)...")
    try:
        data = FeedService.get_price_data("BTC-USD")
        if data:
            print(f"[OK] Feed OK. Rows: {len(data)}. Last Price: {data[-1]['close']}")
        else:
            print("[FAIL] Feed Failed. No data returned.")
    except Exception as e:
        print(f"[ERROR] Feed Error: {e}")

    # 2. Test User
    print("\n2. Testing User Handling...")
    email = "debug_user@test.com"
    try:
        user = User.query.filter_by(username=email).first()
        if not user:
            print("User not found, creating...")
            user = User(username=email)
            db.session.add(user)
            db.session.commit()
            print(f"[OK] User Created. ID: {user.id}")
        else:
            print(f"[OK] User Found. ID: {user.id}, Balance: {user.balance}")
            
        # Reset balance for test
        if user.balance < 1000:
            user.balance = 100000.0
            db.session.commit()
            print("Balance reset to 100k")

    except Exception as e:
        print(f"[ERROR] User Error: {e}")

    # 3. Test Risk Manager
    print("\n3. Testing Risk Manager...")
    try:
        can_trade, reason = RiskManager.can_trade(user.id)
        if can_trade:
             print(f"[OK] Risk Check Passed. Status: {user.status}")
        else:
             print(f"[FAIL] Risk Check Failed. Reason: {reason}")
             
        # Detail
        metrics = RiskManager.get_risk_metrics(user.id)
        print(f"Metrics: Equity={metrics.get('current_equity')}, Drawdown={metrics.get('total_drawdown', {}).get('percent')}%")
        
    except Exception as e:
         print(f"[ERROR] Risk Manager Error: {e}")

    print("\n=== DEBUG COMPLETE ===")
