from app import create_app
from app.models import Course, Lesson, Module
import json

app = create_app()

def dump_all_lessons():
    with app.app_context():
        courses = Course.query.all()
        if not courses:
            print("No courses found in database.")
            return
        
        output_file = "MES_LECONS_IMPORTANTES.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("========== MES LECONS POP ACADEMY ==========\n\n")
            
            for course in courses:
                f.write(f"COURS: {course.title}\n")
                f.write("-" * 40 + "\n")
                
                modules = Module.query.filter_by(course_id=course.id).order_by(Module.order_num).all()
                for module in modules:
                    f.write(f"\n[MODULE] {module.title}\n")
                    
                    lessons = Lesson.query.filter_by(module_id=module.id).order_by(Lesson.order_num).all()
                    for lesson in lessons:
                        f.write(f"\n--- {lesson.title} ---\n")
                        f.write(f"{lesson.content}\n")
                
                standalone_lessons = Lesson.query.filter_by(course_id=course.id, module_id=None).order_by(Lesson.order_num).all()
                if standalone_lessons:
                    f.write("\n[LECONS SUPPLEMENTAIRES]\n")
                    for lesson in standalone_lessons:
                        f.write(f"\n--- {lesson.title} ---\n")
                        f.write(f"{lesson.content}\n")
                
                f.write("\n" + "="*40 + "\n\n")
        
        print(f"Extraction terminée ! Fichier créé : {output_file}")

if __name__ == "__main__":
    dump_all_lessons()
