from app import create_app, db
from app.models import Lesson, Quiz, Question

app = create_app()

with app.app_context():
    print("[START] Seeding Quizzes...")
    
    lessons = Lesson.query.all()
    if not lessons:
        print("No lessons found. Run seed_courses.py first.")
        exit(0)
        
    count = 0
    for lesson in lessons:
        # Check if quiz exists
        if Quiz.query.filter_by(lesson_id=lesson.id).first():
            continue
            
        # Create Quiz
        quiz = Quiz(
            lesson_id=lesson.id,
            title=f"Quiz: {lesson.title}",
            passing_score=70
        )
        db.session.add(quiz)
        db.session.flush()
        
        # Create Questions
        q1 = Question(
            quiz_id=quiz.id,
            question_text="What is the main takeaway from this lesson?",
            options=["Option A", "Option B", "Option C", "Option D"],
            correct_answer=0,
            explanation="Option A is correct because..."
        )
        q2 = Question(
            quiz_id=quiz.id,
            question_text="True or False?",
            options=["True", "False"],
            correct_answer=0,
            explanation="It is true."
        )
        db.session.add(q1)
        db.session.add(q2)
        count += 1
        
    db.session.commit()
    print(f"[DONE] Created {count} quizzes with questions.")

