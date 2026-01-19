from app import create_app
from app.models import Course
import json

app = create_app()

def dump_courses():
    with app.app_context():
        courses = Course.query.all()
        data = [{
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'total_modules': c.total_modules,
            'duration': c.duration,
            'category': c.category,
            'difficulty_level': c.difficulty_level,
            'tags': c.tags or [],
            'thumbnail_emoji': c.thumbnail_emoji,
        } for c in courses]
        print(json.dumps(data, indent=2))

if __name__ == "__main__":
    dump_courses()
