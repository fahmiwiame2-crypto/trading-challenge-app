import sqlite3
import os

db_path = os.path.join('instance', 'tradesense_v2.db')

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # List Tables
    print("\n--- TABLES ---")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    for t in tables:
        print(t[0])
        # Count rows
        cursor.execute(f"SELECT count(*) FROM {t[0]}")
        count = cursor.fetchone()[0]
        print(f"  Count: {count}")

except Exception as e:
    print(f"Error: {e}")

conn.close()
