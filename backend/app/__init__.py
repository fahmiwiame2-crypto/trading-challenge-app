from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Load .env file explicitly
load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuration
    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
        
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        # Fix Render/Heroku postgres:// vs postgresql://
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        print(f"DEBUG: Using Production Database", flush=True)
    else:
        db_path = os.path.join(app.instance_path, 'tradesense_v2.db')
        print(f"DEBUG: Using Database at {db_path}", flush=True)
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # Register Blueprints
    from .routes.trading import trading_bp
    from .routes.auth import auth_bp
    from .routes.challenge import challenge_bp
    from .routes.admin import admin_bp

    app.register_blueprint(trading_bp, url_prefix='/api/trading')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(challenge_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')

    from .routes.academy import academy_bp
    app.register_blueprint(academy_bp, url_prefix='/api/academy')
    
    from .routes.risk_routes import risk_bp
    app.register_blueprint(risk_bp, url_prefix='/api/risk')
    
    from .routes.news import news_bp
    app.register_blueprint(news_bp, url_prefix='/api/news')

    from .routes.ai_chat import ai_bp
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    from .routes.payment import payment_bp
    app.register_blueprint(payment_bp, url_prefix='/api')

    from .routes.leaderboard import leaderboard_bp
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    
    # Seed endpoint (à supprimer après utilisation)
    from .routes.seed import seed_bp
    app.register_blueprint(seed_bp, url_prefix='/api/seed')
    
    with app.app_context():
        db.create_all()
    
    # Root route for health check
    @app.route('/')
    def index():
        return {'status': 'ok', 'message': 'TradeSense AI Backend is running'}
    
    @app.route('/api/health')
    def health():
        return {'status': 'healthy', 'service': 'tradesense-backend'}
        
    return app
