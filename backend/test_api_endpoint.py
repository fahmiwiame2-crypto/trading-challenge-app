import requests
import json

base_url = "http://127.0.0.1:5000"
endpoint = "/api/trading/market-data/watchlist"

try:
    print(f"Calling {base_url}{endpoint}...")
    response = requests.get(f"{base_url}{endpoint}", timeout=10)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
        if not data:
            print("WARNING: Data is an empty list.")
        else:
            for group in data:
                print(f"Category: {group.get('category')}, Items: {len(group.get('items', []))}")
    except:
        print(response.text)
except Exception as e:
    print(f"Error calling API: {e}")
