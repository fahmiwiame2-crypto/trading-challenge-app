from flask import Blueprint, jsonify
from app.models import User, Trade, db
from sqlalchemy import func

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/', methods=['GET'])
def get_leaderboard():
    try:
        # Get all active users
        users = User.query.filter(User.status != 'BANNED').all()
        
        leaderboard_data = []
        
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
                # Add mock data for missing fields if needed
                'closed_trades': trade_count, 
            })
            
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
