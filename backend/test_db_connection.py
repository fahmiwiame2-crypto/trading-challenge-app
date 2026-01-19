import os
import sys
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    db_url = os.environ.get('DATABASE_URL')
    print(f"TESTING: {db_url.split('@')[-1]}")
    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            print("STATUS: SUCCESS")
    except Exception as e:
        print(f"ERROR: {str(e)[:200]}")

if __name__ == "__main__":
    test_connection()
