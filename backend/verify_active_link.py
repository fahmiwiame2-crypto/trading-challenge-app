import pymysql
import os
from dotenv import load_dotenv
from urllib.parse import urlparse
import uuid

load_dotenv()

def verify_active_link():
    print("\n[100% VERIFICATION] Testing Active Read/Write Link...")
    
    db_url = os.environ.get('DATABASE_URL', '')
    p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
    
    try:
        conn = pymysql.connect(
            host=p.hostname, user=p.username, password=p.password,
            port=p.port or 3306, database=p.path.lstrip('/'),
            charset='utf8mb4'
        )
        cursor = conn.cursor()
        
        # 1. READ CHECK
        print("   [1/3] Reading existing data...")
        cursor.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()[0]
        if count > 0:
            print(f"      SUCCESS: Found {count} existing users.")
        else:
            print("      WARNING: User table is empty (but read worked).")

        # 2. WRITE CHECK
        print("   [2/3] Writing new data (Live Test)...")
        test_user = f"LinkCheck_{uuid.uuid4().hex[:8]}"
        sql = "INSERT INTO users (username, full_name, email, role) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (test_user, "Link Check User", f"{test_user}@test.com", "TEST"))
        conn.commit()
        print(f"      SUCCESS: Created temporary user '{test_user}'.")

        # 3. VERIFY WRITE
        print("   [3/3] Verifying data persistence...")
        cursor.execute("SELECT id, username FROM users WHERE username = %s", (test_user,))
        result = cursor.fetchone()
        
        if result and result[1] == test_user:
            print(f"      SUCCESS: Retrieved user '{test_user}' from database.")
            print("      ✅ PLATFORM IS 100% LINKED TO MYSQL.")
        else:
            print("      FAIL: Could not retrieve the just-created user.")

        # CLEANUP
        cursor.execute("DELETE FROM users WHERE username = %s", (test_user,))
        conn.commit()
        print("      (Cleaned up test user)")
        
        conn.close()
        return True

    except Exception as e:
        print(f"\n[CRITICAL ERROR] Link Test Failed: {e}")
        return False

if __name__ == "__main__":
    verify_active_link()
