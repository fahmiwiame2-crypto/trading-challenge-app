import pymysql
import sys

def try_connect(user, pwd):
    try:
        conn = pymysql.connect(host='localhost', user=user, password=pwd, port=3306)
        print(f"SUCCESS: {user}/{pwd}")
        conn.close()
        return True
    except Exception as e:
        msg = str(e)
        if "1045" in msg:
            print(f"AUTH FAIL: {user}/{pwd} (1045)")
        else:
            print(f"ERROR: {user}/{pwd} -> {msg[:50]}...")
        return False

print("--- DIAGNOSTIC ---")
res_local = try_connect('tradesense', 'tradesense123')
# Hack: override host logic inside try_connect or just verify here
try:
    conn = pymysql.connect(host='127.0.0.1', user='tradesense', password='tradesense123', port=3306)
    print("SUCCESS: tradesense/tradesense123 (127.0.0.1)")
    conn.close()
    res_ip = True
except Exception as e:
    print(f"AUTH FAIL: tradesense  (127.0.0.1) {e}")
    res_ip = False

if res_local or res_ip:
    print("FINAL RESULT: TRADESENSE_OK")
else:
    print("FINAL RESULT: TRADESENSE_FAIL")
