"""
Seed Top 10 Demo Traders for Leaderboard
Run this script to populate the database with demo traders
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User, Trade
from datetime import datetime, timedelta
import random

def seed_top_traders():
    app = create_app()
    
    with app.app_context():
        # Top 10 Demo Traders with realistic performance
        demo_traders = [
            {"username": "CryptoKing", "email": "cryptoking@demo.com", "profit_pct": 45.2, "trades": 124},
            {"username": "AtlasTrader", "email": "atlastrader@demo.com", "profit_pct": 32.8, "trades": 89},
            {"username": "WhaleHunter", "email": "whalehunter@demo.com", "profit_pct": 28.5, "trades": 210},
            {"username": "MarketMaster", "email": "marketmaster@demo.com", "profit_pct": 25.3, "trades": 156},
            {"username": "TradingPro", "email": "tradingpro@demo.com", "profit_pct": 22.1, "trades": 98},
            {"username": "BullRun", "email": "bullrun@demo.com", "profit_pct": 19.8, "trades": 134},
            {"username": "DiamondHands", "email": "diamondhands@demo.com", "profit_pct": 17.5, "trades": 87},
            {"username": "MoonShot", "email": "moonshot@demo.com", "profit_pct": 15.2, "trades": 112},
            {"username": "ChartWizard", "email": "chartwizard@demo.com", "profit_pct": 13.9, "trades": 145},
            {"username": "AlphaSeeker", "email": "alphaseeker@demo.com", "profit_pct": 12.4, "trades": 76},
        ]
        
        print("[*] Seeding Top 10 Demo Traders...")
        
        for trader_data in demo_traders:
            # Check if user exists
            existing = User.query.filter_by(username=trader_data["username"]).first()
            if existing:
                print(f"   [SKIP] {trader_data['username']} already exists, updating...")
                # Update balance to reflect profit
                existing.initial_capital = 100000.0
                existing.balance = 100000.0 * (1 + trader_data["profit_pct"] / 100)
                existing.status = random.choice(['ACTIVE', 'ACTIVE', 'PASSED'])
                db.session.commit()
                continue
            
            # Calculate balance from profit %
            initial_capital = 100000.0
            balance = initial_capital * (1 + trader_data["profit_pct"] / 100)
            
            # Create user
            user = User(
                username=trader_data["username"],
                email=trader_data["email"],
                password_hash="demo_password_hash",
                role="USER",
                status=random.choice(['ACTIVE', 'ACTIVE', 'PASSED']),
                initial_capital=initial_capital,
                balance=balance,
                daily_starting_equity=balance
            )
            db.session.add(user)
            db.session.flush()  # Get the user ID
            
            # Create demo trades for this user
            symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'GOOGL', 'EUR/USD', 'XAU/USD']
            for i in range(trader_data["trades"]):
                trade = Trade(
                    user_id=user.id,
                    symbol=random.choice(symbols),
                    quantity=random.uniform(0.1, 10.0),
                    price=random.uniform(100, 50000),
                    type=random.choice(['BUY', 'SELL']),
                    status='CLOSED',
                    pnl=random.uniform(-500, 1500),
                    timestamp=datetime.now() - timedelta(days=random.randint(1, 30))
                )
                db.session.add(trade)
            
            print(f"   [OK] Created: {trader_data['username']} with +{trader_data['profit_pct']}% profit and {trader_data['trades']} trades")
        
        db.session.commit()
        print("\n[SUCCESS] Top 10 Demo Traders seeded successfully!")
        
        # Verify by showing current leaderboard
        print("\n[LEADERBOARD] Current Top 10:")
        users = User.query.filter(User.status != 'BANNED').all()
        
        leaderboard = []
        for user in users:
            initial = user.initial_capital if user.initial_capital > 0 else 100000.0
            current = user.balance
            profit_pct = ((current - initial) / initial) * 100
            trade_count = Trade.query.filter_by(user_id=user.id).count()
            leaderboard.append({
                'username': user.username,
                'profit': round(profit_pct, 2),
                'trades': trade_count
            })
        
        leaderboard.sort(key=lambda x: x['profit'], reverse=True)
        
        for idx, entry in enumerate(leaderboard[:10]):
            print(f"   #{idx+1} {entry['username']}: +{entry['profit']}% ({entry['trades']} trades)")

if __name__ == '__main__':
    seed_top_traders()
