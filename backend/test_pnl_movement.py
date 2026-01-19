import sys
import os
import time

# Add backend directory to python path
sys.path.append(os.getcwd())

from app.services.feed_service import FeedService

print("=== TESTING PRICE MOVEMENT ===")
ticker = "BTC-USD"

# 1. Fetch Price 1
print("Fetching Price 1...")
data1 = FeedService.get_price_data(ticker)
price1 = data1[-1]['close']
print(f"Price 1: {price1}")

# 2. Wait 6 seconds (Cache is 5s)
print("Waiting 6 seconds...")
time.sleep(6)

# 3. Fetch Price 2
print("Fetching Price 2...")
data2 = FeedService.get_price_data(ticker)
price2 = data2[-1]['close']
print(f"Price 2: {price2}")

if price1 == price2:
    print("\n[FAIL] Price did not move. Cache is preventing updates.")
else:
    print(f"\n[PASS] Price moved: {price1} -> {price2}")
