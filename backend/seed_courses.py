from app import create_app, db
from app.models import Course, Module, Lesson, Quiz

app = create_app()

with app.app_context():
    print("Seeding Academy courses...")
    
    # Check if courses already exist
    if Course.query.first():
        print("Courses already exist. Skipping seed.")
        exit(0)

    # Course 1: Trading Basics
    c1 = Course(
        title="Introduction au Trading",
        description="Maîtrisez les bases du trading : chandeliers, tendances et support/résistance.",
        duration="4h 30m",
        category="Débutant",
        difficulty_level=1,
        total_modules=2,
        thumbnail_emoji="📈",
        tags=["Trading", "Débutant", "Analyse Technique"]
    )
    db.session.add(c1)
    db.session.flush()

    # Module 1.1
    m1 = Module(course_id=c1.id, title="Les Bases", order_num=1)
    db.session.add(m1)
    db.session.flush()

    # Lessons for M1.1
    l1 = Lesson(course_id=c1.id, module_id=m1.id, title="Qu'est-ce que le Forex ?", duration="10m", order_num=1, content="Le Forex est le marché des changes...")
    l2 = Lesson(course_id=c1.id, module_id=m1.id, title="Comprendre les paires de devises", duration="15m", order_num=2, content="Une paire de devises est la cotation de deux devises...")
    db.session.add(l1)
    db.session.add(l2)

    # Module 1.2
    m2 = Module(course_id=c1.id, title="Analyse Technique", order_num=2)
    db.session.add(m2)
    db.session.flush()

    l3 = Lesson(course_id=c1.id, module_id=m2.id, title="Chandeliers Japonais", duration="20m", order_num=1, content="Les chandeliers japonais montrent l'ouverture, le haut, le bas et la fermeture...")
    db.session.add(l3)

    # Course 2: Psychology
    c2 = Course(
        title="Psychologie du Trader",
        description="Gérez vos émotions et développez un mental de gagnant.",
        duration="2h 15m",
        category="Intermédiaire",
        difficulty_level=2,
        total_modules=1,
        thumbnail_emoji="🧠",
        tags=["Psychologie", "Mindset", "Risque"]
    )
    db.session.add(c2)
    db.session.flush()

    m3 = Module(course_id=c2.id, title="Gestion des émotions", order_num=1)
    db.session.add(m3)
    db.session.flush()

    l4 = Lesson(course_id=c2.id, module_id=m3.id, title="Le FOMO", duration="12m", order_num=1, content="Fear Of Missing Out...")
    db.session.add(l4)

    db.session.commit()
    print("✅ Courses, Modules, and Lessons seeded successfully!")
