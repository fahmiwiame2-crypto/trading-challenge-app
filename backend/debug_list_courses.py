from app import create_app, db
from app.models import Course, Lesson, Quiz, Question

app = create_app()

with app.app_context():
    courses = Course.query.all()
    print(f"Total Courses: {len(courses)}")
    for c in courses:
        print(f"Course: {c.title} (ID: {c.id})")
        lessons = Lesson.query.filter_by(course_id=c.id).order_by(Lesson.order_num).all()
        for l in lessons:
            print(f"  - Lesson: {l.title} (ID: {l.id})")
            
            # Check for quiz questions
            quiz = Quiz.query.filter_by(lesson_id=l.id).first()
            if quiz:
                q_count = Question.query.filter_by(quiz_id=quiz.id).count()
                print(f"    - Quiz: {quiz.title} ({q_count} Questions)")
            else:
                print(f"    - [NO QUIZ]")
