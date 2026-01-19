from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    u = User.query.order_by(User.id.desc()).first()
    if u:
        print(f"LAST USER: ID:{u.id}|NAME:{repr(u.username)}|BAL:{u.balance}")
    else:
        print("No users found")
