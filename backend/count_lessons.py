from app import create_app
from app.models import Course

app = create_app()

def count_lessons():
    with app.app_context():
        courses = Course.query.all()
        print(f"Total courses found: {len(courses)}")
        for course in courses:
            print(f"ID: {course.id} | Title: {course.title} | Lessons: {len(course.lessons)}")

if __name__ == "__main__":
    count_lessons()
