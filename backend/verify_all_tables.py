import pymysql
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

def verify_all():
    db_url = os.environ.get('DATABASE_URL', '')
    p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
    
    conn = pymysql.connect(
        host=p.hostname, user=p.username, password=p.password,
        port=p.port or 3306, database=p.path.lstrip('/'),
        charset='utf8mb4'
    )
    
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = [t[0] for t in cursor.fetchall()]
    
    print(f"\n[VERIFICATION] Database: {p.path.lstrip('/')}")
    print("-" * 50)
    print(f"{'TABLE NAME':<30} | {'ROWS':<10}")
    print("-" * 50)
    
    empty_tables = []
    
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"{table:<30} | {count:<10}")
        if count == 0:
            empty_tables.append(table)
            
    print("-" * 50)
    if not empty_tables:
        print("SUCCESS: All tables have data (or at least 0 is expected for some optional ones).")
    else:
        print(f"Empty tables: {', '.join(empty_tables)}")
        
    conn.close()

if __name__ == "__main__":
    verify_all()
