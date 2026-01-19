"""
TradeSense AI - Main Application Entry Point
This file is required for deployment on Render.com with Gunicorn
"""
from app import create_app
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create Flask application
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
