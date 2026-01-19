from flask import Blueprint, jsonify, request
from app.models import Course, Module, Lesson, Quiz, Question, db

seed_bp = Blueprint('seed', __name__)

@seed_bp.route('/seed-courses', methods=['POST'])
def seed_courses():
    """
    ATTENTION: Cet endpoint est à usage unique pour charger les cours initiaux.
    Supprimez-le après utilisation pour des raisons de sécurité.
    
    Utilisation: POST /api/seed/seed-courses avec {"secret": "VOTRE_SECRET"}
    """
    try:
        # Simple protection
        data = request.json or {}
        secret = data.get('secret')
        
        # Changez ce secret pour le vôtre
        if secret != "seed-courses-2026":
            return jsonify({"error": "Secret incorrect"}), 403
        
        # Vérifier si des cours existent déjà
        existing_count = Course.query.count()
        if existing_count > 0:
            return jsonify({
                "message": f"{existing_count} cours existent déjà. Utilisez force=true pour réinitialiser.",
                "existing_courses": existing_count
            }), 400
        
        force = data.get('force', False)
        if force:
            # Supprimer tous les cours existants
            Course.query.delete()
            db.session.commit()
        
        # Curriculum des cours
        curriculum = [
            {
                "title": "Introduction au Trading - Les Fondamentaux",
                "desc": "Apprenez les bases essentielles du trading : marchés financiers, ordres, plateformes et vocabulaire indispensable.",
                "cat": "Débutant",
                "diff": 1,
                "emoji": "📚",
                "tags": ["Bases", "Débutant", "Introduction"],
                "duration": "2h 30m",
                "modules": [
                    {
                        "title": "Comprendre les Marchés Financiers",
                        "lessons": [
                            {"title": "Qu'est-ce que le Trading ?", "duration": "12m", "content": "Le trading consiste à acheter et vendre des actifs financiers pour réaliser des profits. Découvrez les différents types de marchés (Forex, Actions, Crypto, Commodités) et comment ils fonctionnent."},
                            {"title": "Les Différents Types de Marchés", "duration": "15m", "content": "Forex (devises), Actions (entreprises), Cryptomonnaies (Bitcoin, Ethereum), Commodités (Or, Pétrole). Chaque marché a ses particularités, horaires et volatilité."},
                            {"title": "Comprendre les Paires de Devises", "duration": "18m", "content": "EUR/USD, GBP/JPY... Apprenez à lire les paires de devises, comprendre le pip, le spread et les mouvements de prix."}
                        ]
                    },
                    {
                        "title": "Types d'Ordres et Gestion de Position",
                        "lessons": [
                            {"title": "Ordres Market, Limit et Stop", "duration": "20m", "content": "Market Order (exécution immédiate), Limit Order (prix spécifique), Stop Loss (protection), Take Profit (sortie automatique)."},
                            {"title": "Entrer et Sortir d'un Trade", "duration": "15m", "content": "Les meilleures pratiques pour entrer dans une position, placer vos stops, et clôturer au bon moment."}
                        ]
                    },
                    {
                        "title": "Choisir sa Plateforme de Trading",
                        "lessons": [
                            {"title": "MetaTrader 4/5 : Guide Complet", "duration": "25m", "content": "Installation, interface, personnalisation, indicateurs, et placement d'ordres sur MT4/MT5."},
                            {"title": "TradingView : Analyse et Graphiques", "duration": "20m", "content": "Utiliser TradingView pour l'analyse technique, dessiner des niveaux, et partager vos idées."}
                        ]
                    }
                ]
            },
            {
                "title": "Analyse Technique Professionnelle",
                "desc": "Maîtrisez l'analyse technique : chandeliers japonais, support/résistance, tendances, patterns et indicateurs avancés.",
                "cat": "Intermédiaire",
                "diff": 2,
                "emoji": "📊",
                "tags": ["Analyse Technique", "Chandeliers", "Indicateurs"],
                "duration": "4h 00m",
                "modules": [
                    {
                        "title": "Chandeliers Japonais",
                        "lessons": [
                            {"title": "Anatomie d'un Chandelier", "duration": "15m", "content": "Corps, mèches, ouverture/clôture. Comprendre ce que chaque bougie révèle sur la psychologie du marché."},
                            {"title": "Patterns de Retournement", "duration": "25m", "content": "Doji, Hammer, Shooting Star, Engulfing, Morning/Evening Star. Reconnaître les signaux de retournement de tendance."},
                            {"title": "Patterns de Continuation", "duration": "20m", "content": "Marubozu, Three White Soldiers, Rising/Falling Three Methods. Confirmer la poursuite d'une tendance."}
                        ]
                    },
                    {
                        "title": "Support, Résistance et Tendances",
                        "lessons": [
                            {"title": "Tracer les Supports et Résistances", "duration": "30m", "content": "Identifier les zones clés où le prix rebondit. Utiliser les niveaux horizontaux, obliques et psychologiques."},
                            {"title": "Lignes de Tendance et Canaux", "duration": "25m", "content": "Tracer des trendlines, identifier la tendance haussière/baissière/latérale, et trader dans le sens du marché."},
                            {"title": "Fibonacci : Retracements et Extensions", "duration": "35m", "content": "Utiliser Fibonacci 38.2%, 50%, 61.8% pour trouver des niveaux d'entrée et de sortie précis."}
                        ]
                    },
                    {
                        "title": "Indicateurs Techniques Essentiels",
                        "lessons": [
                            {"title": "Moyennes Mobiles (SMA, EMA)", "duration": "20m", "content": "SMA 50/200, EMA 9/21. Identifier la tendance et les croisements (Golden Cross, Death Cross)."},
                            {"title": "RSI : Surachat et Survente", "duration": "25m", "content": "Relative Strength Index : détecter les zones de surachat (>70) et survente (<30), divergences."},
                            {"title": "MACD : Momentum et Croisements", "duration": "22m", "content": "Moving Average Convergence Divergence : signaux d'achat/vente, divergences haussières/baissières."},
                            {"title": "Bollinger Bands et Volatilité", "duration": "18m", "content": "Bandes de Bollinger : mesurer la volatilité, squeeze, breakout, retour à la moyenne."}
                        ]
                    }
                ]
            },
            {
                "title": "Trading Forex : Stratégies Gagnantes",
                "desc": "Stratégies complètes pour trader le Forex : Price Action, Smart Money Concepts, et techniques institutionnelles.",
                "cat": "Intermédiaire",
                "diff": 2,
                "emoji": "💱",
                "tags": ["Forex", "Price Action", "SMC"],
                "duration": "5h 30m",
                "modules": [
                    {
                        "title": "Price Action Pure",
                        "lessons": [
                            {"title": "Lire le Marché sans Indicateurs", "duration": "30m", "content": "Price Action : analyser uniquement les bougies, les niveaux et la structure pour prendre des décisions."},
                            {"title": "Pin Bar et Rejection Candles", "duration": "35m", "content": "Identifier les Pin Bars aux niveaux clés, confirmer le rejet de prix et entrer avec un excellent R:R."},
                            {"title": "Inside Bar et Breakout Strategy", "duration": "28m", "content": "Inside Bar comme consolidation, attendre le breakout et trader avec la tendance dominante."}
                        ]
                    },
                    {
                        "title": "Smart Money Concepts (SMC)",
                        "lessons": [
                            {"title": "Structure de Marché : BOS et CHoCH", "duration": "40m", "content": "Break of Structure (continuation), Change of Character (retournement). Suivre les institutions."},
                            {"title": "Order Blocks et Fair Value Gaps", "duration": "45m", "content": "Zones d'Order Blocks : où les institutions ont placé leurs ordres. FVG : déséquilibres à combler."},
                            {"title": "Liquidity Grabs et Stop Hunts", "duration": "38m", "content": "Comprendre comment les institutions chassent la liquidité retail avant de lancer le vrai mouvement."}
                        ]
                    },
                    {
                        "title": "Sessions de Trading Forex",
                        "lessons": [
                            {"title": "Session Asiatique, Londonienne, New-Yorkaise", "duration": "32m", "content": "Horaires, volatilité, paires à trader selon chaque session. Optimiser vos trades selon l'horloge mondiale."},
                            {"title": "News Trading et Économie", "duration": "35m", "content": "NFP, CPI, Fed Rates : impact des annonces économiques sur le Forex et comment les trader."}
                        ]
                    }
                ]
            },
            {
                "title": "Scalping et Day Trading : Profits Rapides",
                "desc": "Techniques de scalping et day trading : setups courts-termes, gestion rapide, et exploitation de la volatilité intraday.",
                "cat": "Avancé",
                "diff": 3,
                "emoji": "⚡",
                "tags": ["Scalping", "Day Trading", "M1", "M5"],
                "duration": "3h 45m",
                "modules": [
                    {
                        "title": "Fondamentaux du Scalping",
                        "lessons": [
                            {"title": "Qu'est-ce que le Scalping ?", "duration": "18m", "content": "Trades très courts (1-15 min), petits profits répétés, haute fréquence. Avantages et risques."},
                            {"title": "Timeframes pour Scalper : M1, M5, M15", "duration": "22m", "content": "Choisir le bon timeframe selon votre style, volatilité, et stratégie de scalping."},
                            {"title": "Paires Idéales pour le Scalping", "duration": "20m", "content": "EUR/USD, GBP/USD : spreads faibles, haute liquidité. Éviter les paires exotiques."}
                        ]
                    },
                    {
                        "title": "Stratégies de Scalping",
                        "lessons": [
                            {"title": "Scalping sur Breakout de Range", "duration": "30m", "content": "Identifier une consolidation, attendre le breakout, entrer rapidement avec stop serré."},
                            {"title": "Scalping avec EMA Crossover", "duration": "28m", "content": "EMA 9/21 : croisement haussier/baissier, confirmer avec le prix, sortie rapide."},
                            {"title": "Scalping de Retracement Fibonacci", "duration": "35m", "content": "Trend fort, attendre retracement à 38.2% ou 50%, entrer avec confirmation bougie."}
                        ]
                    },
                    {
                        "title": "Day Trading Avancé",
                        "lessons": [
                            {"title": "Identifier les Setups Intraday", "duration": "32m", "content": "Morning range, breakout de 9h30, momentum de mid-day. Patterns récurrents chaque jour."},
                            {"title": "Gestion de Multiples Positions", "duration": "25m", "content": "Pyramider, sortie partielle, trailing stop. Gérer plusieurs trades simultanés sans stress."},
                            {"title": "Éviter le Overtrading", "duration": "20m", "content": "Limite de trades par jour, respect du plan, ne pas forcer. Qualité > Quantité."}
                        ]
                    }
                ]
            },
            {
                "title": "Money Management et Psychologie du Trader",
                "desc": "La clé du succès à long terme : gestion du risque, dimensionnement de position, discipline mentale et journal de trading.",
                "cat": "Débutant",
                "diff": 1,
                "emoji": "🧠",
                "tags": ["Psychologie", "Risk Management", "Discipline"],
                "duration": "3h 15m",
                "modules": [
                    {
                        "title": "Gestion du Risque (Risk Management)",
                        "lessons": [
                            {"title": "Règle des 1-2% par Trade", "duration": "25m", "content": "Ne jamais risquer plus de 1-2% de votre capital sur un seul trade. Protection du compte à long terme."},
                            {"title": "Calcul du Lot Size (Position Sizing)", "duration": "30m", "content": "Formule : (Capital x % Risque) / Stop Loss en pips. Outils et calculateurs automatiques."},
                            {"title": "Risk/Reward Ratio : Minimum 1:2", "duration": "28m", "content": "Pour chaque $ risqué, viser minimum 2$ de profit. Rentabilité même avec 40% de win rate."},
                            {"title": "Gérer les Drawdowns", "duration": "22m", "content": "Drawdown = perte depuis le pic. Comment réagir, réduire taille de position, ne pas revenge trade."}
                        ]
                    },
                    {
                        "title": "Psychologie et Discipline",
                        "lessons": [
                            {"title": "Les 4 Émotions Tueuses : Peur, Avidité, Espoir, Regret", "duration": "30m", "content": "Peur de perdre, avidité de gagner plus, espoir que ça remonte, regret de ne pas être entré. Gérer ces émotions."},
                            {"title": "Créer et Suivre un Plan de Trading", "duration": "25m", "content": "Stratégies, règles d'entrée/sortie, horaires, objectifs. Respecter le plan = succès."},
                            {"title": "Le Journal de Trading : Votre Meilleur Outil", "duration": "28m", "content": "Noter chaque trade : setup, émotions, résultat. Analyser les patterns de succès/échec."},
                            {"title": "Routine du Trader Pro", "duration": "20m", "content": "Routine matinale, analyse pré-market, review de fin de journée. Discipline et constance."}
                        ]
                    },
                    {
                        "title": "Erreurs Fréquentes et Comment les Éviter",
                        "lessons": [
                            {"title": "Overtrading et Revenge Trading", "duration": "18m", "content": "Trop trader par ennui, ou pour récupérer une perte. Les 2 pires erreurs du trader débutant."},
                            {"title": "FOMO : Fear of Missing Out", "duration": "15m", "content": "Entrer en retard par peur de rater le mouvement. Attendre le prochain setup."},
                            {"title": "Ignorer le Stop Loss", "duration": "17m", "content": "Déplacer son stop en espérant, ou ne pas en mettre. Recette du désastre."}
                        ]
                    }
                ]
            },
            {
                "title": "Crypto Trading : Bitcoin et Altcoins",
                "desc": "Trader les cryptomonnaies : analyse on-chain, cycles de marché, DeFi, et stratégies spécifiques au monde crypto.",
                "cat": "Intermédiaire",
                "diff": 2,
                "emoji": "₿",
                "tags": ["Crypto", "Bitcoin", "Blockchain"],
                "duration": "4h 20m",
                "modules": [
                    {
                        "title": "Fondamentaux Crypto",
                        "lessons": [
                            {"title": "Bitcoin : L'Or Numérique", "duration": "25m", "content": "Histoire, blockchain, halving, supply limitée à 21M. Pourquoi Bitcoin a de la valeur."},
                            {"title": "Ethereum et Smart Contracts", "duration": "28m", "content": "ETH 2.0, DeFi, NFTs, Gas fees. La blockchain programmable et son écosystème."},
                            {"title": "Altcoins Majeurs : SOL, ADA, BNB", "duration": "22m", "content": "Solana, Cardano, Binance Coin : cas d'usage, différences avec Bitcoin/Ethereum."}
                        ]
                    },
                    {
                        "title": "Analyse On-Chain",
                        "lessons": [
                            {"title": "Metrics On-Chain : Active Addresses, Hash Rate", "duration": "35m", "content": "Glassnode, CryptoQuant : analyser l'activité réelle du réseau blockchain."},
                            {"title": "MVRV Ratio et NVT Signal", "duration": "30m", "content": "Market Value to Realized Value, Network Value to Transactions. Détecter les tops/bottoms."},
                            {"title": "Exchange Netflows : Accumulation vs Distribution", "duration": "28m", "content": "BTC qui sort des exchanges = accumulation (bullish). BTC qui rentre = vente (bearish)."}
                        ]
                    },
                    {
                        "title": "Cycles de Marché Crypto",
                        "lessons": [
                            {"title": "Bull Market vs Bear Market", "duration": "32m", "content": "4 phases : Accumulation, Markup, Distribution, Markdown. Reconnaître où on est dans le cycle."},
                            {"title": "Bitcoin Halving et Impact sur le Prix", "duration": "28m", "content": "Tous les 4 ans, récompense divisée par 2. Historiquement : bull run 12-18 mois après."},
                            {"title": "Altseason : Quand les Altcoins Explosent", "duration": "25m", "content": "BTC domine d'abord, puis capital flow vers altcoins. Bitcoin Dominance comme indicateur."}
                        ]
                    }
                ]
            }
        ]
        
        total_lessons = 0
        total_courses = 0
        
        for c_data in curriculum:
            course = Course(
                title=c_data["title"],
                description=c_data["desc"],
                category=c_data["cat"],
                difficulty_level=c_data["diff"],
                thumbnail_emoji=c_data["emoji"],
                tags=c_data.get("tags", []),
                total_modules=len(c_data["modules"]),
                duration=c_data["duration"]
            )
            db.session.add(course)
            db.session.flush()
            total_courses += 1
            
            for m_idx, m_data in enumerate(c_data["modules"]):
                module = Module(
                    course_id=course.id,
                    title=m_data["title"],
                    order_num=m_idx + 1
                )
                db.session.add(module)
                db.session.flush()
                
                for l_idx, l_data in enumerate(m_data["lessons"]):
                    lesson = Lesson(
                        course_id=course.id,
                        module_id=module.id,
                        title=l_data["title"],
                        order_num=l_idx + 1,
                        duration=l_data["duration"],
                        content=l_data["content"]
                    )
                    db.session.add(lesson)
                    db.session.flush()
                    total_lessons += 1
                    
                    quiz = Quiz(
                        lesson_id=lesson.id,
                        title=f"Quiz : {l_data['title']}",
                        passing_score=70
                    )
                    db.session.add(quiz)
                    db.session.flush()
                    
                    questions = [
                        {"text": f"Quelle est la notion clé de cette leçon : {l_data['title']} ?", "options": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"], "correct": 1, "explanation": "Cette réponse est correcte car elle correspond au concept principal enseigné."},
                        {"text": f"Comment appliquer {l_data['title']} en pratique ?", "options": ["Méthode 1", "Méthode 2", "Méthode 3", "Méthode 4"], "correct": 0, "explanation": "La méthode 1 est recommandée par les professionnels."},
                        {"text": f"Quelle erreur doit-on éviter avec {l_data['title']} ?", "options": ["Erreur A", "Erreur B", "Erreur C", "Erreur D"], "correct": 2, "explanation": "L'erreur C est la plus fréquente chez les débutants."}
                    ]
                    
                    for q_data in questions:
                        question = Question(
                            quiz_id=quiz.id,
                            question_text=q_data["text"],
                            options=q_data["options"],
                            correct_answer=q_data["correct"],
                            explanation=q_data["explanation"]
                        )
                        db.session.add(question)
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": f"Successfully added {total_courses} professional trading courses with {total_lessons} lessons!",
            "courses": total_courses,
            "lessons": total_lessons,
            "note": "Vous pouvez maintenant supprimer cet endpoint pour des raisons de sécurité."
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
