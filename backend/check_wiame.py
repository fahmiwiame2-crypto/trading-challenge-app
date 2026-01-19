from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    # Try 'wiame' or similar
    users = User.query.filter(User.username.like('%wiame%')).all()
    if not users:
        print("No user found with name like wiame")
    for u in users:
        print(f"U:{u.username}|B:{u.balance}|S:{u.status}|R:{u.failure_reason}")
