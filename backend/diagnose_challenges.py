"""
Script de diagnostic pour les challenges
"""
import os
from urllib.parse import urlparse
import pymysql
from dotenv import load_dotenv

load_dotenv()

# Load from .env
db_url = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:wiamefahmi@127.0.0.1:3306/tradesense')
print(f"Using DATABASE_URL from .env")

def get_connection():
    # Try with password first
    try:
        p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
        conn = pymysql.connect(
            host=p.hostname, 
            user=p.username, 
            password=p.password, 
            port=p.port or 3306,
            database=p.path.lstrip('/')
        )
        print("Connected with password")
        return conn
    except Exception as e:
        print(f"Connection with password failed: {e}")
    
    # Try without password
    try:
        p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
        conn = pymysql.connect(
            host=p.hostname, 
            user=p.username, 
            password='',  # Empty password
            port=p.port or 3306,
            database=p.path.lstrip('/')
        )
        print("Connected without password")
        return conn
    except Exception as e:
        print(f"Connection without password also failed: {e}")
        return None

conn = get_connection()
if not conn:
    print("Could not connect to database!")
    exit(1)

cursor = conn.cursor()

print("\n" + "="*60)
print("1. ALL USERS IN DATABASE")
print("="*60)
cursor.execute("SELECT id, username, balance, status, initial_capital FROM users")
users = cursor.fetchall()
for u in users:
    print(f"  ID={u[0]}, Email='{u[1]}', Balance={u[2]}, Status={u[3]}, InitialCapital={u[4]}")

print("\n" + "="*60)
print("2. ALL USER_CHALLENGES IN DATABASE")
print("="*60)
cursor.execute("""
    SELECT id, user_id, plan_name, challenge_status, payment_status, initial_capital, created_at 
    FROM user_challenges 
    ORDER BY created_at DESC
""")
challenges = cursor.fetchall()
if not challenges:
    print("  *** NO CHALLENGES FOUND IN DATABASE ***")
else:
    for c in challenges:
        print(f"  ID={c[0]}, UserID={c[1]}, Plan='{c[2]}', Status='{c[3]}', PaymentStatus='{c[4]}', Capital={c[5]}, Created={c[6]}")

print("\n" + "="*60)
print("3. ACTIVE CHALLENGES SPECIFICALLY")
print("="*60)
cursor.execute("SELECT * FROM user_challenges WHERE challenge_status = 'active'")
active = cursor.fetchall()
if not active:
    print("  *** NO ACTIVE CHALLENGES ***")
else:
    for a in active:
        print(f"  {a}")

print("\n" + "="*60)
print("4. MATCHING USERS TO CHALLENGES")
print("="*60)
cursor.execute("""
    SELECT u.username, uc.plan_name, uc.challenge_status, uc.initial_capital
    FROM users u
    LEFT JOIN user_challenges uc ON u.id = uc.user_id AND uc.challenge_status = 'active'
""")
matches = cursor.fetchall()
for m in matches:
    if m[1]:
        print(f"  ✅ {m[0]} -> {m[1]} ({m[2]}) - {m[3]}")
    else:
        print(f"  ❌ {m[0]} -> NO ACTIVE CHALLENGE")

conn.close()
print("\n✅ Diagnostic complete!")
