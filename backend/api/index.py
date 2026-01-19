"""
TradeSense AI - Vercel Serverless Entry Point
This file is required for deployment on Vercel
"""
import sys
import os

# Add the parent directory to the path so we can import from app
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app

# Create Flask application - Vercel expects 'app' variable
app = create_app()

# Vercel serverless handler
def handler(request):
    return app(request)
