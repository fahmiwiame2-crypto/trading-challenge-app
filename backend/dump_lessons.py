from app import create_app
from app.models import Course, Lesson
import json

app = create_app()

def dump_lessons(course_id):
    with app.app_context():
        course = Course.query.get(course_id)
        if not course:
            print(f"Course {course_id} not found")
            return
        
        data = {
            'course': course.title,
            'lessons': [{
                'id': l.id,
                'title': l.title,
                'module_id': l.module_id,
                'content': l.content[:100] + '...' if l.content else None,
                'order_num': l.order_num
            } for l in course.lessons]
        }
        print(json.dumps(data, indent=2))

if __name__ == "__main__":
    dump_lessons(3)
