from flask import Blueprint, jsonify
from ..services.news_service import NewsService

news_bp = Blueprint('news', __name__)

@news_bp.route('/calendar', methods=['GET'])
def get_calendar():
    """Get economic calendar events"""
    try:
        events = NewsService.get_economic_calendar()
        return jsonify(events)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@news_bp.route('/market', methods=['GET'])
def get_latest_news():
    """Get latest market news"""
    try:
        news = NewsService.get_market_news()
        return jsonify(news)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@news_bp.route('/summary', methods=['GET'])
def get_ai_summary():
    """Get AI generated market summary"""
    try:
        summary = NewsService.generate_ai_summary()
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
