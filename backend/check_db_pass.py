
import pymysql

passwords = ['wiamefahmi', 'root', '', 'password', 'admin', '123456']

print("--- Testing MySQL Connections ---")

for p in passwords:
    try:
        print(f"Trying user='root', password='{p}' ...")
        conn = pymysql.connect(
            host='localhost',
            user='root',
            password=p,
            database='tradesense',
            connect_timeout=2
        )
        print(f"[SUCCESS] Connected with password: '{p}'")
        conn.close()
        break
    except Exception as e:
        print(f"[FAILED] {e}")
