from app import create_app, db
from app.models import (
    User, UserChallenge, Payment, SystemConfig, 
    TradingFloor, RiskAlert, MarketSignal, ChatMessage,
    Quiz, Question, UserProgress, Certificate
)  
from datetime import datetime, timedelta
import random

app = create_app()

def seed_everything():
    with app.app_context():
        print("[START] Seeding remaining tables...")
        
        users = User.query.all()
        if not users:
            print("No users found. Run seed_users.py first.")
            return

        # 1. System Config
        print("   -> System Config")
        configs = [
            ('paypal_client_id', 'AX_sb_...', 'PayPal Client ID'),
            ('paypal_secret', 'EI_xb_...', 'PayPal Secret', True),
            ('max_daily_loss_percent', '5', 'Max daily loss %'),
        ]
        for key, val, desc, *secret in configs:
             if not SystemConfig.query.filter_by(config_key=key).first():
                 sc = SystemConfig(config_key=key, config_value=val, description=desc, is_secret=(secret[0] if secret else False))
                 db.session.add(sc)
        
        # 2. User Challenges & Payments (Crucial for "My Challenges")
        print("   -> User Challenges & Payments")
        plans = [
            ('Starter', 49.99, 10000), 
            ('Pro', 199.99, 50000), 
            ('Elite', 499.99, 100000)
        ]
        
        for user in users:
            # Give each user 1-2 challenges
            for _ in range(random.randint(1, 2)):
                plan_name, price, capital = random.choice(plans)
                
                # Active Challenge
                challenge = UserChallenge(
                    user_id=user.id,
                    plan_name=plan_name,
                    plan_price=price,
                    initial_capital=capital,
                    payment_method='card',
                    payment_status='completed',
                    challenge_status=random.choice(['active', 'active', 'passed', 'failed']),
                    transaction_id=f"txn_{random.randint(10000,99999)}",
                    profit_target=10.0,
                    max_daily_loss=5.0
                )
                db.session.add(challenge)
                db.session.flush()
                
                # Associated Payment
                payment = Payment(
                    user_id=user.id,
                    challenge_id=challenge.id,
                    amount=price,
                    payment_method='card',
                    status='completed',
                    transaction_id=challenge.transaction_id
                )
                db.session.add(payment)

        # 3. Trading Floors
        print("   -> Trading Floors")
        if not TradingFloor.query.first():
            floors = [
                ('Forex Elites', 'Dedicated to EURUSD and GBPUSD scalpers'),
                ('Crypto Whales', 'BTC and ETH discussion only'),
                ('Gold Rush', 'XAUUSD analysis and signals')
            ]
            for name, desc in floors:
                tf = TradingFloor(name=name, description=desc, is_active=True)
                db.session.add(tf)

        # 4. Market Signals
        print("   -> Market Signals")
        signals = [
            ('EURUSD', 'BUY', 1.0850, 1.0790, 'Strong support bounce observed on 4H.'),
            ('BTCUSD', 'SELL', 42000, 45000, 'Rejection from key resistance level.'),
            ('XAUUSD', 'HOLD', 2025, 2000, 'Waiting for CPI data.')
        ]
        for sym, type_, target, sl, analysis in signals:
            ms = MarketSignal(
                symbol=sym, signal_type=type_, price_target=target, 
                stop_loss=sl, analysis=analysis, confidence=random.uniform(70, 95)
            )
            db.session.add(ms)

        # 5. Risk Alerts
        print("   -> Risk Alerts")
        for user in users[:3]:
            ra = RiskAlert(
                user_id=user.id,
                alert_type='drawdown_warning',
                message='You are approaching your daily loss limit.',
                severity='WARNING'
            )
            db.session.add(ra)

        # 6. Chat Messages (AI history)
        print("   -> Chat Messages")
        for user in users[:3]:
            msg = ChatMessage(
                user_id=user.id,
                message="How do I calculate position size?",
                response="To calculate position size, determine your risk per trade..."
            )
            db.session.add(msg)
            
        db.session.commit()
        print("DONE! All tables seeded.")

if __name__ == "__main__":
    seed_everything()
