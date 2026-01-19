import pymysql
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

def verify_academy():
    db_url = os.environ.get('DATABASE_URL', '')
    p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
    
    conn = pymysql.connect(
        host=p.hostname, user=p.username, password=p.password,
        port=p.port or 3306, database=p.path.lstrip('/'),
        charset='utf8mb4'
    )
    
    cursor = conn.cursor()
    
    print("\n[ACADEMY VERIFICATION]")
    
    # 1. Courses
    cursor.execute("SELECT id, title, total_modules FROM courses")
    courses = cursor.fetchall()
    print(f"\n1. COURSES ({len(courses)})")
    if not courses: print("   [FAIL] No courses found.")
    for c in courses:
        print(f"   - [{c[0]}] {c[1]} ({c[2]} modules)")

    # 2. Modules
    cursor.execute("SELECT id, course_id, title FROM modules")
    modules = cursor.fetchall()
    print(f"\n2. MODULES ({len(modules)})")
    if not modules: print("   [FAIL] No modules found.")
    for m in modules:
        print(f"   - [{m[0]}] {m[2]} (Course {m[1]})")

    # 3. Lessons
    cursor.execute("SELECT id, module_id, title FROM lessons")
    lessons = cursor.fetchall()
    print(f"\n3. LESSONS ({len(lessons)})")
    if not lessons: print("   [FAIL] No lessons found.")
    for l in lessons:
        print(f"   - [{l[0]}] {l[2]} (Module {l[1]})")

    # 4. Quizzes
    cursor.execute("SELECT id, lesson_id, title FROM quizzes")
    quizzes = cursor.fetchall()
    print(f"\n4. QUIZZES ({len(quizzes)})")
    if not quizzes: print("   [FAIL] No quizzes found.")
    for q in quizzes:
        print(f"   - [{q[0]}] {q[2]} (Lesson {q[1]})")

    # 5. Questions
    cursor.execute("SELECT id, quiz_id, question_text FROM questions")
    questions = cursor.fetchall()
    print(f"\n5. QUESTIONS ({len(questions)})")
    if not questions: print("   [FAIL] No questions found.")
    for q in questions:
        print(f"   - [{q[0]}] {q[2][:40]}... (Quiz {q[1]})")

    conn.close()

if __name__ == "__main__":
    verify_academy()
