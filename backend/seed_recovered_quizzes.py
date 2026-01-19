from app import create_app, db
from app.models import Course, Module, Lesson, Quiz, Question

app = create_app()

with app.app_context():
    print("[START] robustly recovering 'Le FOMO' and its Quiz...")

    # 1. Ensure Course Exists
    course_title = "Psychologie du Trader"
    course = Course.query.filter_by(title=course_title).first()
    if not course:
        print(f"[INFO] Course '{course_title}' missing. Creating it...")
        course = Course(
            title=course_title,
            description="Gérez vos émotions et développez un mental de gagnant.",
            duration="2h 15m",
            category="Intermédiaire",
            difficulty_level=2,
            total_modules=1,
            thumbnail_emoji="🧠",
            tags=["Psychologie", "Mindset", "Risque"]
        )
        db.session.add(course)
        db.session.flush()
    else:
        print(f"[INFO] Course '{course_title}' found.")

    # 2. Ensure Module Exists
    module_title = "Gestion des émotions"
    module = Module.query.filter_by(course_id=course.id, title=module_title).first()
    if not module:
        print(f"[INFO] Module '{module_title}' missing. Creating it...")
        module = Module(
            course_id=course.id, 
            title=module_title, 
            order_num=1
        )
        db.session.add(module)
        db.session.flush()
    else:
        print(f"[INFO] Module '{module_title}' found.")

    # 3. Ensure Lesson Exists
    lesson_title = "Le FOMO"
    lesson = Lesson.query.filter_by(module_id=module.id, title=lesson_title).first()
    if not lesson:
        print(f"[INFO] Lesson '{lesson_title}' missing. Creating it...")
        lesson = Lesson(
            course_id=course.id, 
            module_id=module.id, 
            title=lesson_title, 
            duration="12m", 
            order_num=1, 
            content="Fear Of Missing Out (FOMO) est la peur de rater une opportunité qui conduit souvent à des décisions impulsives et irrationnelles sur les marchés."
        )
        db.session.add(lesson)
        db.session.flush()
    else:
        print(f"[INFO] Lesson '{lesson_title}' found.")

    # 4. Ensure Quiz Exists
    quiz_title = "Quiz de Validation"
    quiz = Quiz.query.filter_by(lesson_id=lesson.id).first()
    if quiz:
        print(f"[INFO] Quiz already exists. Deleting it to ensure fresh questions are added.")
        # If we just want to update, we should check questions. 
        # But 'recuperer' implies it might be broken or missing. 
        # If it exists, let's assume we want to overwrite to match the screenshot?
        # Actually, let's just delete the existing references (Questions) and Quiz, or just check content?
        # Safest quick match: Delete existing questions for this quiz and re-add them.
        Question.query.filter_by(quiz_id=quiz.id).delete()
        db.session.delete(quiz)
        db.session.flush()
    
    print(f"[INFO] Creating/Recreating Quiz '{quiz_title}'...")
    quiz = Quiz(
        lesson_id=lesson.id,
        title=quiz_title,
        passing_score=70
    )
    db.session.add(quiz)
    db.session.flush()

    # 5. Add Questions
    q1 = Question(
        quiz_id=quiz.id,
        question_text="Que signifie l'acronyme FOMO ?",
        options=["Fear Of Missing Out", "Follow Only My Orders", "First Order Market Open", "Find Opportunities More Often"],
        correct_answer=0, 
        explanation="FOMO signifie 'Fear Of Missing Out'."
    )
    
    q2 = Question(
        quiz_id=quiz.id,
        question_text="Quelle est une erreur classique liée au FOMO ?",
        options=["Doubler la position après une perte", "Attendre un setup clair", "Suivre son plan de trading", "Prendre une pause"],
        correct_answer=0, 
        explanation="Doubler la position par frustration ou envie de 'se refaire' est un symptôme typique du FOMO."
    )
    
    db.session.add(q1)
    db.session.add(q2)

    db.session.commit()
    print("[SUCCESS] Fully recovered: Course -> Module -> Lesson -> Quiz.")
