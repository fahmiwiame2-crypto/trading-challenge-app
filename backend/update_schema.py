import pymysql
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

def add_column():
    db_url = os.environ.get('DATABASE_URL', '')
    p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
    
    connection = pymysql.connect(
        host=p.hostname,
        user=p.username,
        password=p.password,
        port=p.port or 3306,
        database=p.path.lstrip('/'),
        charset='utf8mb4'
    )
    
    cursor = connection.cursor()
    print("Altering system_config table...")
    try:
        cursor.execute("ALTER TABLE system_config ADD COLUMN is_secret BOOLEAN DEFAULT FALSE")
        print("Column 'is_secret' added successfully.")
    except Exception as e:
        print(f"Error: {e}")
            
    connection.commit()
    connection.close()

if __name__ == "__main__":
    add_column()
