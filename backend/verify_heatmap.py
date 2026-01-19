from app import create_app
from app.services.feed_service import FeedService
import json
from dotenv import load_dotenv

load_dotenv('backend/.env')

app = create_app()

with app.app_context():
    print("--- Testing FeedService.get_market_heatmap() (Full Integration) ---")
    try:
        data = FeedService.get_market_heatmap()
        print(f"Result Type: {type(data)}")
        print(f"Result Length: {len(data)}")
        print(json.dumps(data, indent=2))
        
        if not data:
            print("ERROR: Returned data is empty!")
        else:
            for item in data:
                # print(f"Checking item: {item}")
                if 'symbol' not in item or 'change' not in item:
                    print(f"ERROR: Invalid item format: {item}")
                if not isinstance(item['change'], (int, float)):
                    print(f"WARNING: 'change' is not a number: {type(item['change'])} - {item['change']}")
                    
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
