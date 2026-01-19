from app import create_app, db
from app.models import Trade, User

app = create_app()

with app.app_context():
    u = User.query.filter_by(username='demo@tradesense.ai').first()
    if u:
        trades = Trade.query.filter_by(user_id=u.id).all()
        print(f"Found {len(trades)} trades for user {u.id}.")
        for t in trades:
            print(f"ID:{t.id}|SYM:{t.symbol}|TYPE:{t.type}|STATUS:{t.status}|QTY:{t.quantity}|PRICE:{t.price}")
    else:
        print("User not found")
