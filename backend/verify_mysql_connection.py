import os
import pymysql
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

def verify_connection():
    db_url = os.environ.get('DATABASE_URL', '')
    
    if not db_url or 'mysql' not in db_url:
        print("❌ DATABASE_URL non configuré pour MySQL dans .env")
        return False

    try:
        # Parse connection string
        p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
        user = p.username
        password = p.password
        host = p.hostname
        port = p.port or 3306
        dbname = p.path.lstrip('/')

        print(f"[SEARCH] Test de connexion a MySQL ({host}:{port})...")
        
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=port,
            database=dbname,
            charset='utf8mb4'
        )
        
        print(f"[OK] Succes ! Connecte a la base '{dbname}' en tant que '{user}'.")
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"[DATA] Version MySQL : {version[0]}")
            
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print(f"[STATS] Nombre de tables trouvees : {len(tables)}")
            for t in tables:
                print(f"   * {t[0]}")
                
        connection.close()
        return True
    except Exception as e:
        print(f"[ERROR] Erreur de connexion : {e}")
        return False

if __name__ == "__main__":
    verify_connection()
