
from app import create_app, db
from app.models import Config
from dotenv import load_dotenv
import os

load_dotenv('backend/.env')

app = create_app()

with app.app_context():
    # Helper to check if table exists
    engine = db.engine
    from sqlalchemy import inspect
    inspector = inspect(engine)
    
    if not inspector.has_table('configs'):
        print("Creating 'configs' table...")
        Config.__table__.create(engine)
        print("Table 'configs' created successfully.")
    else:
        print("Table 'configs' already exists.")
