import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from app.services.feed_service import FeedService
import json

try:
    print("Fetching watchlist data...")
    data = FeedService.get_watchlist_data()
    print("Data Fetched:")
    print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error: {e}")
