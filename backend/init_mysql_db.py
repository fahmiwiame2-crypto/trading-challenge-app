import os
import pymysql
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

def create_database():
    db_url = os.environ.get('DATABASE_URL', '')
    
    if not db_url or 'mysql' not in db_url:
        print("❌ DATABASE_URL non configuré pour MySQL dans .env")
        return False

    try:
        # Parse connection string
        # format: mysql+pymysql://user:pass@host:port/dbname
        p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
        user = p.username
        password = p.password
        host = p.hostname
        port = p.port or 3306
        dbname = p.path.lstrip('/')

        print(f"[INFO] Connexion a MySQL ({host}:{port}) en tant que '{user}'...")
        
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=port
        )
        cursor = connection.cursor()
        
        print(f"[PROCESS] Creation de la base de donnees '{dbname}'...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {dbname} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"[OK] Base de donnees '{dbname}' creee (ou existait deja) !")
        
        connection.close()
        return True
    except Exception as e:
        print(f"[ERROR] Erreur : {e}")
        print("Assurez-vous que MySQL est lance et que les identifiants dans .env sont corrects.")
        return False

if __name__ == "__main__":
    create_database()
