from flask import Blueprint, jsonify
from app.models import User, Trade, db
from sqlalchemy import func

leaderboard_bp = Blueprint('leaderboard', __name__)

# Demo traders to fill the leaderboard when there aren't enough real users
DEMO_TRADERS = [
    {"username": "CryptoKing", "profit": 45.2, "trades": 124, "status": "PASSED", "total_pnl": 22600, "closed_trades": 120},
    {"username": "AtlasTrader", "profit": 32.8, "trades": 89, "status": "ACTIVE", "total_pnl": 16400, "closed_trades": 85},
    {"username": "WhaleHunter", "profit": 28.5, "trades": 210, "status": "PASSED", "total_pnl": 14250, "closed_trades": 200},
    {"username": "MarketMaster", "profit": 25.3, "trades": 156, "status": "ACTIVE", "total_pnl": 12650, "closed_trades": 150},
    {"username": "TradingPro", "profit": 22.1, "trades": 98, "status": "PASSED", "total_pnl": 11050, "closed_trades": 95},
    {"username": "BullRun", "profit": 19.8, "trades": 134, "status": "ACTIVE", "total_pnl": 9900, "closed_trades": 130},
    {"username": "DiamondHands", "profit": 17.5, "trades": 87, "status": "ACTIVE", "total_pnl": 8750, "closed_trades": 80},
    {"username": "MoonShot", "profit": 15.2, "trades": 112, "status": "PASSED", "total_pnl": 7600, "closed_trades": 108},
    {"username": "ChartWizard", "profit": 13.9, "trades": 145, "status": "ACTIVE", "total_pnl": 6950, "closed_trades": 140},
    {"username": "AlphaSeeker", "profit": 12.4, "trades": 76, "status": "ACTIVE", "total_pnl": 6200, "closed_trades": 72},
]

@leaderboard_bp.route('/', methods=['GET'])
def get_leaderboard():
    try:
        # Get all active users
        users = User.query.filter(User.status != 'BANNED').all()
        
        leaderboard_data = []
        real_usernames = set()
        
        for user in users:
            # Calculate Profit %
            # (Current Equity - Initial) / Initial * 100
            # Use daily_starting_equity or initial_capital logic. 
            # For simplicity: Use balance vs initial_capital
            
            initial = user.initial_capital if user.initial_capital > 0 else 100000.0
            current = user.balance
            
            profit_raw = current - initial
            profit_pct = (profit_raw / initial) * 100
            
            # Count trades
            trade_count = Trade.query.filter_by(user_id=user.id).count()
            
            leaderboard_data.append({
                'username': user.username,
                'profit': round(profit_pct, 2),
                'trades': trade_count,
                'status': user.status,
                'total_pnl': round(profit_raw, 2),
                'closed_trades': trade_count, 
            })
            real_usernames.add(user.username)
            
        # If we have fewer than 10 users, add demo traders to fill the gap
        if len(leaderboard_data) < 10:
            needed = 10 - len(leaderboard_data)
            # Filter out demo traders whose usernames conflict with real users
            available_demos = [demo for demo in DEMO_TRADERS if demo['username'] not in real_usernames]
            # Add the needed number of demo traders
            for demo in available_demos[:needed]:
                leaderboard_data.append(demo.copy())
        
        # Sort by Profit % Descending
        leaderboard_data.sort(key=lambda x: x['profit'], reverse=True)
        
        # Take Top 10
        top_10 = leaderboard_data[:10]
        
        # Add Rank
        for idx, entry in enumerate(top_10):
            entry['rank'] = idx + 1
            
        return jsonify(top_10)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': str(e)}), 500
