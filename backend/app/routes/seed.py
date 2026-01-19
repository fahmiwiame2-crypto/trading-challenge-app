from flask import Blueprint, jsonify, request
from app.models import Course, Module, Lesson, Quiz, Question, User, Trade, db
from datetime import datetime, timedelta
import random

seed_bp = Blueprint('seed', __name__)

@seed_bp.route('/seed-top-traders', methods=['GET', 'POST'])
def seed_top_traders():
    """Seed Top 10 Demo Traders for Leaderboard - accessible via URL"""
    try:
        secret = request.args.get('secret') or (request.json or {}).get('secret')
        
        if secret != "seed-2026":
            return jsonify({"error": "Secret incorrect. Use ?secret=seed-2026"}), 403
        
        # Top 10 Demo Traders with realistic performance
        demo_traders = [
            {"username": "CryptoKing", "email": "cryptoking@demo.com", "profit_pct": 45.2, "trades": 124},
            {"username": "AtlasTrader", "email": "atlastrader@demo.com", "profit_pct": 32.8, "trades": 89},
            {"username": "WhaleHunter", "email": "whalehunter@demo.com", "profit_pct": 28.5, "trades": 210},
            {"username": "MarketMaster", "email": "marketmaster@demo.com", "profit_pct": 25.3, "trades": 156},
            {"username": "TradingPro", "email": "tradingpro@demo.com", "profit_pct": 22.1, "trades": 98},
            {"username": "BullRun", "email": "bullrun@demo.com", "profit_pct": 19.8, "trades": 134},
            {"username": "DiamondHands", "email": "diamondhands@demo.com", "profit_pct": 17.5, "trades": 87},
            {"username": "MoonShot", "email": "moonshot@demo.com", "profit_pct": 15.2, "trades": 112},
            {"username": "ChartWizard", "email": "chartwizard@demo.com", "profit_pct": 13.9, "trades": 145},
            {"username": "AlphaSeeker", "email": "alphaseeker@demo.com", "profit_pct": 12.4, "trades": 76},
        ]
        
        results = []
        
        for trader_data in demo_traders:
            existing = User.query.filter_by(username=trader_data["username"]).first()
            
            if existing:
                # Update existing user
                existing.initial_capital = 100000.0
                existing.balance = 100000.0 * (1 + trader_data["profit_pct"] / 100)
                existing.status = random.choice(['ACTIVE', 'ACTIVE', 'PASSED'])
                results.append({"username": trader_data["username"], "action": "updated"})
            else:
                # Create new user
                initial_capital = 100000.0
                balance = initial_capital * (1 + trader_data["profit_pct"] / 100)
                
                user = User(
                    username=trader_data["username"],
                    email=trader_data["email"],
                    password_hash="demo_password_hash",
                    role="USER",
                    status=random.choice(['ACTIVE', 'ACTIVE', 'PASSED']),
                    initial_capital=initial_capital,
                    balance=balance,
                    daily_starting_equity=balance
                )
                db.session.add(user)
                db.session.flush()
                
                # Create demo trades
                symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'GOOGL', 'EUR/USD', 'XAU/USD']
                for i in range(trader_data["trades"]):
                    trade = Trade(
                        user_id=user.id,
                        symbol=random.choice(symbols),
                        quantity=round(random.uniform(0.1, 10.0), 2),
                        price=round(random.uniform(100, 50000), 2),
                        type=random.choice(['BUY', 'SELL']),
                        status='CLOSED',
                        pnl=round(random.uniform(-500, 1500), 2),
                        timestamp=datetime.now() - timedelta(days=random.randint(1, 30))
                    )
                    db.session.add(trade)
                
                results.append({"username": trader_data["username"], "action": "created", "trades": trader_data["trades"]})
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Top 10 Demo Traders seeded successfully!",
            "traders": results
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@seed_bp.route('/seed-courses', methods=['POST'])
def seed_courses():
    try:
        data = request.json or {}
        secret = data.get('secret')
        force = data.get('force', False)
        
        if secret != "seed-courses-2026":
            return jsonify({"error": "Secret incorrect"}), 403
        
        existing_count = Course.query.count()
        if existing_count > 0 and not force:
            return jsonify({
                "message": f"{existing_count} cours existent déjà. Utilisez force=true pour réinitialiser.",
                "existing_courses": existing_count
            }), 400
        
        if force:
            # Delete in order of dependence to avoid foreign key violations
            Question.query.delete()
            Quiz.query.delete()
            Lesson.query.delete()
            Module.query.delete()
            Course.query.delete()
            db.session.commit()
        
        curriculum = [
            {
                "title": "1. Introduction au Trading : De Zéro à Pro",
                "desc": "La fondation absolue. Apprenez comment fonctionne réellement l'économie mondiale, qui sont les 'Market Makers', et comment placer vos premiers pions stratégiques.",
                "cat": "Débutant",
                "diff": 1,
                "emoji": "🎓",
                "tags": ["Bases", "Économie", "Introduction"],
                "duration": "4h 15m",
                "modules": [
                    {
                        "title": "Module 1: Comprendre la Mécanique des Marchés",
                        "lessons": [
                            {
                                "title": "Qu'est-ce que le Trading réellement ?",
                                "duration": "25m",
                                "content": """
## 1. La Définition au-delà du dictionnaire
Le trading n'est pas un jeu de hasard, c'est l'activité d'apporter de la **liquidité** au marché en échange d'une opportunité de profit. C'est l'art de spéculer sur la valeur future d'un actif (action, devise, crypto) en se basant sur une analyse rigoureuse.

### Pourquoi le prix bouge-t-il ?
Tout se résume à une seule loi universelle : **L'Offre et la Demande**.
*   Si plus de gens veulent acheter (Demande) que vendre (Offre), le prix monte.
*   Si plus de gens veulent vendre qu'acheter, le prix baisse.

## 2. Le Mythe du 'Gagner Vite'
Le trading est souvent présenté comme un moyen de devenir riche en une nuit. C'est le moyen le plus sûr de perdre tout son capital. 
**La Réalité :** Le trading est un business sérieux qui demande :
1.  **Discipline de fer** (respecter ses propres règles).
2.  **Gestion émotionnelle** (ne pas paniquer quand le prix baisse).
3.  **Apprentissage continu** (le marché change tous les jours).

## 3. Les Différents Styles de Trading
Selon le temps que vous pouvez y consacrer, vous choisirez un style :
*   **Scalping** : Vous ouvrez et fermez des dizaines de positions en quelques minutes. C'est intense et demande une concentration totale.
*   **Day Trading** : Toutes vos positions sont fermées avant la fin de la journée. Pas de stress pendant la nuit.
*   **Swing Trading** : Vous gardez vos positions plusieurs jours ou semaines. Idéal si vous avez un travail à côté.
"""
                            },
                            {
                                "title": "Forex, Actions et Crypto : Quel terrain choisir ?",
                                "duration": "30m",
                                "content": """
## Choisir son marché
Chaque marché a sa propre 'personnalité'.

### 1. Le Forex (Foreign Exchange)
C'est le marché des devises (Euro, Dollar, Yen). C'est le plus grand marché au monde (+6 trillions $/jour).
*   **Points Forts** : Ouvert 24h/5, liquidité immense.
*   **Risques** : Sensible aux décisions des banques centrales (FED, BCE).

### 2. Le Marché des Actions
Achat de parts d'entreprises (Apple, Tesla).
*   **Points Forts** : Plus concret pour les débutants. Dividendes possibles.
*   **Horaires** : Fixes (ex: 15h30-22h pour les US).

### 3. Les Cryptomonnaies
Bitcoin, Ethereum et Altcoins.
*   **Points Forts** : Volatilité extrême = gros gains potentiels. Ouvert 7j/7.
*   **Risques** : Volatilité extrême = pertes rapides. Sécurité des plateformes.
"""
                            }
                        ]
                    }
                ]
            },
            {
                "title": "2. Analyse Technique : Maîtriser les Graphiques",
                "desc": "L'art de lire les prix. Apprenez à identifier les zones de rebond, la force d'une tendance et le langage des chandeliers japonais.",
                "cat": "Intermédiaire",
                "diff": 2,
                "emoji": "📊",
                "tags": ["Analyse", "Price Action", "Graphiques"],
                "duration": "5h 30m",
                "modules": [
                    {
                        "title": "Module 1: Le Langage des Chantiers",
                        "lessons": [
                            {
                                "title": "Anatomie d'une Bougie Japonaise",
                                "duration": "20m",
                                "content": """
## Lire l'invisible
Une bougie n'est pas qu'un rectangle de couleur. Elle montre qui a gagné la bataille.

### Les Composants :
*   **Corps (Body)** : Espace entre l'ouverture et la clôture. Plus il est grand, plus la pression est forte.
*   **Mèches (Wicks)** : Montrent les prix rejetés. Une longue mèche haute signifie que les acheteurs ont essayé de monter mais ont été repoussés par les vendeurs.

### Patterns Clés :
1.  **Pin Bar** : Rejet massif. Signal de retournement.
2.  **Engulfing** : Une bougie dévore la précédente. Changement de contrôle.
3.  **Doji** : Indécision totale. Le calme avant la tempête.
"""
                            },
                            {
                                "title": "Supports et Résistances : Le Sol et le Plafond",
                                "duration": "35m",
                                "content": """
## Les Zones de Mémoire
Le marché a une mémoire. Les prix ont tendance à rebondir là où ils ont rebondi auparavant.

### Définitions :
*   **Support** : Niveau BAS où les acheteurs interviennent.
*   **Résistance** : Niveau HAUT où les vendeurs interviennent.

### Règle d'or :
Ne tracez pas des lignes au millimètre près, tracez des **ZONES**. Le trading est une science de probabilité, pas de précision atomique.
*   *Inversion de polarité :* Une résistance cassée devient souvent un support.
"""
                            }
                        ]
                    }
                ]
            },
            {
                "title": "3. Stratégies Trading Forex Avancées",
                "desc": "Passez à la vitesse supérieure. Apprenez le Price Action institutionnel, le concept de liquidité et les secrets du Smart Money.",
                "cat": "Avancé",
                "diff": 3,
                "emoji": "💱",
                "tags": ["Forex", "SMC", "Liquidité"],
                "duration": "6h 00m",
                "modules": [
                    {
                        "title": "Module 1: Smart Money Concepts (SMC)",
                        "lessons": [
                            {
                                "title": "La Structure de Marché (BOS et CHoCH)",
                                "duration": "45m",
                                "content": """
## Suivre les 'Smart Money'
Les banques et institutions ne tradent pas comme vous. Pour gagner, vous devez suivre leurs traces.

### 1. BOS (Break of Structure)
Dans une tendance haussière, quand le prix casse un sommet précédent, la tendance continue. C'est un BOS.

### 2. CHoCH (Change of Character)
C'est le signal le plus important. Quand le prix casse le dernier creux d'une tendance haussière, cela signifie que les vendeurs ont pris le relais. La tendance se retourne probablement ici.

## Pourquoi est-ce crucial ?
90% des traders perdent car ils tradent contre la structure de marché. En maîtrisant le CHoCH, vous entrez au début du nouveau mouvement.
"""
                            },
                            {
                                "title": "Order Blocks et Fair Value Gaps (FVG)",
                                "duration": "40m",
                                "content": """
## Les Empreintes Institutionnelles
Les banques laissent des 'trous' dans le marché quand elles achètent massivement.

### Fair Value Gap (FVG)
C'est un déséquilibre de prix. Le marché a horreur du vide et revient presque toujours combler ces Gaps avant de continuer sa route. C'est une zone d'entrée parfaite.

### Order Block (OB)
C'est la dernière zone d'accumulation ou de distribution avant un mouvement violent. Considérez-le comme une station-service. Le prix revient à l'OB pour 'faire le plein' d'ordres avant d'exploser.
"""
                            }
                        ]
                    }
                ]
            },
            {
                "title": "4. Scalping et Day Trading : Discipline et Vitesse",
                "desc": "L'école de la rigueur. Apprenez à extraire des profits quotidiens en quelques minutes avec des setups de haute précision.",
                "cat": "Avancé",
                "diff": 3,
                "emoji": "⚡",
                "tags": ["Scalping", "Intraday", "Rapidité"],
                "duration": "4h 30m",
                "modules": [
                    {
                        "title": "Module 1: Setups de Haute Probabilité",
                        "lessons": [
                            {
                                "title": "Le Scalping M1 : Entrée Chirurgicale",
                                "duration": "30m",
                                "content": """
## Le Scalping n'est pas pour tout le monde
C'est la discipline la plus exigeante. Vous devez être rapide et sans émotion.

### Ma Stratégie M1 'VWAP Rejection' :
1.  **Le VWAP** : C'est le prix moyen pondéré par le volume.
2.  **L'entrée** : Si le prix est en tendance haussière sur M15, on attend qu'il touche le VWAP sur M1.
3.  **Le Rejet** : On attend une Pin Bar ou une Engulfing sur cette ligne pour acheter.
4.  **Target** : On vise 2 à 3 pips rapidement.

## Un mot sur les Frais (Fees)
En scalping, le spread est votre pire ennemi. Ne scalpez que les paires majeures (EURUSD, USDJPY) avec des comptes ECN à spread zéro.
"""
                            }
                        ]
                    }
                ]
            },
            {
                "title": "5. Psychologie et Money Management",
                "desc": "La clé de 90% des traders rentables. Blindez votre mental contre l'avidité et la peur, et sécurisez votre capital.",
                "cat": "Expert",
                "diff": 1,
                "emoji": "🧠",
                "tags": ["Psychologie", "Risque", "Succès"],
                "duration": "5h 00m",
                "modules": [
                    {
                        "title": "Module 1: Protéger son Capital",
                        "lessons": [
                            {
                                "title": "La Règle Sacrée du 1%",
                                "duration": "30m",
                                "content": """
## Pourquoi vous allez échouer sans ça
La plupart des débutants risquent trop sur un seul trade. Une série de 5 pertes et leur compte est fini.

### La Méthode :
Ne risquez JAMAIS plus de 1% de votre capital total par trade.
*   Si vous avez 10 000$, vous ne devez pas perdre plus de 100$ par trade.
*   De cette manière, vous avez besoin de **100 erreurs consécutives** pour perdre votre compte. C'est statistiquement très rare si vous avez une stratégie.

### Le Risk/Reward Ratio (RR)
Visez toujours un RR de **1:2** minimum. 
Cela signifie que pour chaque dollar risqué, vous en gagnez deux. Avec un RR de 1:2, vous pouvez vous tromper une fois sur deux et rester très profitable !
"""
                            },
                            {
                                "title": "Gérer ses Émotions : Peur et Avidité",
                                "duration": "25m",
                                "content": """
## Le Trader contre son Cerveau
Votre cerveau n'est pas conçu pour le trading. Il est conçu pour la survie.

### Les 2 émotions tueuses :
1.  **La Peur (Fear)** : Elle vous fait fermer vos gains trop tôt ou vous empêche d'entrer dans un bon trade.
2.  **L'Avidité (Greed)** : Elle vous fait risquer trop ou ne pas prendre vos profits en espérant que ça monte indéfiniment.

**La Solution :** Le Journal de Trading. Notez chaque trade, vos émotions et respectez votre plan. Si c'est écrit, c'est un contrat avec vous-même.
"""
                            }
                        ]
                    }
                ]
            },
            {
                "title": "6. Crypto Trading : Bitcoin et Au-delà",
                "desc": "Naviguez dans le monde des actifs numériques. Comprenez les cycles du Bitcoin, les Altcoins et l'analyse On-Chain.",
                "cat": "Intermédiaire",
                "diff": 2,
                "emoji": "₿",
                "tags": ["Crypto", "Bitcoin", "Cycles"],
                "duration": "4h 45m",
                "modules": [
                    {
                        "title": "Module 1: Les Cycles du Marché Crypto",
                        "lessons": [
                            {
                                "title": "Le Bitcoin Halving et ses effets",
                                "duration": "35m",
                                "content": """
## Comprendre le Cycle de 4 ans
Le Bitcoin a un mécanisme unique : le Halving. Tous les 4 ans, la création de nouveaux Bitcoins est divisée par 2.

### Pourquoi est-ce Bullish ?
C'est une question de rareté. Si la demande reste la même mais que l'offre diminue, le prix explose. Historiquement, chaque Halving a été suivi d'un nouveau sommet historique (ATH) dans les 12 à 18 mois.

### Les Phases du Cycle :
1.  **Accumulation** (Dépression) : Les prix sont bas, personne n'y croit.
2.  **Expansion** (Euphorie) : Tout le monde en parle aux infos.
3.  **Distribution** : Les gros poissons vendent aux petits nouveaux.
4.  **Correction** : Le crash nécessaire pour purger le marché.
"""
                            }
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
                        {"text": f"D'après le cours sur '{l_data['title']}', quel est le point clé ?", "options": ["Concept A", "Concept B", "La réponse correcte", "Concept D"], "correct": 2, "explanation": "Cette réponse est directement tirée du contenu pédagogique détaillé ci-dessus."},
                        {"text": "Pourquoi devrions-nous appliquer cette méthode ?", "options": ["Parce que c'est simple", "Pour maximiser la rentabilité", "Pour éviter les pertes inutiles", "Toutes ces réponses"], "correct": 3, "explanation": "La méthode vise une approche holistique du profit."},
                        {"text": "Quelle erreur est la plus fréquente ici ?", "options": ["Ne pas avoir de plan", "Avoir peur", "Oublier le Stop Loss", "Ignorer les fondations"], "correct": 2, "explanation": "Sans Stop Loss, le capital est en danger critique."}
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
            "message": f"Successfully added {total_courses} deeply detailed courses!",
            "courses": total_courses,
            "lessons": total_lessons
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
