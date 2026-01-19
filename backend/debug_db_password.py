import pymysql

def try_connect(password):
    try:
        print(f"Testing password: '{password}' ...", end=" ")
        conn = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password=password,
            port=3306
        )
        print("SUCCESS! [FOUND]")
        conn.close()
        return True
    except pymysql.err.OperationalError as e:
        if e.args[0] == 1045: # Access denied
            print("Access denied")
        else:
            print(f"Error ({e.args[0]}): {e.args[1]}")
    except Exception as e:
        print(f"Error: {e}")
    return False

passwords_to_try = [
    '',           # Empty
    'root',       # Common
    'password',   # Common
    'admin',      # Common
    '1234',       # Common
    '123456',     # Common
    'tradesense', # App name
    'mysql'       # Service name
]

found = False
for pwd in passwords_to_try:
    if try_connect(pwd):
        print(f"\nFOUND PASSWORD: '{pwd}'")
        found = True
        break

if not found:
    print("\n[FAIL] Could not find the correct password in common list.")
