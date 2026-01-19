print("Checking environment...")
try:
    import feedparser
    print("[OK] feedparser is installed.")
    print(f"Version: {feedparser.__version__}")
except ImportError:
    print("[FAIL] feedparser is NOT installed.")
    sys.exit(1)

import time
from datetime import datetime

rss_url = "https://finance.yahoo.com/news/rssindex"
print(f"\nAttempting to fetch RSS: {rss_url}")

try:
    feed = feedparser.parse(rss_url)
    print(f"Bozo bit (error indicator): {feed.bozo}")
    if feed.bozo:
        print(f"Bozo exception: {feed.bozo_exception}")
    
    if hasattr(feed, 'status'):
        print(f"HTTP Status: {feed.status}")
    
    if not feed.entries:
        print("[WARN] No entries found in feed.")
    else:
        print(f"[OK] Found {len(feed.entries)} entries.")
        entry = feed.entries[0]
        print(f"Top Entry: {entry.title}")
        print(f"Published: {entry.get('published', 'N/A')}")

except Exception as e:
    print(f("[ERROR] Error fetching feed: {e}"))
