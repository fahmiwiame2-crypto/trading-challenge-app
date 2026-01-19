import sqlite3
import os

def check_db(db_path):
    if not os.path.exists(db_path):
        print(f"--- {db_path} not found ---")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [t[0] for t in cursor.fetchall()]
        print(f"\n--- {db_path} ---")
        print(f"Tables: {tables}")
        
        if 'courses' in tables:
            cursor.execute("SELECT COUNT(*) FROM courses")
            count = cursor.fetchone()[0]
            print(f"Courses count: {count}")
            if count > 0:
                cursor.execute("SELECT id, title, category FROM courses")
                for c in cursor.fetchall():
                    print(f"  - [{c[0]}] {c[1]} ({c[2]})")
        
        if 'lessons' in tables:
            cursor.execute("SELECT COUNT(*) FROM lessons")
            print(f"Lessons count: {cursor.fetchone()[0]}")
            
        conn.close()
    except Exception as e:
        print(f"Error checking {db_path}: {e}")

if __name__ == "__main__":
    check_db('backend/instance/tradesense.db')
    check_db('backend/instance/tradesense_v2.db')
