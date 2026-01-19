from app import create_app, db
from app.models import User, Trade
from datetime import datetime

app = create_app()
with app.app_context():
    # Get a user
    user = User.query.filter_by(username='test@test.com').first()
    if not user:
        print("User not found. Creating user...")
        user = User(username='test@test.com', balance=100000.0)
        db.session.add(user)
        db.session.commit()
    
    print(f"\n=== User Info ===")
    print(f"Username: {user.username}")
    print(f"Balance: ${user.balance:.2f}")
    
    # Check trades
    open_trades = Trade.query.filter_by(user_id=user.id, status='OPEN').all()
    closed_trades = Trade.query.filter_by(user_id=user.id, status='CLOSED').all()
    
    print(f"\n=== Open Trades ({len(open_trades)}) ===")
    for trade in open_trades:
        print(f"ID: {trade.id}, {trade.type} {trade.symbol}, Qty: {trade.quantity:.4f}, Price: ${trade.price:.2f}")
    
    print(f"\n=== Closed Trades ({len(closed_trades)}) ===")
    for trade in closed_trades:
        pnl_display = f"+${trade.pnl:.2f}" if trade.pnl >= 0 else f"-${abs(trade.pnl):.2f}"
        print(f"ID: {trade.id}, {trade.type} {trade.symbol}, Entry: ${trade.price:.2f}, Close: ${trade.close_price:.2f}, P&L: {pnl_display}")
    
    # Create a test trade
    print(f"\n=== Creating Test Trade ===")
    test_trade = Trade(
        user_id=user.id,
        symbol='BTC-USD',
        quantity=0.1,
        price=50000.0,
        type='BUY',
        timestamp=datetime.utcnow(),
        status='OPEN'
    )
    user.balance -= (test_trade.quantity * test_trade.price)
    db.session.add(test_trade)
    db.session.commit()
    print(f"Created trade ID {test_trade.id}")
    print(f"New balance: ${user.balance:.2f}")
    
    # Close the test trade with profit
    print(f"\n=== Closing Test Trade with Profit ===")
    close_price = 52000.0  # $2000 profit per coin
    pnl = (close_price - test_trade.price) * test_trade.quantity
    initial_amount = test_trade.quantity * test_trade.price
    
    user.balance += initial_amount + pnl
    test_trade.status = 'CLOSED'
    test_trade.close_price = close_price
    test_trade.close_timestamp = datetime.utcnow()
    test_trade.pnl = round(pnl, 2)
    
    db.session.commit()
    
    print(f"Trade closed!")
    print(f"Entry: ${test_trade.price:.2f}, Exit: ${close_price:.2f}")
    print(f"P&L: ${pnl:.2f}")
    print(f"Final balance: ${user.balance:.2f}")
    
    # Expected: 100000 - 5000 (open) + 5000 (close) + 200 (profit) = 100200
    print(f"\n=== Summary ===")
    print(f"Initial capital: $100,000.00")
    print(f"Current balance: ${user.balance:.2f}")
    print(f"Total profit: ${user.balance - 100000:.2f}")
