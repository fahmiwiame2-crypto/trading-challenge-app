from app import create_app
from app.services.news_service import NewsService
import json
from dotenv import load_dotenv

load_dotenv('backend/.env')

app = create_app()

with app.app_context():
    print("--- Testing News Service & Routes ---")
    try:
        print("\n1. Testing Calendar...")
        calendar = NewsService.get_economic_calendar()
        print(f"Calendar Events: {len(calendar)}")
        if calendar: print(f"First event: {calendar[0]['title']}")
        
        print("\n2. Testing Market News...")
        news = NewsService.get_market_news()
        print(f"News Items: {len(news)}")
        if news: 
            print(f"First news: {news[0]['title']}")
            print(f"Category: {news[0]['category']}")
        
        print("\n3. Testing Summary...")
        summary = NewsService.generate_ai_summary()
        print(f"Summary Title: {summary.get('title')}")
        print(f"Sentiment: {summary.get('dominant_trend')} ({summary.get('sentiment_score')})")

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"CRITICAL ERROR: {e}")
