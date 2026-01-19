from app import create_app, db
from app.models import User, Trade
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    print("Creating demo users for leaderboard...")
    
    # Demo users with varying performance
    demo_users = [
        {'username': 'CryptoKing', 'balance': 145200, 'initial': 100000, 'status': 'PASSED'},
        {'username': 'AtlasTrader', 'balance': 132800, 'initial': 100000, 'status': 'ACTIVE'},
        {'username': 'WhaleHunter', 'balance': 128500, 'initial': 100000, 'status': 'PASSED'},
        {'username': 'MarketMaster', 'balance': 125300, 'initial': 100000, 'status': 'ACTIVE'},
        {'username': 'TradingPro', 'balance': 122100, 'initial': 100000, 'status': 'PASSED'},
        {'username': 'BullRun', 'balance': 119800, 'initial': 100000, 'status': 'ACTIVE'},
        {'username': 'DiamondHands', 'balance': 117500, 'initial': 100000, 'status': 'ACTIVE'},
        {'username': 'MoonShot', 'balance': 115200, 'initial': 100000, 'status': 'PASSED'},
        {'username': 'ChartWizard', 'balance': 113900, 'initial': 100000, 'status': 'ACTIVE'},
        {'username': 'AlphaSeeker', 'balance': 112400, 'initial': 100000, 'status': 'ACTIVE'},
    ]
    
    for user_data in demo_users:
        # Check if user already exists
        existing = User.query.filter_by(username=user_data['username']).first()
        if existing:
            print(f"User {user_data['username']} already exists, skipping...")
            continue
            
        user = User(
            username=user_data['username'],
            balance=user_data['balance'],
            initial_capital=user_data['initial'],
            daily_starting_equity=user_data['balance'],
            status=user_data['status'],
            last_equity_reset=datetime.utcnow()
        )
        db.session.add(user)
        db.session.flush()  # Get user.id
        
        # Create some random trades for each user
        num_trades = random.randint(50, 150)
        for i in range(num_trades):
            trade = Trade(
                user_id=user.id,
                symbol=random.choice(['BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'XAUUSD']),
                quantity=random.uniform(0.1, 2.0),
                price=random.uniform(1000, 50000),
                type=random.choice(['BUY', 'SELL']),
                status='CLOSED',
                close_price=random.uniform(1000, 50000),
                close_timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
                pnl=random.uniform(-500, 1000),
                timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            db.session.add(trade)
        
        print(f"Created user: {user_data['username']} with {num_trades} trades")
    
    db.session.commit()
    print("✅ Demo users created successfully!")
