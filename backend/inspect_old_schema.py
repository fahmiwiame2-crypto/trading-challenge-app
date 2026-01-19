import sqlite3
import os
import json

db_path = os.path.join('instance', 'tradesense_v2.db')
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

try:
    # Check 'lesson' schema
    print("\n--- SCHEMA: lesson ---")
    cursor.execute("PRAGMA table_info(lesson)")
    for col in cursor.fetchall():
        print(dict(col))


except Exception as e:
    print(f"Error: {e}")

conn.close()
