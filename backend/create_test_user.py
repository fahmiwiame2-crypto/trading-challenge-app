from app import create_app, db
from app.models import User

app = create_app()
with app.app_context():
    # Check if user exists
    user = User.query.filter_by(username='test@test.com').first()
    if not user:
        # Create new user
        user = User(username='test@test.com', balance=100000.0)
        db.session.add(user)
        db.session.commit()
        print(f"User created: {user.username}, balance: {user.balance}")
    else:
        print(f"User already exists: {user.username}, balance: {user.balance}")
