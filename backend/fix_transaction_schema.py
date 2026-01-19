import os
import pymysql
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

def fix_schema():
    db_url = os.environ.get('DATABASE_URL', '')
    if not db_url:
        print("DATABASE_URL not found")
        return

    p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
    
    conn = pymysql.connect(
        host=p.hostname, user=p.username, password=p.password,
        port=p.port or 3306, database=p.path.lstrip('/'),
        charset='utf8mb4'
    )
    
    try:
        with conn.cursor() as cursor:
            print("Checking transactions table...")
            cursor.execute("DESCRIBE transactions")
            columns = [col[0] for col in cursor.fetchall()]
            
            if 'amount' not in columns:
                print("Adding 'amount' column to transactions table...")
                cursor.execute("ALTER TABLE transactions ADD COLUMN amount FLOAT NOT NULL AFTER type")
                conn.commit()
                print("Column added successfully.")
            else:
                print("'amount' column already exists.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    fix_schema()
