from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    balance = db.Column(db.Float, default=100000.0)
    
    # Risk Management Fields
    status = db.Column(db.String(20), default='ACTIVE')  # ACTIVE, FAILED, PASSED
    initial_capital = db.Column(db.Float, default=100000.0)
    daily_starting_equity = db.Column(db.Float, default=100000.0)
    last_equity_reset = db.Column(db.DateTime, default=datetime.utcnow)
    failure_reason = db.Column(db.String(255), nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)

class Trade(db.Model):
    __tablename__ = 'trades'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False) # 'BUY' or 'SELL'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(10), default='OPEN')
    close_price = db.Column(db.Float, nullable=True)
    close_timestamp = db.Column(db.DateTime, nullable=True)
    pnl = db.Column(db.Float, default=0.0)

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    thumbnail_url = db.Column(db.String(255), nullable=True)
    total_modules = db.Column(db.Integer, default=0)
    duration = db.Column(db.String(50), nullable=True)
    category = db.Column(db.String(50), default='Débutant')
    difficulty_level = db.Column(db.Integer, default=1)
    tags = db.Column(db.JSON, nullable=True)
    thumbnail_emoji = db.Column(db.String(10), nullable=True)
    lessons = db.relationship('Lesson', backref='course', lazy=True)

    def to_dict(self, user_id=None):
        result = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'total_modules': self.total_modules,
            'duration': self.duration,
            'category': self.category,
            'difficulty_level': self.difficulty_level,
            'tags': self.tags or [],
            'thumbnail_emoji': self.thumbnail_emoji,
            'progress': 0,
            'lessons': [lesson.to_dict() for lesson in self.lessons]
        }
        
        # If user_id provided, calculate real progress
        if user_id:
            progress = UserProgress.query.filter_by(
                user_id=user_id, 
                course_id=self.id
            ).first()
            if progress:
                result['progress'] = progress.progress_percentage
                result['completed'] = progress.completed
        
        return result

class Module(db.Model):
    __tablename__ = 'modules'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    order_num = db.Column(db.Integer, default=0)

class Lesson(db.Model):
    __tablename__ = 'lessons'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('modules.id'), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    duration = db.Column(db.String(50), nullable=True)
    content = db.Column(db.Text, nullable=True)  # Lesson text content
    order_num = db.Column(db.Integer, default=0)
    quiz = db.relationship('Quiz', backref='lesson', uselist=False, lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'duration': self.duration,
            'content': self.content,
            'completed': False,  # Placeholder
            'order': self.order_num,
            'quiz': self.quiz.to_dict() if self.quiz else None
        }

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    title = db.Column(db.String(255), nullable=True)
    passing_score = db.Column(db.Integer, default=70)
    questions_rel = db.relationship('Question', backref='quiz', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'passing_score': self.passing_score,
            'questions': [q.to_dict() for q in self.questions_rel]
        }

class QuizAnswer(db.Model):
    __tablename__ = 'quiz_answers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)  # Percentage score
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserProgress(db.Model):
    __tablename__ = 'user_course_progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    # lesson_id removed as it belongs in user_lesson_progress
    completed = db.Column(db.Boolean, default=False)
    progress_percentage = db.Column(db.Integer, default=0)
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_id': self.course_id,
            'completed': self.completed,
            'progress_percentage': self.progress_percentage,
            'last_accessed': self.last_accessed.isoformat() if self.last_accessed else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class UserLessonProgress(db.Model):
    __tablename__ = 'user_lesson_progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)

class Certificate(db.Model):
    __tablename__ = 'certificates'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    certificate_number = db.Column(db.String(100), unique=True)
    
    def to_dict(self):
        course = Course.query.get(self.course_id)
        return {
            'id': self.id,
            'course_id': self.course_id,
            'course_title': course.title if course else 'Unknown',
            'issued_at': self.issued_at.isoformat() if self.issued_at else None,
            'certificate_number': self.certificate_number
        }

class UserChallenge(db.Model):
    """
    Tracks user challenge purchases and status.
    Created after successful payment.
    """
    __tablename__ = 'user_challenges'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_name = db.Column(db.String(50), nullable=False)  # 'starter', 'pro', 'elite'
    plan_price = db.Column(db.Float, nullable=False)
    initial_capital = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # 'card', 'paypal', 'crypto'
    payment_status = db.Column(db.String(20), default='pending')  # 'pending', 'completed', 'failed'
    transaction_id = db.Column(db.String(100), nullable=True)
    challenge_status = db.Column(db.String(20), default='active')  # 'active', 'passed', 'failed', 'expired'
    profit_target = db.Column(db.Float, default=10.0)  # 10% profit target
    max_daily_loss = db.Column(db.Float, default=5.0)  # 5% max daily loss
    max_total_loss = db.Column(db.Float, default=10.0)  # 10% max total loss
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('challenges', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plan_name': self.plan_name,
            'plan_price': self.plan_price,
            'initial_capital': self.initial_capital,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'transaction_id': self.transaction_id,
            'challenge_status': self.challenge_status,
            'profit_target': self.profit_target,
            'max_daily_loss': self.max_daily_loss,
            'max_total_loss': self.max_total_loss,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class SystemConfig(db.Model):
    """
    System configuration for admin settings.
    Stores PayPal credentials and other settings.
    """
    __tablename__ = 'system_config'
    id = db.Column(db.Integer, primary_key=True)
    config_key = db.Column(db.String(100), unique=True, nullable=False)
    config_value = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    is_secret = db.Column(db.Boolean, default=False)  # Hide value in API responses
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self, include_secret=False):
        return {
            'id': self.id,
            'config_key': self.config_key,
            'config_value': self.config_value if (not self.is_secret or include_secret) else '********',
            'description': self.description,
            'is_secret': self.is_secret,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Payment(db.Model):
    """
    Payment transactions history.
    """
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey('user_challenges.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), default='USD')
    payment_method = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'completed', 'failed', 'refunded'
    transaction_id = db.Column(db.String(100), nullable=True)
    paypal_order_id = db.Column(db.String(100), nullable=True)
    payment_metadata = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'challenge_id': self.challenge_id,
            'amount': self.amount,
            'currency': self.currency,
            'payment_method': self.payment_method,
            'status': self.status,
            'transaction_id': self.transaction_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class ChatMessage(db.Model):
    """Store AI chat conversation history"""
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)  # User's question
    response = db.Column(db.Text, nullable=False)  # AI's response
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'response': self.response,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

class TradingFloor(db.Model):
    __tablename__ = 'trading_floors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    max_participants = db.Column(db.Integer, default=50)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RiskAlert(db.Model):
    __tablename__ = 'risk_alerts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    alert_type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), default='WARNING')
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class MarketSignal(db.Model):
    __tablename__ = 'market_signals'
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(20), nullable=False)
    signal_type = db.Column(db.String(20), nullable=False)
    confidence = db.Column(db.Float, nullable=True)
    price_target = db.Column(db.Float, nullable=True)
    stop_loss = db.Column(db.Float, nullable=True)
    analysis = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)

class UserBadge(db.Model):
    __tablename__ = 'user_badges'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_name = db.Column(db.String(100), nullable=False)
    badge_icon = db.Column(db.String(50), nullable=True)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserXP(db.Model):
    __tablename__ = 'user_xp'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    xp_points = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    last_xp_gain = db.Column(db.DateTime, nullable=True)

class MessageReaction(db.Model):
    __tablename__ = 'message_reactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message_id = db.Column(db.Integer, nullable=False)
    reaction_type = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Option(db.Model):
    __tablename__ = 'options'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    option_text = db.Column(db.String(255), nullable=False)
    is_correct = db.Column(db.Boolean, default=False)

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)
    correct_answer = db.Column(db.Integer, nullable=False)
    explanation = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'question_text': self.question_text,
            'options': self.options,
            'correct_answer': self.correct_answer,
            'explanation': self.explanation
        }

class Account(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    account_type = db.Column(db.String(50), default='DEMO')
    balance = db.Column(db.Float, default=100000.0)
    currency = db.Column(db.String(10), default='USD')
    leverage = db.Column(db.Integer, default=100)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, default=0.0)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Leaderboard(db.Model):
    """
    Stores the Top 10 Traders snapshot.
    Updated periodically (e.g., hourly or daily).
    """
    __tablename__ = 'leaderboard'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    rank = db.Column(db.Integer, nullable=False)
    profit_percent = db.Column(db.Float, default=0.0)
    total_trades = db.Column(db.Integer, default=0)
    win_rate = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='ACTIVE')
    snapshot_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'rank': self.rank,
            'username': self.username,
            'profit': self.profit_percent,
            'trades': self.total_trades,
            'win_rate': self.win_rate,
            'status': self.status
        }

class Config(db.Model):
    """
    Stores key-value configuration settings (e.g., PayPal keys).
    """
    __tablename__ = 'configs'
    id = db.Column(db.Integer, primary_key=True)
    config_key = db.Column(db.String(100), unique=True, nullable=False)
    config_value = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
