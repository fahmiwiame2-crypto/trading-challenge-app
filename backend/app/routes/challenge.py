from flask import Blueprint, jsonify, request
from ..models import User, Trade, db, UserChallenge, Leaderboard
from ..services.feed_service import FeedService
from sqlalchemy import desc, func
from datetime import datetime, timedelta
import random

challenge_bp = Blueprint('challenge', __name__)

@challenge_bp.route('/challenge', methods=['GET'])
def get_challenge_stats():
    email = request.args.get('email')
    
    # 1. Find User (Case Insensitive)
    user = None
    if email:
        user = User.query.filter(func.lower(User.username) == email.strip().lower()).first()
        
    if not user:
        return jsonify({"message": "User not found"}), 404

    # 2. Get Active Challenge
    active_challenge = UserChallenge.query.filter_by(user_id=user.id, challenge_status='active').first()
    
    # 3. Get Past Challenges
    past_challenges_db = UserChallenge.query.filter(
        UserChallenge.user_id == user.id,
        UserChallenge.challenge_status != 'active',
        UserChallenge.challenge_status != 'pending'
    ).order_by(desc(UserChallenge.created_at)).all()
    past_challenges = [c.to_dict() for c in past_challenges_db]
    
    # If user has NO active challenge, return $0 balance (must pay first)
    if not active_challenge:
        return jsonify({
            "status": "PENDING",
            "balance": 0,
            "initial_capital": 0,
            "equity": 0,
            "profit": 0, 
            "profit_percent": 0,
            "drawdown": 0,
            "trades": [],
            "open_positions": [],
            "win_rate": 0,
            "best_trade": 0,
            "avg_trade": 0,
            "weekly_performance": [],
            "risk_params": {
                'max_daily_loss': 5.0,
                'max_total_loss': 10.0,
                'profit_target': 10.0
            },
            "past_challenges": past_challenges,
            "active_challenge": None,
            "needs_payment": True,
            "message": "Veuillez acheter un challenge pour commencer le trading"
        })

    # 4. Fetch Trades (Closed & Open)
    closed_trades = Trade.query.filter_by(user_id=user.id, status='CLOSED').order_by(desc(Trade.close_timestamp)).all()
    open_trades = Trade.query.filter_by(user_id=user.id, status='OPEN').order_by(desc(Trade.timestamp)).all()

    # 5. Process Closed Trades
    trade_data = []
    profit_amount = 0
    
    for t in closed_trades:
        profit_amount += t.pnl
        trade_data.append({
            "id": t.id,
            "ticker": t.symbol,
            "side": t.type,
            "entry_price": round(t.price, 2),
            "close_price": round(t.close_price, 2) if t.close_price else 0,
            "pnl": round(t.pnl, 2),
            "time": t.close_timestamp.timestamp() if t.close_timestamp else t.timestamp.timestamp()
        })

    # 6. Process Open Trades (Calculate Unrealized PnL)
    open_positions_data = []
    current_profit_open = 0
    
    for t in open_trades:
        price_data = FeedService.get_price_data(t.symbol)
        current_price = t.price 
        if price_data:
             current_price = price_data[-1]['close']
             
        if t.type == 'BUY':
            pnl = (current_price - t.price) * t.quantity
        else:
            pnl = (t.price - current_price) * t.quantity
            
        current_profit_open += pnl
        
        open_positions_data.append({
            "id": t.id,
            "ticker": t.symbol,
            "side": t.type,
            "entry_price": round(t.price, 2),
            "amount": round(t.quantity * t.price, 2),
            "current_price": round(current_price, 2),
            "pnl": round(pnl, 2),
            "time": t.timestamp.timestamp()
        })

    # 7. Calculate Key Metrics
    initial_capital = user.initial_capital if user.initial_capital and user.initial_capital > 0 else 100000
    current_balance = user.balance or initial_capital  # Balance only includes realized PnL + Init
    
    # Equity = Balance + Unrealized PnL
    # Ensure balance logic is consistent: if balance == initial + realized_pnl
    current_equity = current_balance + current_profit_open
    
    # Total Profit (Realized + Unrealized) vs Initial Capital
    total_profit_val = current_equity - initial_capital
    profit_percent = (total_profit_val / initial_capital) * 100

    # Drawdown (Loss from Initial Capital)
    drawdown = 0
    if current_equity < initial_capital:
        drawdown_val = initial_capital - current_equity
        drawdown = (drawdown_val / initial_capital) * 100

    # Win Rate, Best, Avg
    win_rate = 0
    best_trade = 0
    avg_trade = 0
    
    if closed_trades:
        winning_trades = [t for t in closed_trades if t.pnl > 0]
        win_rate = (len(winning_trades) / len(closed_trades)) * 100
        best_trade = max([t.pnl for t in closed_trades])
        avg_trade = sum([t.pnl for t in closed_trades]) / len(closed_trades)

    # 8. Weekly Performance
    weekly_performance = []
    today = datetime.now().date()
    days_map = {}
    
    # Initialize last 7 days
    fr_days = {'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mer', 'Thu': 'Jeu', 'Fri': 'Ven', 'Sat': 'Sam', 'Sun': 'Dim'}
    for i in range(6, -1, -1):
        day_date = today - timedelta(days=i)
        day_name = day_date.strftime("%a")
        fr_day = fr_days.get(day_name, day_name)
        days_map[day_date] = {"day": fr_day, "profit": 0, "trades": 0}

    for t in closed_trades:
        if t.close_timestamp:
            t_date = t.close_timestamp.date()
            if t_date in days_map:
                days_map[t_date]["profit"] += t.pnl
                days_map[t_date]["trades"] += 1
    
    weekly_performance = list(days_map.values())

    # 9. Risk Params
    risk_params = {
        'max_daily_loss': active_challenge.max_daily_loss if active_challenge else 5.0,
        'max_total_loss': active_challenge.max_total_loss if active_challenge else 10.0,
        'profit_target': active_challenge.profit_target if active_challenge else 10.0
    }

    return jsonify({
        "status": getattr(user, 'status', 'ACTIVE'),
        "balance": round(current_balance, 2),
        "initial_capital": initial_capital,
        "equity": round(current_equity, 2),
        "profit": round(total_profit_val, 2), 
        "profit_percent": round(profit_percent, 2),
        "drawdown": round(drawdown, 2),
        "trades": trade_data,
        "open_positions": open_positions_data,
        "win_rate": round(win_rate, 0),
        "best_trade": round(best_trade, 2),
        "avg_trade": round(avg_trade, 2),
        "weekly_performance": weekly_performance,
        "risk_params": risk_params,
        "past_challenges": past_challenges,
        "active_challenge": active_challenge.to_dict() if active_challenge else None
    })

def refresh_leaderboard():
    """
    Calculates top 10 traders based on performance and updates the Leaderboard table.
    """
    try:
        users = User.query.all()
        trader_stats = []

        for user in users:
            # Skip if no initial capital or invalid state
            if not user.initial_capital or user.initial_capital == 0:
                continue

            # Calculate Equity
            closed_trades = Trade.query.filter_by(user_id=user.id, status='CLOSED').all()
            total_pnl = sum(t.pnl for t in closed_trades)
            current_equity = user.initial_capital + total_pnl # Simplified for ranking

            profit_percent = ((current_equity - user.initial_capital) / user.initial_capital) * 100
            
            # Additional Stats
            win_rate = 0
            if closed_trades:
                winning = len([t for t in closed_trades if t.pnl > 0])
                win_rate = (winning / len(closed_trades)) * 100

            trader_stats.append({
                'user_id': user.id,
                'username': user.username,
                'profit_percent': round(profit_percent, 2),
                'total_trades': len(closed_trades),
                'win_rate': round(win_rate, 1),
                'status': user.status
            })

        # Sort by Profit % Descending
        trader_stats.sort(key=lambda x: x['profit_percent'], reverse=True)
        top_10 = trader_stats[:10]

        # Update DB
        Leaderboard.query.delete()
        
        for i, stat in enumerate(top_10):
            entry = Leaderboard(
                user_id=stat['user_id'],
                username=stat['username'],
                rank=i+1,
                profit_percent=stat['profit_percent'],
                total_trades=stat['total_trades'],
                win_rate=stat['win_rate'],
                status=stat['status'],
                snapshot_at=datetime.utcnow()
            )
            db.session.add(entry)
            
        db.session.commit()
        print("✅ Leaderboard Refreshed in SQL")

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error refreshing leaderboard: {e}")

@challenge_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """
    Get Top 10 Traders of the Month (Persistent SQL Leaderboard).
    Checks cache age; refreshes if older than 1 hour.
    """
    try:
        # Check if we have recent data (e.g., last 1 hour)
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        latest_entry = Leaderboard.query.order_by(Leaderboard.snapshot_at.desc()).first()
        
        if not latest_entry or latest_entry.snapshot_at < one_hour_ago:
            refresh_leaderboard()
            
        # Fetch Top 10 from SQL
        leaderboard_data = Leaderboard.query.order_by(Leaderboard.rank.asc()).all()
        result = [entry.to_dict() for entry in leaderboard_data]
        
        # If still empty (no users/trades), fallback to demo data
        if not result:
            return jsonify([
               {"rank": 1, "username": "AtlasTrader", "profit": 145.2, "trades": 42, "win_rate": 78, "status": "PASSED"},
               {"rank": 2, "username": "MarocBull", "profit": 98.5, "trades": 31, "win_rate": 65, "status": "ACTIVE"},
               {"rank": 3, "username": "CryptoKing", "profit": 87.1, "trades": 156, "win_rate": 55, "status": "PASSED"},
            ])
            
        return jsonify(result)

    except Exception as e:
        print(f"Leaderboard Error: {e}")
        return jsonify([])

@challenge_bp.route('/challenges/purchase', methods=['POST'])
def purchase_challenge():
    """
    Purchase a new challenge (resets user account).
    """
    data = request.json
    email = data.get('email')
    plan_name = data.get('plan_name', 'Pro')
    price = data.get('price', 100)
    payment_method = data.get('payment_method', 'card')
    
    if not email:
        return jsonify({'error': 'Missing email'}), 400
        
    user = User.query.filter(func.lower(User.username) == email.strip().lower()).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    try:
        # 1. Determine Initial Capital
        initial_capital = 100000
        if 'Starter' in plan_name:
            initial_capital = 5000
        elif 'Pro' in plan_name:
            initial_capital = 25000
        elif 'Elite' in plan_name:
            initial_capital = 100000
            
        if data.get('initial_capital'):
             initial_capital = float(data.get('initial_capital'))

        # 2. Archive previous active challenges
        existing_active = UserChallenge.query.filter_by(user_id=user.id, challenge_status='active').all()
        for active in existing_active:
            active.challenge_status = 'replaced'
            active.completed_at = datetime.utcnow()

        # 3. Create UserChallenge Record
        challenge = UserChallenge(
            user_id=user.id,
            plan_name=plan_name,
            plan_price=float(price),
            initial_capital=initial_capital,
            payment_method=payment_method,
            payment_status='completed',
            challenge_status='active',
            profit_target=10.0,
            max_daily_loss=5.0,
            max_total_loss=10.0
        )
        db.session.add(challenge)
        
        # 4. RESET USER ACCOUNT
        user.balance = initial_capital
        user.initial_capital = initial_capital
        user.daily_starting_equity = initial_capital
        user.status = 'ACTIVE'
        user.last_equity_reset = datetime.utcnow()
        user.failure_reason = None
        
        db.session.commit()
        
        return jsonify({
            "message": "Challenge purchased successfully",
            "challenge_id": challenge.id,
            "new_balance": initial_capital
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
