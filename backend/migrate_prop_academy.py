import sqlite3
import os
import json
from app import create_app, db
from app.models import Course, Lesson, Quiz, Question

app = create_app()

def migrate_prop_academy():
    db_path = os.path.join('instance', 'tradesense_v2.db')
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return

    # Connect to SQLite (Source)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    with app.app_context():
        print("[START] Migrating Prop Academy content...")
        
        # 1. Migrate Courses
        cursor.execute("SELECT * FROM course")
        old_courses = cursor.fetchall()
        
        course_mapping = {} # old_id -> new_id
        
        for old_c in old_courses:
            print(f"   Processing Course: {old_c['title']}")
            
            # Check if exists
            existing = Course.query.filter_by(title=old_c['title']).first()
            if existing:
                print(f"      -> Exists (ID: {existing.id}). Using existing.")
                course_mapping[old_c['id']] = existing.id
            else:
                # Create new
                new_c = Course(
                    title=old_c['title'],
                    description=old_c['description'],
                    duration=old_c['duration'],
                    category=old_c['category'], 
                    difficulty_level=old_c['difficulty_level'],
                    thumbnail_emoji=old_c['thumbnail_emoji'],
                    total_modules=0 # Will update later
                )
                db.session.add(new_c)
                db.session.flush()
                print(f"      -> Created (ID: {new_c.id})")
                course_mapping[old_c['id']] = new_c.id
                
        # 2. Migrate Lessons
        cursor.execute("SELECT * FROM lesson")
        old_lessons = cursor.fetchall()
        
        lesson_mapping = {} # old_id -> new_id
        
        for old_l in old_lessons:
            if old_l['course_id'] not in course_mapping:
                print(f"Skipping lesson {old_l['title']} (Course ID {old_l['course_id']} not found)")
                continue
                
            new_course_id = course_mapping[old_l['course_id']]
            
            # Check if exists
            existing = Lesson.query.filter_by(course_id=new_course_id, title=old_l['title']).first()
            if existing:
                lesson_mapping[old_l['id']] = existing.id
                print(f"      Lesson Exists: {old_l['title']}")
            else:
                new_l = Lesson(
                    course_id=new_course_id,
                    title=old_l['title'],
                    duration=old_l['duration'],
                    content=old_l['content'],
                    order_num=old_l['order']
                )
                db.session.add(new_l)
                db.session.flush()
                lesson_mapping[old_l['id']] = new_l.id
                print(f"      Created Lesson: {old_l['title']}")
                
        # 3. Migrate Quizzes
        cursor.execute("SELECT * FROM quiz")
        old_quizzes = cursor.fetchall()
        
        for old_q in old_quizzes:
            if old_q['lesson_id'] not in lesson_mapping:
                continue
                
            new_lesson_id = lesson_mapping[old_q['lesson_id']]
            
            # Check if exists
            existing = Quiz.query.filter_by(lesson_id=new_lesson_id).first()
            if existing:
                print(f"      Quiz Exists for Lesson ID {new_lesson_id}")
                continue
                
            try:
                questions_data = json.loads(old_q['questions'])
            except:
                print(f"      Error parsing JSON for Quiz ID {old_q['id']}")
                continue
                
            new_q = Quiz(
                lesson_id=new_lesson_id,
                title=f"Quiz",
                passing_score=70
            )
            db.session.add(new_q)
            db.session.flush()
            print(f"      Created Quiz for Lesson ID {new_lesson_id}")
            
            # 4. Create Questions
            for q_data in questions_data:
                # Determine correct index
                # Old schema: 'correct' is int index (0-3 or 1-4?)
                # Sample data: "correct": 1. Options len 4. Likely 1-based index?
                # "Options A" correct 1 -> A. 
                # Let's assume 1-based based on sample data seeing 1, 2, 3 values.
                # New model expects 'correct_answer' as 0-based index.
                
                correct_idx = int(q_data['correct']) - 1 # Convert 1-based to 0-based
                
                new_question = Question(
                    quiz_id=new_q.id,
                    question_text=q_data['question'],
                    options=q_data['options'],
                    correct_answer=correct_idx,
                    explanation="Explanation not provided in backup."
                )
                db.session.add(new_question)
                
        db.session.commit()
        print("[DONE] Migration complete.")
    
    conn.close()

if __name__ == "__main__":
    migrate_prop_academy()
