from app import create_app, db
from app.models import Course, Module, Lesson, Quiz, Question

app = create_app()

def seed_massive():
    with app.app_context():
        print("[START] Seeding Massive Academy Content...")
        
        # Define Curriculum
        curriculum = [
            {
                "title": "Crypto Masterclass",
                "desc": "Devenez un expert des crypto-monnaies, de la Blockchain au Trading avanve.",
                "cat": "Crypto",
                "diff": 2,
                "emoji": "₿",
                "modules": [
                    {
                        "title": "Fondamentaux Blockchain",
                        "lessons": [
                            "Histoire du Bitcoin",
                            "Proof of Work vs Proof of Stake",
                            "Les Altcoins majeurs (ETH, SOL, ADA)"
                        ]
                    },
                    {
                        "title": "Securite Crypto",
                        "lessons": [
                            "Cold Wallets vs Hot Wallets",
                            "Eviter les Scams et Phishing",
                            "Gerer ses cles privees"
                        ]
                    },
                    {
                        "title": "Trading Crypto",
                        "lessons": [
                            "Cycles de marche (Bull vs Bear)",
                            "On-Chain Analysis",
                            "DeFi et Yield Farming"
                        ]
                    }
                ]
            },
            {
                "title": "Forex Pro Trader",
                "desc": "Strategies avancees pour trader les devises comme les institutionnels.",
                "cat": "Forex",
                "diff": 3,
                "emoji": "💱",
                "modules": [
                    {
                        "title": "Analyse Macro",
                        "lessons": [
                            "Taux d'interet et Banques Centrales",
                            "Impact du NFP et CPI",
                            "Correlations des devises"
                        ]
                    },
                    {
                        "title": "Price Action Avance",
                        "lessons": [
                            "Zones de Supply & Demand",
                            "Structures de marche (BOS, CHoCH)",
                            "Liquidity Grabs"
                        ]
                    }
                ]
            },
            {
                "title": "Psychologie & Risk Management",
                "desc": "Le secret de la rentabilite n'est pas la strategie, c'est vous.",
                "cat": "Psychologie",
                "diff": 1,
                "emoji": "🧠",
                "modules": [
                    {
                        "title": "Mindset",
                        "lessons": [
                            "Discipline et Routine",
                            "Accepter les pertes",
                            "Le journal de trading"
                        ]
                    },
                    {
                        "title": "Gestion du Risque",
                        "lessons": [
                            "Calcul de position (Lot Size)",
                            "Ratio Risk/Reward",
                            "Drawdown Management"
                        ]
                    }
                ]
            },
            {
                "title": "Actions & Indices",
                "desc": "Tradez le S&P500, le NASDAQ et les actions tech.",
                "cat": "Stocks",
                "diff": 2,
                "emoji": "🏢",
                "modules": [
                    {
                        "title": "Les Indices US",
                        "lessons": [
                            "S&P500 vs NASDAQ",
                            "Heures d'ouverture et volatilite",
                            "Earnings Season"
                        ]
                    }
                ]
            }
        ]

        total_lessons = 0
        
        for c_data in curriculum:
            # Create Course
            existing = Course.query.filter_by(title=c_data["title"]).first()
            if existing: # Avoid dupes if run multiple times
                print(f"   Skipping existing course: {c_data['title']}")
                continue
                
            course = Course(
                title=c_data["title"],
                description=c_data["desc"],
                category=c_data["cat"],
                difficulty_level=c_data["diff"],
                thumbnail_emoji=c_data["emoji"],
                total_modules=len(c_data["modules"]),
                duration="5h 00m"
            )
            db.session.add(course)
            db.session.flush()
            print(f"   Created Course: {course.title}")
            
            for m_idx, m_data in enumerate(c_data["modules"]):
                # Create Module
                module = Module(
                    course_id=course.id,
                    title=m_data["title"],
                    order_num=m_idx + 1
                )
                db.session.add(module)
                db.session.flush()
                
                for l_idx, l_title in enumerate(m_data["lessons"]):
                    # Create Lesson
                    lesson = Lesson(
                        course_id=course.id,
                        module_id=module.id,
                        title=l_title,
                        order_num=l_idx + 1,
                        duration="15m",
                        content=f"Contenu detaille pour la lecon '{l_title}'. Ici nous apprenons les concepts cles..."
                    )
                    db.session.add(lesson)
                    db.session.flush()
                    total_lessons += 1
                    
                    # Create Quiz
                    quiz = Quiz(
                        lesson_id=lesson.id,
                        title=f"Quiz: {l_title}",
                        passing_score=80
                    )
                    db.session.add(quiz)
                    db.session.flush()
                    
                    # Create Questions
                    q1 = Question(
                        quiz_id=quiz.id,
                        question_text=f"Question sur {l_title} ?",
                        options=["Reponse A", "Reponse B", "Reponse C"],
                        correct_answer=0,
                        explanation="Explication detaillee ici."
                    )
                    db.session.add(q1)

        db.session.commit()
        print(f"[DONE] Added {total_lessons} new lessons with quizzes!")

if __name__ == "__main__":
    seed_massive()
