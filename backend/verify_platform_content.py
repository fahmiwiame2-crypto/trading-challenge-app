import os
import pymysql
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

def verify_content():
    db_url = os.environ.get('DATABASE_URL', '')
    
    if not db_url or 'mysql' not in db_url:
        print("[ERROR] DATABASE_URL missing or invalid.")
        return False

    try:
        # Parse connection string
        p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
        user = p.username
        password = p.password
        host = p.hostname
        port = p.port or 3306
        dbname = p.path.lstrip('/')

        print(f"[INFO] Connecting to database '{dbname}' on {host}...")
        
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=port,
            database=dbname,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Count Users
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            print(f"[SUCCESS] Found {user_count} users in the database.")
            
            if user_count > 0:
                 cursor.execute("SELECT username, balance FROM users LIMIT 5")
                 print("   Sample Users:")
                 for u in cursor.fetchall():
                     print(f"   - {u[0]}: ${u[1]:,.2f}")

            # Count Trades
            cursor.execute("SELECT COUNT(*) FROM trades")
            trade_count = cursor.fetchone()[0]
            print(f"[SUCCESS] Found {trade_count} trades in the database.")
            
            # Check other key tables
            other_tables = ['courses', 'lessons', 'modules']
            for table in other_tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"[INFO] Table '{table}' has {count} entries.")

        connection.close()
        return True
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return False

if __name__ == "__main__":
    verify_content()
