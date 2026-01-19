from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    users = User.query.all()
    for u in users:
        print(f"U:{u.username}|B:{u.balance}|S:{u.status}")
