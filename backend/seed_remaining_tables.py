from app import create_app, db
from app.models import (
    User, Account, Transaction, UserXP, UserBadge,
    UserProgress, UserLessonProgress, Certificate,
    Quiz, Question, QuizAnswer, MessageReaction, ChatMessage,
    Course, Lesson
)
# Note: Option model might be redundant if Question uses JSON, but we seed it for completeness
# We need to define Option model here if it's not imported or just use raw SQL if strictly needed.
# Converting to dynamic import or assuming it's in models.
from app.models import Option 

import random
from datetime import datetime, timedelta

app = create_app()

def seed_remaining():
    with app.app_context():
        print("[START] Seeding all remaining empty tables...")
        
        users = User.query.all()
        courses = Course.query.all()
        lessons = Lesson.query.all()
        quizzes = Quiz.query.all()
        questions = Question.query.all()
        chat_messages = ChatMessage.query.all()
        
        if not users:
            print("No users found!")
            return

        # 1. Accounts
        print("   -> Accounts")
        for user in users:
            if not Account.query.filter_by(user_id=user.id).first():
                acc = Account(
                    user_id=user.id,
                    account_type='DEMO',
                    balance=user.balance,
                    currency='USD',
                    leverage=100
                )
                db.session.add(acc)

        # 2. Transactions
        print("   -> Transactions")
        for user in users:
            t = Transaction(
                user_id=user.id,
                type='DEPOSIT',
                amount=1000.0,
                description='Initial Deposit'
            )
            db.session.add(t)

        # 3. User XP & Badges
        print("   -> XP & Badges")
        badges = ['First Trade', 'Risk Manager', 'Profit Hunter']
        for user in users:
            if not UserXP.query.filter_by(user_id=user.id).first():
                xp = UserXP(
                    user_id=user.id,
                    xp_points=random.randint(100, 5000),
                    level=random.randint(1, 10),
                    last_xp_gain=datetime.utcnow()
                )
                db.session.add(xp)
            
            # Badge
            b = UserBadge(
                user_id=user.id,
                badge_name=random.choice(badges),
                badge_icon='🏆'
            )
            db.session.add(b)

        # 4. Course/Lesson Progress & Certificates
        print("   -> Academy Progress")
        for user in users[:5]: # Do for first 5 users
            for course in courses:
                # Course Progress
                if not UserProgress.query.filter_by(user_id=user.id, course_id=course.id).first():
                    cp = UserProgress(
                        user_id=user.id,
                        course_id=course.id,
                        progress_percentage=100,
                        completed=True,
                        completed_at=datetime.utcnow()
                    )
                    db.session.add(cp)
                
                # Certificate
                if not Certificate.query.filter_by(user_id=user.id, course_id=course.id).first():
                    cert = Certificate(
                        user_id=user.id, 
                        course_id=course.id,
                        certificate_number=f"CERT-{user.id}-{course.id}-{random.randint(1000,9999)}"
                    )
                    db.session.add(cert)

            for lesson in lessons:
                if not UserLessonProgress.query.filter_by(user_id=user.id, lesson_id=lesson.id).first():
                    ulp = UserLessonProgress(
                        user_id=user.id,
                        lesson_id=lesson.id,
                        completed=True,
                        completed_at=datetime.utcnow()
                    )
                    db.session.add(ulp)

        # 5. Quiz Answers
        print("   -> Quiz Answers")
        for user in users[:3]:
            for quiz in quizzes:
                if not QuizAnswer.query.filter_by(user_id=user.id, quiz_id=quiz.id).first():
                    qa = QuizAnswer(
                        user_id=user.id,
                        quiz_id=quiz.id,
                        score=random.randint(70, 100),
                        completed_at=datetime.utcnow()
                    )
                    db.session.add(qa)

        # 6. Message Reactions
        print("   -> Message Reactions")
        reactions = ['like', 'heart', 'rocket']
        if chat_messages:
            for user in users[:3]:
                if not MessageReaction.query.filter_by(user_id=user.id, message_id=chat_messages[0].id).first():
                    mr = MessageReaction(
                        user_id=user.id,
                        message_id=chat_messages[0].id,
                        reaction_type=random.choice(reactions)
                    )
                    db.session.add(mr)

        # 7. Options (Redundant but filling table)
        print("   -> Options")
        for q in questions:
            # Check if options exist for this question
            if not Option.query.filter_by(question_id=q.id).first():
                # q.options is a list from JSON like ["A", "B"]
                opts = q.options if isinstance(q.options, list) else ["True", "False"] 
                for opt_text in opts:
                    o = Option(
                        question_id=q.id,
                        option_text=str(opt_text),
                        is_correct=False
                    )
                    db.session.add(o)

        db.session.commit()
        print("[Done] All tables populated.")

if __name__ == "__main__":
    seed_remaining()
