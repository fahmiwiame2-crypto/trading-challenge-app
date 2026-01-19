"""
Admin Routes - User management and database seeding
"""
from flask import Blueprint, jsonify, request
from ..models import User, Trade, db
from datetime import datetime
import random

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users', methods=['GET'])
def get_users():
    """Get all users for admin panel"""
    try:
        users = User.query.all()
        return jsonify([{
            "id": u.id,
            "username": u.username,
            "email": u.username,  # username is used as email
            "status": u.status or "ACTIVE",
            "balance": round(u.balance, 2) if u.balance else 0,
            "initial_capital": u.initial_capital or 100000
        } for u in users])
    except Exception as e:
        print(f"❌ Error fetching users: {e}")
        return jsonify([])

@admin_bp.route('/seed', methods=['POST'])
def seed_db():
    """Seed the database with test users and trades"""
    try:
        # Create demo users
        demo_users = [
            {'username': 'CryptoKing', 'balance': 112500, 'status': 'PASSED'},
            {'username': 'AtlasTrader', 'balance': 108000, 'status': 'ACTIVE'},
            {'username': 'WhaleHunter', 'balance': 95000, 'status': 'FAILED'},
            {'username': 'MarketMaster', 'balance': 115000, 'status': 'PASSED'},
            {'username': 'TradingPro', 'balance': 102000, 'status': 'ACTIVE'},
            {'username': 'BullRunner', 'balance': 98500, 'status': 'ACTIVE'},
            {'username': 'DiamondHands', 'balance': 88000, 'status': 'FAILED'},
            {'username': 'MoonShot', 'balance': 107500, 'status': 'ACTIVE'},
        ]
        
        created_count = 0
        for user_data in demo_users:
            # Check if user already exists
            existing = User.query.filter_by(username=user_data['username']).first()
            if not existing:
                user = User(
                    username=user_data['username'],
                    balance=user_data['balance'],
                    status=user_data['status'],
                    initial_capital=100000,
                    daily_starting_equity=user_data['balance'],
                    last_equity_reset=datetime.utcnow()
                )
                db.session.add(user)
                created_count += 1
                
                # Create some demo trades for this user
                db.session.flush()  # Get the user ID
                
                symbols = ['BTC-USD', 'ETH-USD', 'AAPL', 'TSLA', 'IAM', 'ATW']
                for i in range(random.randint(5, 15)):
                    symbol = random.choice(symbols)
                    trade_type = random.choice(['BUY', 'SELL'])
                    quantity = round(random.uniform(0.1, 2.0), 2)
                    
                    if 'BTC' in symbol:
                        price = random.uniform(40000, 50000)
                    elif 'ETH' in symbol:
                        price = random.uniform(2000, 3000)
                    elif symbol in ['IAM', 'ATW']:
                        price = random.uniform(80, 200)
                    else:
                        price = random.uniform(100, 300)
                    
                    pnl = random.uniform(-500, 1000)
                    
                    trade = Trade(
                        user_id=user.id,
                        symbol=symbol,
                        quantity=quantity,
                        price=round(price, 2),
                        type=trade_type,
                        status='CLOSED',
                        pnl=round(pnl, 2),
                        close_price=round(price + (pnl / quantity), 2),
                        close_timestamp=datetime.utcnow()
                    )
                    db.session.add(trade)
        
        db.session.commit()
        
        print(f"✅ Seed: Created {created_count} users with trades")
        return jsonify({
            "message": f"Base de données initialisée! {created_count} utilisateurs créés.",
            "success": True,
            "created": created_count
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Seed error: {e}")
        return jsonify({"message": f"Erreur: {str(e)}", "success": False}), 500

@admin_bp.route('/admin/update-status', methods=['POST'])
def update_status():
    """Update user status (ACTIVE, PASSED, FAILED)"""
    try:
        data = request.json
        email = data.get('email')
        new_status = data.get('status')
        
        if not email or not new_status:
            return jsonify({"message": "Email et status requis"}), 400
        
        if new_status not in ['ACTIVE', 'PASSED', 'FAILED']:
            return jsonify({"message": "Status invalide. Utilisez ACTIVE, PASSED ou FAILED"}), 400
        
        # Find user by email/username
        user = User.query.filter_by(username=email).first()
        if not user:
            return jsonify({"message": f"Utilisateur {email} non trouvé"}), 404
        
        old_status = user.status
        user.status = new_status
        
        # Reset balance if setting to ACTIVE
        if new_status == 'ACTIVE':
            user.failure_reason = None
            # Optionally reset balance
            # user.balance = user.initial_capital
        elif new_status == 'FAILED':
            user.failure_reason = "Manuellement échoué par admin"
        
        db.session.commit()
        
        print(f"✅ Admin: User {email} status changed from {old_status} to {new_status}")
        return jsonify({
            "message": f"Statut de {email} mis à jour: {old_status} → {new_status}",
            "success": True,
            "user": {
                "email": email,
                "old_status": old_status,
                "new_status": new_status
            }
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Update status error: {e}")
        return jsonify({"message": f"Erreur: {str(e)}"}), 500

@admin_bp.route('/admin/reset-user', methods=['POST'])
def reset_user():
    """Reset a user's challenge (balance and status)"""
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({"message": "Email requis"}), 400
        
        user = User.query.filter_by(username=email).first()
        if not user:
            return jsonify({"message": f"Utilisateur {email} non trouvé"}), 404
        
        # Reset all values
        user.status = 'ACTIVE'
        user.balance = user.initial_capital or 100000
        user.daily_starting_equity = user.initial_capital or 100000
        user.last_equity_reset = datetime.utcnow()
        user.failure_reason = None
        
        db.session.commit()
        
        print(f"✅ Admin: User {email} reset successfully")
        return jsonify({
            "message": f"Utilisateur {email} réinitialisé avec succès",
            "success": True
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erreur: {str(e)}"}), 500

@admin_bp.route('/admin/delete-user', methods=['POST'])
def delete_user():
    """Delete a user and their trades"""
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({"message": "Email requis"}), 400
        
        user = User.query.filter_by(username=email).first()
        if not user:
            return jsonify({"message": f"Utilisateur {email} non trouvé"}), 404
        
        # Delete user's trades first
        Trade.query.filter_by(user_id=user.id).delete()
        
        # Delete user
        db.session.delete(user)
        db.session.commit()
        
        print(f"✅ Admin: User {email} deleted")
        return jsonify({
            "message": f"Utilisateur {email} supprimé",
            "success": True
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erreur: {str(e)}"}), 500

@admin_bp.route('/config/paypal', methods=['GET'])
def get_paypal_config():
    """Get PayPal configuration"""
    try:
        from ..models import Config
        configs = Config.query.filter(Config.config_key.like('paypal_%')).all()
        return jsonify({
            "configs": [
                {"config_key": c.config_key, "config_value": c.config_value} 
                for c in configs
            ]
        })
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

@admin_bp.route('/config/paypal', methods=['POST'])
def save_paypal_config():
    """Save PayPal configuration"""
    try:
        from ..models import Config
        data = request.json
        
        # Keys to save
        keys = ['client_id', 'client_secret', 'mode', 'email']
        
        for key in keys:
            if key in data:
                full_key = f'paypal_{key}'
                config_item = Config.query.filter_by(config_key=full_key).first()
                
                if config_item:
                    config_item.config_value = data[key]
                    config_item.updated_at = datetime.utcnow()
                else:
                    new_config = Config(config_key=full_key, config_value=data[key])
                    db.session.add(new_config)
                    
        db.session.commit()
        return jsonify({"message": "Configuration saved", "success": True})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error: {str(e)}"}), 500
