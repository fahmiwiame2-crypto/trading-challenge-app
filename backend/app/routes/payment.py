"""
Payment Routes - Handle payment processing and challenge activation
"""
from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import uuid
from ..models import User, UserChallenge, Payment, SystemConfig, db

payment_bp = Blueprint('payment', __name__)

# Plan configurations
PLANS = {
    'starter': {'price': 20, 'capital': 5000, 'name': 'Starter'},
    'pro': {'price': 50, 'capital': 25000, 'name': 'Pro'},
    'elite': {'price': 100, 'capital': 100000, 'name': 'Elite'}
}

@payment_bp.route('/purchase', methods=['POST'])
def process_purchase():
    """
    Process a challenge purchase.
    Creates UserChallenge entry and Payment record.
    """
    try:
        data = request.json
        raw_plan = data.get('plan') or data.get('plan_name') or data.get('plan_id')
        plan_id = (raw_plan or '').lower()
        raw_method = data.get('method') or data.get('payment_method') or 'card'
        method = (raw_method or 'card').lower()
        email = data.get('email')
        amount = data.get('amount') or data.get('price')
        customer_info = data.get('customerInfo', {})
        
        print(f"Processing purchase: plan={plan_id}, method={method}, email={email}")
        print(f"DEBUG: Full request data: {data}")
        print(f"DEBUG: Available plans: {list(PLANS.keys())}")
        
        # Validate plan
        if plan_id not in PLANS:
            return jsonify({"message": "Plan invalide"}), 400
        
        # Validate email
        if not email:
            return jsonify({"message": "Email requis pour le paiement"}), 400
        
        plan = PLANS[plan_id]
        
        # Find existing user (must already be registered / logged in)
        from sqlalchemy import func
        user = User.query.filter(func.lower(User.username) == email.strip().lower()).first()
        
        if not user:
            return jsonify({"message": "Utilisateur introuvable pour ce paiement. Veuillez vous inscrire et vous connecter."}), 404
        
        # Generate transaction ID
        transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        
        # Simulate payment processing (Mock Gateway)
        # In production, integrate with real payment gateway here
        payment_success = True  # Mock: always succeeds
        
        if not payment_success:
            return jsonify({"message": "Échec du paiement"}), 400
        
        # IMPORTANT: Archive any existing active challenges for this user
        existing_challenges = UserChallenge.query.filter_by(
            user_id=user.id, 
            challenge_status='active'
        ).all()
        
        for old in existing_challenges:
            old.challenge_status = 'replaced'
            old.completed_at = datetime.utcnow()
            print(f"Archived challenge {old.id} for user {user.id}")

        # Create UserChallenge entry
        challenge = UserChallenge(
            user_id=user.id,
            plan_name=plan['name'],
            plan_price=plan['price'],
            initial_capital=plan['capital'],
            payment_method=method,
            payment_status='completed',
            transaction_id=transaction_id,
            challenge_status='active',
            profit_target=10.0,
            max_daily_loss=5.0,
            max_total_loss=10.0,
            expires_at=datetime.utcnow() + timedelta(days=30)  # 30 days to complete
        )
        db.session.add(challenge)
        
        # Create Payment record
        payment = Payment(
            user_id=user.id,
            amount=plan['price'],
            currency='USD',
            payment_method=method,
            status='completed',
            transaction_id=transaction_id,
            completed_at=datetime.utcnow(),
            payment_metadata={
                'plan': plan_id,
                'customer_info': customer_info
            }
        )
        db.session.add(payment)
        
        # Update user balance to match plan capital
        user.balance = plan['capital']
        user.initial_capital = plan['capital']
        user.daily_starting_equity = plan['capital']
        user.status = 'ACTIVE'
        
        db.session.commit()
        
        # Link payment to challenge
        payment.challenge_id = challenge.id
        db.session.commit()
        
        print(f"Challenge created: ID={challenge.id}, User={user.id}, Plan={plan['name']}")
        
        return jsonify({
            "message": "Paiement réussi! Votre challenge est activé.",
            "success": True,
            "challenge": challenge.to_dict(),
            "transaction_id": transaction_id
        })
        
    except Exception as e:
        print(f"Payment error: {e}")
        db.session.rollback()
        return jsonify({"message": f"Erreur: {str(e)}"}), 500


@payment_bp.route('/challenges/active', methods=['GET'])
def get_active_challenge():
    """Get user's active challenge"""
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email required"}), 400
    
    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Get active challenge
    challenge = UserChallenge.query.filter_by(
        user_id=user.id, 
        challenge_status='active'
    ).order_by(UserChallenge.created_at.desc()).first()
    
    if not challenge:
        return jsonify({"message": "No active challenge", "has_challenge": False}), 200
    
    return jsonify({
        "has_challenge": True,
        "challenge": challenge.to_dict()
    })


@payment_bp.route('/challenges/history', methods=['GET'])
def get_challenge_history():
    """Get user's challenge history"""
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email required"}), 400
    
    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    challenges = UserChallenge.query.filter_by(user_id=user.id).order_by(
        UserChallenge.created_at.desc()
    ).all()
    
    return jsonify({
        "challenges": [c.to_dict() for c in challenges]
    })


@payment_bp.route('/payments/history', methods=['GET'])
def get_payment_history():
    """Get user's payment history"""
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email required"}), 400
    
    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    payments = Payment.query.filter_by(user_id=user.id).order_by(
        Payment.created_at.desc()
    ).all()
    
    return jsonify({
        "payments": [p.to_dict() for p in payments]
    })


# =============================================
# PayPal Configuration Routes (Admin Only)
# =============================================

@payment_bp.route('/config/paypal', methods=['GET'])
def get_paypal_config():
    """Get PayPal configuration (admin only)"""
    # In production, add authentication check here
    
    paypal_configs = SystemConfig.query.filter(
        SystemConfig.config_key.like('paypal_%')
    ).all()
    
    return jsonify({
        "configs": [c.to_dict(include_secret=False) for c in paypal_configs]
    })


@payment_bp.route('/config/paypal', methods=['POST'])
def save_paypal_config():
    """Save PayPal configuration (admin only)"""
    try:
        data = request.json
        
        configs_to_save = [
            {'key': 'paypal_client_id', 'value': data.get('client_id', ''), 'desc': 'PayPal Client ID', 'secret': False},
            {'key': 'paypal_client_secret', 'value': data.get('client_secret', ''), 'desc': 'PayPal Client Secret', 'secret': True},
            {'key': 'paypal_mode', 'value': data.get('mode', 'sandbox'), 'desc': 'PayPal Mode (sandbox/live)', 'secret': False},
            {'key': 'paypal_email', 'value': data.get('email', ''), 'desc': 'PayPal Business Email', 'secret': False},
        ]
        
        for config in configs_to_save:
            existing = SystemConfig.query.filter_by(config_key=config['key']).first()
            if existing:
                existing.config_value = config['value']
                existing.updated_at = datetime.utcnow()
            else:
                new_config = SystemConfig(
                    config_key=config['key'],
                    config_value=config['value'],
                    description=config['desc'],
                    is_secret=config['secret']
                )
                db.session.add(new_config)
        
        db.session.commit()
        
        return jsonify({
            "message": "Configuration PayPal sauvegardée",
            "success": True
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Erreur: {str(e)}"}), 500


@payment_bp.route('/config/all', methods=['GET'])
def get_all_configs():
    """Get all system configurations (admin only)"""
    configs = SystemConfig.query.all()
    return jsonify({
        "configs": [c.to_dict(include_secret=False) for c in configs]
    })
