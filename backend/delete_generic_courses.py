from app import create_app, db
from app.models import Course, Lesson, Quiz, Question, QuizAnswer, UserProgress, UserLessonProgress, Certificate

app = create_app()

def delete_generic_courses():
    titles_to_delete = [
        "Introduction au Trading",
        "Psychologie du Trader",
        "Crypto Masterclass",
        "Forex Pro Trader",
        "Psychologie & Risk Management",
        "Actions & Indices"
    ]
    
    with app.app_context():
        print("[START] Deleting generic courses...", flush=True)
        
        try:
            for title in titles_to_delete:
                course = Course.query.filter_by(title=title).first()
                if course:
                    print(f"Processing course: {course.title} (ID: {course.id})", flush=True)
                    
                    # 1. Delete Certificates
                    certificates = Certificate.query.filter_by(course_id=course.id).all()
                    for cert in certificates:
                        db.session.delete(cert)
                    
                    # 2. Delete UserProgress (Course Level)
                    progress = UserProgress.query.filter_by(course_id=course.id).all()
                    for p in progress:
                        db.session.delete(p)
                        
                    # 3. Manual cascade delete details
                    if course.lessons:
                        for lesson in course.lessons:
                            # 3a. Delete UserLessonProgress
                            l_progress = UserLessonProgress.query.filter_by(lesson_id=lesson.id).all()
                            for lp in l_progress:
                                db.session.delete(lp)
                                
                            # 3b. Delete Quiz and related
                            quiz = lesson.quiz
                            if quiz:
                                # Delete QuizAnswer
                                answers = QuizAnswer.query.filter_by(quiz_id=quiz.id).all()
                                for ans in answers:
                                    db.session.delete(ans)
                                    
                                # Delete Questions
                                if quiz.questions_rel:
                                    for question in quiz.questions_rel:
                                        db.session.delete(question)
                                db.session.delete(quiz)
                            
                            db.session.delete(lesson)
                    
                    db.session.delete(course)
                    print(f"   Deleted: {title} (ID: {course.id})", flush=True)
                else:
                    print(f"   Not found: {title}", flush=True)
            
            db.session.commit()
            print("[DONE] Cleanup complete.", flush=True)
        except Exception as e:
            db.session.rollback()
            print(f"ERROR: {str(e)}", flush=True)

if __name__ == "__main__":
    delete_generic_courses()
