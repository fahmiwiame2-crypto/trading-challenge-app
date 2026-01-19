from app import create_app, db
from app.models import Course, Lesson, Quiz, UserProgress, Certificate

def seed_courses():
    app = create_app()
    with app.app_context():
        print("Clearing existing course data...")
        try:
            db.session.query(Certificate).delete()
            db.session.query(UserProgress).delete()
            db.session.query(Quiz).delete()
            db.session.query(Lesson).delete()
            db.session.query(Course).delete()
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error clearing data: {e}")
            return

        print("Seeding courses with text content and quizzes...")
        
        # Course 1: Fundamentals
        c1 = Course(
            title='Les Fondamentaux du Prop Trading',
            description='Maîtrisez les bases du trading pour compte propre et la gestion des risques.',
            total_modules=7,
            duration='65m',
            category='Débutant',
            difficulty_level=1,
            tags=['fondamentaux', 'prop trading', 'règles', 'psychologie'],
            thumbnail_emoji='📊'
        )
        db.session.add(c1)
        db.session.commit()

        # Lesson 1
        l1 = Lesson(
            course_id=c1.id, 
            title="Qu'est-ce que le Prop Trading ?", 
            duration="10m",
            content="""# Qu'est-ce que le Prop Trading ?

Le **Prop Trading** (Proprietary Trading) est une approche où vous tradez avec le capital d'une entreprise spécialisée plutôt qu'avec votre propre argent.

## Comment ça fonctionne ?

1. **Challenge d'Évaluation**: Vous passez un test pour prouver vos compétences
2. **Financement**: Si vous réussissez, la firme vous donne accès à un compte financé (10k€ à 200k€+)
3. **Partage des Profits**: Vous gardez 70-90% des profits que vous générez

## Avantages

✅ **Pas de risque personnel**: Vous ne perdez pas votre propre argent  
✅ **Capital important**: Accès à des sommes que vous n'auriez pas seul  
✅ **Scaling**: Possibilité d'augmenter votre capital avec de bons résultats

## Désavantages

❌ **Règles strictes**: Drawdown limité, profit targets  
❌ **Frais**: Coût du challenge d'évaluation (50€-500€)  
❌ **Pression**: Vous devez performer sous contraintes
""",
            order=1
        )
        db.session.add(l1)
        db.session.commit()

        q1 = Quiz(
            lesson_id=l1.id,
            questions=[
                {
                    "question": "Qu'est-ce que le Prop Trading ?",
                    "options": [
                        "Trader avec son propre capital",
                        "Trader avec le capital d'une entreprise",
                        "Acheter des actions à long terme",
                        "Investir dans l'immobilier"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel pourcentage des profits gardez-vous généralement ?",
                    "options": ["10-20%", "30-40%", "50-60%", "70-90%"],
                    "correct": 3
                },
                {
                    "question": "Quel est le principal avantage du prop trading ?",
                    "options": [
                        "Pas de règles",
                        "Gratuit",
                        "Pas de risque personnel",
                        "Garantie de profit"
                    ],
                    "correct": 2
                },
                {
                    "question": "Quelle est la première étape pour devenir prop trader ?",
                    "options": [
                        "Recevoir l'argent immédiatement",
                        "Passer un challenge d'évaluation",
                        "Payer un abonnement mensuel",
                        "Acheter des actions"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel est un désavantage du prop trading ?",
                    "options": [
                        "Trop de capital",
                        "Pas de règles",
                        "Règles strictes à respecter",
                        "Pas de partage de profits"
                    ],
                    "correct": 2
                }
            ]
        )
        db.session.add(q1)

        # Lesson 2
        l2 = Lesson(
            course_id=c1.id,
            title="Comprendre les Règles de Financement",
            duration="10m",
            content="""# Les Règles des Prop Firms

Les prop firms imposent des règles strictes pour protéger leur capital.

## Règles Principales

### 1. **Drawdown Maximal** 📉
- **Daily Drawdown**: Perte maximale par jour (ex: -5%)
- **Max Drawdown**: Perte totale maximale (ex: -10%)

### 2. **Profit Target** 🎯
- Phase 1: Atteindre +8% de profit
- Phase 2: Atteindre +5% de profit
- Puis vous êtes financé !

### 3. **Consistance**
- Certaines firms limitent le profit par jour (ex: maximum 30% du profit total en une journée)

## Exemple Concret

**Compte de 100,000€**:
- Daily Drawdown: -5,000€ max par jour
- Max Drawdown: -10,000€ total
- Profit Target Phase 1: +8,000€

## Conseils

💡 **Respectez TOUJOURS les règles** - Un seul écart = compte fermé  
💡 **Utilisez un stop loss** - Protection automatique  
💡 **Tradez petit au début** - Mieux vaut avancer lentement que perdre le compte
""",
            order=2
        )
        db.session.add(l2)
        db.session.commit()

        q2 = Quiz(
            lesson_id=l2.id,
            questions=[
                {
                    "question": "Qu'est-ce que le Daily Drawdown ?",
                    "options": [
                        "Profit maximum par jour",
                        "Perte maximale par jour",
                        "Nombre de trades par jour",
                        "Capital initial"
                    ],
                    "correct": 1
                },
                {
                    "question": "Que se passe-t-il si vous dépassez le drawdown ?",
                    "options": [
                        "Rien",
                        "Avertissement",
                        "Compte fermé immédiatement",
                        "Réduction du capital"
                    ],
                    "correct": 2
                },
                {
                    "question": "Quel est généralement le profit target de Phase 1 ?",
                    "options": ["+2%", "+5%", "+8%", "+15%"],
                    "correct": 2
                },
                {
                    "question": "Pourquoi les prop firms imposent des règles de consistance ?",
                    "options": [
                        "Pour vous ralentir",
                        "Pour éviter le gambling/chance",
                        "Pour augmenter leurs profits",
                        "C'est illégal sinon"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel est le meilleur conseil pour réussir ?",
                    "options": [
                        "Trader le plus possible",
                        "Ignorer les règles",
                        "Respecter les règles et trader petit",
                        "Utiliser tout le capital"
                    ],
                    "correct": 2
                }
            ]
        )
        db.session.add(q2)

        # Lesson 3
        l3 = Lesson(
            course_id=c1.id,
            title="Gestion du Risque (Guide Complet)",
            duration="12m",
            content="""# Gestion du Risque

La gestion du risque est **LA** compétence #1 pour réussir en prop trading.

## La Règle des 1-2%

Ne risquez JAMAIS plus de **1-2% de votre capital** par trade.

### Exemple:
- **Capital**: 100,000€
- **Risque par trade**: 1% = 1,000€ max
- Si votre stop loss est à -500€, vous pouvez prendre 2 positions

## Position Sizing

**Formula**:
```
Taille de position = (Capital × % Risque) / Distance au stop loss
```

**Exemple**:
- Capital: 100,000€
- Risque: 1% = 1,000€
- Entry: 50€ / Stop Loss: 49€ (distance = 1€)
- **Position**: 1,000 actions max

## Risk/Reward Ratio

Visez minimum **1:2** (risquer 1€ pour gagner 2€)

📊 **Exemple**:
- Entry: 100€
- Stop Loss: 98€ (risque = -2€)
- Take Profit: 104€ (gain = +4€)
- **Ratio**: 1:2 ✅

## Les 3 Règles d'Or

1️⃣ **Stop Loss Obligatoire** - Toujours avant d'entrer  
2️⃣ **Max 1-2% Par Trade** - Protection du capital  
3️⃣ **Ratio 1:2 Minimum** - Rentabilité à long terme
""",
            order=3
        )
        db.session.add(l3)
        db.session.commit()

        q3 = Quiz(
            lesson_id=l3.id,
            questions=[
                {
                    "question": "Quel pourcentage maximum devriez-vous risquer par trade ?",
                    "options": ["5-10%", "3-5%", "1-2%", "0.5%"],
                    "correct": 2
                },
                {
                    "question": "Qu'est-ce qu'un ratio Risk/Reward de 1:2 ?",
                    "options": [
                        "Risquer 2€ pour gagner 1€",
                        "Risquer 1€ pour gagner 2€",
                        "Faire 2 trades pour 1 profit",
                        "Perdre 2 fois plus que gagner"
                    ],
                    "correct": 1
                },
                {
                    "question": "Pourquoi utiliser un stop loss ?",
                    "options": [
                        "C'est optionnel",
                        "Protection automatique du capital",
                        "Pour trader plus",
                        "Pour impressionner"
                    ],
                    "correct": 1
                },
                {
                    "question": "Avec 100k€ de capital et 1% de risque, combien risquez-vous max par trade ?",
                    "options": ["10€", "100€", "1,000€", "5,000€"],
                    "correct": 2
                },
                {
                    "question": "Quelle est LA règle la plus importante ?",
                    "options": [
                        "Trader beaucoup",
                        "Ne jamais utiliser stop loss",
                        "Toujours protéger son capital",
                        "Viser 10% par trade"
                    ],
                    "correct": 2
                }
            ]
        )
        db.session.add(q3)

        # Lesson 4 & 5 (shorter for brevity)
        l4 = Lesson(
            course_id=c1.id,
            title="Psychologie : Trader comme un Pro",
            duration="8m",
            content="""# Psychologie du Trading

90% du trading est mental. Voici les pièges à éviter.

## Les 3 Émotions Toxiques

### 1. **FOMO** (Fear Of Missing Out)
😰 "Je dois entrer MAINTENANT sinon je rate l'opportunité !"
✅ **Solution**: Attendez votre setup. Il y a toujours d'autres opportunités.

### 2. **Revenge Trading**
😡 Après une perte, vous voulez vous "venger" du marché
✅ **Solution**: Si vous perdez 2 trades d'affilée, STOP pour aujourd'hui.

### 3. **Overconfidence**
😎 Après 3-4 wins: "Je suis un génie, je peux tout risquer !"
✅ **Solution**: Respectez TOUJOURS votre plan, peu importe les résultats.

## Le Mindset Gagnant

📝 **Journaling**: Notez chaque trade et vos émotions  
🎯 **Process > Results**: Focalisez sur le respect du plan, pas sur l'argent  
🧘 **Discipline**: Le trading est ennuyeux quand c'est bien fait

## Citation Clé
> "Les meilleurs traders ne sont pas les plus intelligents, mais les plus disciplinés." - Mark Douglas
""",
            order=4
        )
        db.session.add(l4)
        db.session.commit()

        q4 = Quiz(
            lesson_id=l4.id,
            questions=[
                {
                    "question": "Qu'est-ce que le FOMO ?",
                    "options": [
                        "Fear Of Missing Out",
                        "Follow Only My Orders",
                        "First Order Market Open",
                        "Find Opportunities More Often"
                    ],
                    "correct": 0
                },
                {
                    "question": "Que faire après 2 pertes consécutives ?",
                    "options": [
                        "Doubler la position",
                        "Arrêter pour aujourd'hui",
                        "Changer de stratégie",
                        "Trader plus vite"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce que le revenge trading ?",
                    "options": [
                        "Une stratégie avancée",
                        "Trader pour se venger du marché après une perte",
                        "Un type d'analyse",
                        "Suivre la revanche d'un titre"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel est le mindset à adopter ?", 
                    "options": [
                        "Process over Results",
                        "Money over Everything",
                        "Risk everything",
                        "Trade non-stop"
                    ],
                    "correct": 0
                },
                {
                    "question": "Quel pourcentage du trading est mental ?",
                    "options": ["50%", "70%", "90%", "100%"],
                    "correct": 2
                }
            ]
        )
        db.session.add(q4)

        l5 = Lesson(
            course_id=c1.id,
            title="Créer son Plan de Trading",
            duration="15m",
            content="""# Votre Plan de Trading

Un plan de trading est votre **GPS** sur les marchés.

## Structure d'un Plan

### 1. Mar**Marchés & Instruments**
- Quels marchés? (Forex, Indices, Crypto)
- Quels instruments? (EUR/USD, Nasdaq, BTC/USD)

### 2. **Timeframes**
- Timeframe d'analyse: H4 / Daily
- Timeframe d'exécution: M15 / H1

### 3. **Stratégie d'Entrée**
Exemples:
- Breakout d'une résistance clé + retest
- Support/Resistance bounce avec confluence RSI
- Pattern Smart Money (Order Block + FVG)

### 4. **Gestion du Risque**
- Risque max par trade: **1-2%**
- Risk/Reward minimum: **1:2**
- Max 3 trades par jour

### 5. **Règles de Sortie**
- ✅ Take Profit défini avant l'entrée
- 🛑 Stop Loss toujours placé
- 📍 Trailing stop optionnel après +1R

## Template Simple

```
MARCHÉ: EUR/USD
TIMEFRAME: H4 analyse, M15 entry
SETUP: Break + Retest de résistance  
RISQUE: 1% max
R:R: 1:2 minimum
MAX TRADES/JOUR: 3
```

## Conseil Final

💡 **Écrivez votre plan et RESPECTEZ-LE**. Pas de plan = Gambling.
""",
            order=5
        )
        db.session.add(l5)
        db.session.commit()

        q5 = Quiz(
            lesson_id=l5.id,
            questions=[
                {
                    "question": "Qu'est-ce qu'un plan de trading ?",
                    "options": [
                        "Une liste de trades",
                        "Un GPS pour vos décisions de trading",
                        "Un journal",
                        "Une stratégie secrète"
                    ],
                    "correct": 1
                },
                {
                    "question": "Que doit inclure un plan de trading ?",
                    "options": [
                        "Seulement les marchés",
                        "Seulement la stratégie",
                        "Marchés, stratégie, risque et règles",
                        "Rien d'important"
                    ],
                    "correct": 2
                },
                {
                    "question": "Quel est le risque max recommandé par trade ?",
                    "options": ["5%", "3%", "1-2%", "10%"],
                    "correct": 2
                },
                {
                    "question": "Pourquoi est-il important de définir le Take Profit avant l'entrée ?",
                    "options": [
                        "Pour éviter les décisions émotionnelles",
                        "C'est optionnel",
                        "Pour trader plus vite",
                        "Pour impressionner"
                    ],
                    "correct": 0
                },
                {
                    "question": "Que se passe-t-il si vous tradez sans plan ?",
                    "options": [
                        "Vous devenez meilleur",
                        "Rien",
                        "C'est du gambling",
                        "Vous gagnez plus"
                    ],
                    "correct": 2
                }
            ]
        )
        db.session.add(q5)

        # Lesson 5b - Choisir sa Prop Firm
        l5b = Lesson(
            course_id=c1.id,
            title="Choisir sa Prop Firm",
            duration="10m",
            content="""# Comment Choisir sa Prop Firm

La bonne prop firm peut faire la différence entre succès et échec.

## Critères de Sélection

### 1. **Réputation** ⭐
- Vérifier les avis (Trustpilot, forums)
- Éviter les nouvelles firms sans historique
- Rechercher retours d'expérience

### 2. **Règles de Trading**
- **Drawdown**: Maximum 5-12%
- **Profit Target**: 8-10% Phase 1
- **Temps limite**: Illimité = meilleur

### 3. **Profit Split**
- Minimum acceptable: **70%**
- Standard: **80%**
- Premium: **90%+**

### 4. **Coût du Challenge**
| Taille Compte | Prix Moyen |
|---------------|------------|
| 10-25k€ | 100-200€ |
| 50k€ | 250-350€ |
| 100k€ | 450-600€ |

## Red Flags 🚩

❌ **Paiements retardés/refusés**: Vérifier processus payout  
❌ **Règles floues**: Conditions cachées  
❌ **Service client absent**: Test avant achat  
❌ **Prix trop bas**: Si c'est trop beau...

## Top Firms Recommandées

1. **FTMO** - Référence mondiale
2. **The Funded Trader** - Bonnes conditions
3. **Topstep** (Futures) - Spécialisé
4. **My Forex Funds** - Accessible
5. **True Forex Funds** - Compétitif

## Conseil

💡 **Commencez petit** (10-25k) pour apprendre les règles avant d'investir plus.
""",
            order=6
        )
        db.session.add(l5b)
        db.session.commit()

        q5b = Quiz(
            lesson_id=l5b.id,
            questions=[
                {
                    "question": "Quel critère est le PLUS important pour choisir une prop firm ?",
                    "options": [
                        "Le design du site web",
                        "La réputation et les paiements fiables",
                        "Le prix le plus bas",
                        "Le nombre de réseaux sociaux"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel profit split minimum viser ?",
                    "options": ["40%", "50%", "70%", "100%"],
                    "correct": 2
                },
                {
                    "question": "Quel est un Red Flag chez une prop firm ?",
                    "options": [
                        "Paiements rapides",
                        "Service client réactif",
                        "Paiements retardés/refusés",
                        "Règles claires"
                    ],
                    "correct": 2
                },
                {
                    "question": "Avec quelle taille de compte commencer ?",
                    "options": ["200k€", "100k€", "10-25k€", "1M€"],
                    "correct": 2
                },
                {
                    "question": "Pourquoi éviter les nouvelles firms sans historique ?",
                    "options": [
                        "Elles sont toutes arnaques",
                        "Risque inconnu, pas de retours d'expérience",
                        "Ça n'a pas d'importance",
                        "Elles sont moins chères"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q5b)

        # Lesson 5c - Erreurs de Débutant
        l5c = Lesson(
            course_id=c1.id,
            title="10 Erreurs de Débutant à Éviter",
            duration="12m",
            content="""# Erreurs Fatales du Prop Trader Débutant

Évitez ces pièges courants pour protéger votre capital.

## ❌ Les 10 Erreurs Classiques

### 1. **Ignorer le Daily Drawdown**
> "Je vais me rattraper demain..."

⚠️ Un seul jour peut ruiner votre challenge!

### 2. **Over-Trading**
- Trop de trades = trop de risque
- Qualité > Quantité
- Max 3-5 trades/jour recommandés

### 3. **Trader Sans Stop Loss**
> "Mon analyse est parfaite, pas besoin de SL"

🛑 TOUJOURS définir le SL AVANT d'entrer!

### 4. **Augmenter la Taille Après une Perte**
- Le revenge trading mène à la ruine
- Gardez la même taille ou diminuez

### 5. **Ignorer les Heures de Trading**
- Éviter 5 min avant news majeures
- Meilleurs moments: 8h-12h, 14h-18h (sessions)

### 6. **Copier Aveuglément les Signaux**
- Pas votre argent = pas votre responsabilité
- Comprenez CHAQUE trade

### 7. **Ne Pas Tenir de Journal**
Sans journal = pas de progression

### 8. **Changer de Stratégie Trop Souvent**
- Maîtrisez UNE stratégie d'abord
- Changement = reset de l'apprentissage

### 9. **Oublier les Frais/Commissions**
- Spread + Swap = coûts cachés
- Intégrez dans vos calculs R:R

### 10. **Négliger son Mental**
- Trading fatigué = erreurs
- Pause si stress/émotions

## ✅ Checklist Pré-Trade

☑️ Mon setup est-il clair ?  
☑️ Mon SL est-il placé ?  
☑️ Mon risque est-il < 1-2% ?  
☑️ Ai-je vérifié les news ?  
☑️ Suis-je en état émotionnel stable ?

> "La différence entre amateur et pro: le pro évite les erreurs basiques."
""",
            order=7
        )
        db.session.add(l5c)
        db.session.commit()

        q5c = Quiz(
            lesson_id=l5c.id,
            questions=[
                {
                    "question": "Quelle est l'erreur #1 des débutants en prop trading ?",
                    "options": [
                        "Trader trop peu",
                        "Ignorer le daily drawdown",
                        "Utiliser stop loss",
                        "Suivre un plan"
                    ],
                    "correct": 1
                },
                {
                    "question": "Combien de trades maximum par jour sont recommandés ?",
                    "options": ["20-30", "10-15", "3-5", "1"],
                    "correct": 2
                },
                {
                    "question": "Que faire après une perte ?",
                    "options": [
                        "Doubler la position",
                        "Garder la même taille ou diminuer",
                        "Trader plus vite",
                        "Ignorer les règles"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quand faut-il éviter de trader ?",
                    "options": [
                        "Le matin",
                        "5 min avant news majeures",
                        "Le soir",
                        "Jamais"
                    ],
                    "correct": 1
                },
                {
                    "question": "Pourquoi tenir un journal de trading ?",
                    "options": [
                        "C'est optionnel",
                        "Sans journal = pas de progression",
                        "Pour impressionner",
                        "Ça prend trop de temps"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q5c)

        # Course 2: Technical Analysis (Reducing from 3 to 2 lessons for brevity)
        c2 = Course(
            title='Analyse Technique & Price Action',
            description='Apprenez les configurations graphiques avancées et les indicateurs clés.',
            total_modules=4,
            duration='50m',
            category='Intermédiaire',
            difficulty_level=2,
            tags=['analyse technique', 'support/resistance', 'chandeliers', 'patterns'],
            thumbnail_emoji='📈'
        )
        db.session.add(c2)
        db.session.commit()

        l6 = Lesson(
            course_id=c2.id,
            title="Support & Resistance: Les Fondamentaux",
            duration="12m",
            content="""# Support & Resistance

Les niveaux de **Support** et **Résistance** sont les fondations de l'analyse technique.

## Qu'est-ce que le Support ?

Le **Support** est un niveau de prix où la demande est suffisamment forte pour **empêcher** le prix de baisser davantage.

### Pourquoi ça fonctionne ?
- 🟢 Les acheteurs voient une "opportunité" à ce prix
- 🟢 Accumulation de buy orders
- 🟢 Mémoire du marché (le prix a rebond ici avant)

## Qu'est-ce que la Résistance ?

La **Résistance** est un niveau où la pression vendeuse **empêche** le prix de monter.

### Caractéristiques:
- 🔴 Les vendeurs dominent
- 🔴 Sell orders accumulés
- 🔴 Zone de prise de profit

## Comment les Identifier ?

1. **Swing Highs/Lows**: Pics et creux récents
2. **Zones rondes**: 1.3000, 50000€ 
3. **Touches multiples**: Plus un niveau est touché, plus il est fort

## Stratégie de Trading

✅ **Buy au Support** + Stop Loss en dessous  
✅ **Sell à la Résistance** + Stop Loss au-dessus  
✅ **Breakout**: Entrée après cassure confirmée
""",
            order=1
        )
        db.session.add(l6)
        db.session.commit()

        q6 = Quiz(
            lesson_id=l6.id,
            questions=[
                {
                    "question": "Qu'est-ce qu'un niveau de Support ?",
                    "options": [
                        "Un niveau où le prix monte toujours",
                        "Un niveau où la demande empêche le prix de baisser",
                        "Un indicateur technique",
                        "Une stratégie de trading"
                    ],
                    "correct": 1
                },
                {
                    "question": "Que faire quand le prix atteint un Support ?",
                    "options": [
                        "Vendre immédiatement",
                        "Ne rien faire",
                        "Considérer un achat avec stop loss en dessous",
                        "Fermer tous vos trades"
                    ],
                    "correct": 2
                },
                {
                    "question": "Pourquoi les zones rondes (ex: 1.3000) sont importantes ?",
                    "options": [
                        "Elles n'ont aucune importance",
                        "Psychologie des traders + ordres accumulés",
                        "C'est juste une coincidence",
                        "Pour faire joli"
                    ],
                    "correct": 1
                },
                {
                    "question": "Plus un niveau est touché, plus il est:",
                    "options": ["Faible", "Fort", "Inutile", "Dangereux"],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce qu'un breakout ?",
                    "options": [
                        "Une cassure d'un niveau S/R",
                        "Une pause dans le trading",
                        "Un type de chart",
                        "Une stratégie interdite"
                    ],
                    "correct": 0
                }
            ]
        )
        db.session.add(q6)

        l7 = Lesson(
            course_id=c2.id,
            title="Patterns de Chandelier Japonais",
            duration="12m",
            content="""# Chandeliers Japonais

Les **chandlers japonais** révèlent la psychologie du marché.

## Anatomie d'un Chandelier

- **Body (Corps)**: Différence entre Open et Close
- **Wick/Shadow (Mèche)**: Extrêmes High/Low
- **Couleur**: Vert/Blanc = Haussier, Rouge/Noir = Baissier

## Patterns Majeurs

### 1. **Doji** 🕯️
- Open ≈ Close (petit body)
- Signal d'**indécision**
- Retournement potentiel

### 2. **Hammer (Marteau)** 🔨
- Long wick inférieur
- Petit body en haut
- **Signal haussier** sur support

### 3. **Shooting Star (Étoile Filante)** ⭐
- Long wick supérieur
- Petit body en bas
- **Signal baissier** sur résistance

### 4. **Engulfing (Engloutissant)**
- Chandelier  qui "mange" le précédent
- **Bullish Engulfing**: Signal d'achat
- **Bearish Engulfing**: Signal de vente

## Comment Trader ces Patterns ?

1. ✅ Attendre **confluence** (pattern + S/R + trend)
2. ✅ Confirmer avec le chandelier suivant
3. ✅ Entry précis avec stop loss logique

> "Un pattern seul ne suffit pas - cherchez la confluence !" 
""",
            order=2
        )
        db.session.add(l7)
        db.session.commit()

        q7 = Quiz(
            lesson_id=l7.id,
            questions=[
                {
                    "question": "Que représente le 'body' d'un chandelier ?",
                    "options": [
                        "Difference entre High et Low",
                        "Difference entre Open et Close",
                        "Le volume",
                        "Le temps"
                    ],
                    "correct": 1
                },
                {
                    "question": "Un Doji signale:",
                    "options": [
                        "Forte hausse",
                        "Forte baisse",
                        "Indécision du marché",
                        "Volume élevé"
                    ],
                    "correct": 2
                },
                {
                    "question": "Un Hammer est un signal:",
                    "options": [
                        "Baissier",
                        "Neutre",
                        "Haussier",
                        "Invalide"
                    ],
                    "correct": 2
                },
                {
                    "question": "Qu'est-ce que la confluence ?",
                    "options": [
                        "Trader seul",
                        "Plusieurs signaux qui se confirment",
                        "Un type de pattern",
                        "Une plateforme de trading"
                    ],
                    "correct": 1
                },
                {
                    "question": "Faut-il trader un pattern seul ?",
                    "options": [
                        "Oui, toujours",
                        "Non, chercher confirmation et confluence",
                        "Peu importe",
                        "Seulement le lundi"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q7)

        # Lesson 7b - Indicateurs Techniques
        l7b = Lesson(
            course_id=c2.id,
            title="Indicateurs Techniques Essentiels",
            duration="14m",
            content="""# Indicateurs Techniques

Les indicateurs aident à **confirmer** vos analyses.

## 1. **Moving Average (MA)** 📊

Moyenne des prix sur une période.

### Types:
- **SMA** (Simple): Moyenne classique
- **EMA** (Exponentielle): Plus réactive

### Utilisation:
```
MA 20 > MA 50 → Tendance haussière
MA 20 < MA 50 → Tendance baissière
```

**Golden Cross**: MA courte croise au-dessus = ACHAT  
**Death Cross**: MA courte croise en-dessous = VENTE

## 2. **RSI** (Relative Strength Index) 📈

Mesure la force du mouvement (0-100).

- **> 70**: Surachat (possible retournement baissier)
- **< 30**: Survente (possible retournement haussier)
- **50**: Zone neutre

### Astuce:
Cherchez les **divergences**:
- Prix fait HH mais RSI fait LH → Signal baissier
- Prix fait LL mais RSI fait HL → Signal haussier

## 3. **MACD** 📉

Différence entre 2 EMAs + signal line.

- **MACD > Signal**: Bullish
- **MACD < Signal**: Bearish
- **Histogram**: Force du momentum

## 4. **Bollinger Bands** 📦

Volatilité autour d'une MA.

- **Prix touche bande haute**: Possible retournement/surachat
- **Prix touche bande basse**: Possible rebond/survente
- **Squeeze**: Volatilité faible → explosion à venir

## Règles d'Or ⚠️

1. ❌ N'utilisez pas trop d'indicateurs (max 2-3)
2. ✅ Les indicateurs CONFIRMENT, pas prédisent
3. ✅ Combinez avec Price Action
4. ❌ Évitez les signaux contradictoires
""",
            order=3
        )
        db.session.add(l7b)
        db.session.commit()

        q7b = Quiz(
            lesson_id=l7b.id,
            questions=[
                {
                    "question": "Qu'est-ce qu'un Golden Cross ?",
                    "options": [
                        "MA courte croise en-dessous",
                        "MA courte croise au-dessus de MA longue",
                        "RSI > 70",
                        "Prix touche Bollinger haute"
                    ],
                    "correct": 1
                },
                {
                    "question": "Que signifie un RSI > 70 ?",
                    "options": [
                        "Survente",
                        "Surachat",
                        "Zone neutre",
                        "Pas de signal"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quelle est la règle pour les indicateurs ?",
                    "options": [
                        "En utiliser le plus possible",
                        "Maximum 2-3 indicateurs",
                        "Les ignorer",
                        "Seulement le RSI"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce qu'une divergence RSI ?",
                    "options": [
                        "RSI = 50",
                        "Prix et RSI vont dans sens opposé",
                        "RSI casse 70",
                        "Un bug"
                    ],
                    "correct": 1
                },
                {
                    "question": "Un 'squeeze' Bollinger annonce quoi ?",
                    "options": [
                        "Fin du trading",
                        "Explosion de volatilité à venir",
                        "Rien",
                        "Tendance stable"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q7b)

        # Lesson 7c - Trendlines & Fibonacci
        l7c = Lesson(
            course_id=c2.id,
            title="Trendlines & Fibonacci Retracement",
            duration="12m",
            content="""# Trendlines & Fibonacci

Deux outils puissants pour identifier zones clés.

## Trendlines (Lignes de Tendance) 📐

### Comment Tracer ?

**Trendline Haussière:**
- Connectez 2+ **points bas** (HL)
- Le prix rebondit dessus

**Trendline Baissière:**
- Connectez 2+ **points hauts** (LH)
- Le prix rejette dessous

### Règles:
1. ✅ Minimum **2 touches** pour valider
2. ✅ Plus de touches = plus fort
3. ✅ Cassure = signal de retournement

### Trading:
- **Bounce**: Achat sur trendline haussière
- **Break**: Vente après cassure confirmée

## Fibonacci Retracement 🌀

Niveaux mathématiques où le prix retrace souvent.

### Niveaux Clés:
- **23.6%** - Retracement faible
- **38.2%** - Retracement modéré
- **50%** - Niveau psychologique
- **61.8%** - Retracement profond (le plus important!)
- **78.6%** - Retracement très profond

### Comment Utiliser:

1. **Identifier** le swing (bas → haut ou haut → bas)
2. **Tracer** Fibo du point A au point B
3. **Attendre** réaction aux niveaux clés
4. **Entrer** avec confirmation

### Zones d'Or 🎯

**38.2% - 61.8%** = Zone de valeur optimale

```
Si prix retrace à 50-61.8% + support + bougie de rejet
→ ENTRÉE OPTIMALE!
```

## Confluence Puissante 💪

Combinez:
- Trendline + Fibo 61.8% + Support
= Signal TRÈS fort!

> "La confluence transforme une bonne probabilité en excellente opportunité."
""",
            order=4
        )
        db.session.add(l7c)
        db.session.commit()

        q7c = Quiz(
            lesson_id=l7c.id,
            questions=[
                {
                    "question": "Combien de touches minimum pour valider une trendline ?",
                    "options": ["1", "2", "5", "10"],
                    "correct": 1
                },
                {
                    "question": "Quel niveau Fibonacci est le plus important ?",
                    "options": ["23.6%", "38.2%", "61.8%", "100%"],
                    "correct": 2
                },
                {
                    "question": "Comment tracer une trendline haussière ?",
                    "options": [
                        "Connecter les hauts",
                        "Connecter les bas (HL)",
                        "Ligne horizontale",
                        "Au hasard"
                    ],
                    "correct": 1
                },
                {
                    "question": "La 'zone d'or' Fibonacci est située entre:",
                    "options": ["0-23.6%", "23.6-38.2%", "38.2-61.8%", "78.6-100%"],
                    "correct": 2
                },
                {
                    "question": "Qu'est-ce qui renforce un signal d'entrée ?",
                    "options": [
                        "Un seul indicateur",
                        "Confluence (plusieurs signaux alignés)",
                        "Trading au hasard",
                        "Ignorer tous les outils"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q7c)

        # Course 3: Risk Management
        c3 = Course(
            title='Gestion des Risques & Money Management',
            description='Protégez votre capital avec des techniques éprouvées.',
            total_modules=4,
            duration='44m',
            category='Avancé',
            difficulty_level=3,
            tags=['gestion risques', 'money management', 'position sizing', 'protection capital'],
            thumbnail_emoji='🛡️'
        )
        db.session.add(c3)
        db.session.commit()

        l8 = Lesson(
            course_id=c3.id,
            title="Position Sizing: Calculs Essentiels",
            duration="11m",
            content="""# Position Sizing

Le **Position Sizing** détermine combien d'unités trader pour respecter votre risque.

## La Formule Magique

```
Position Size = (Capital × % Risque) / Distance au Stop Loss
```

## Exemple Pratique

**Contexte:**
- Capital: 10,000€
- Risque max: 1% = 100€
- Entry: 50€
- Stop Loss: 49€
- **Distance**: 1€

**Calcul:**
```
Position = 100€ / 1€ = 100 actions maximum
```

## Cas Réels

### Forex (Micro Lots)
- Capital: 5,000$
- Risque: 2% = 100$
- Entry: EUR/USD 1.1000
- SL: 1.0950 (50 pips)
- **Position**: 0.20 lots

### Crypto
- Capital: 1,000$
- Risque: 1% = 10$
- Entry BTC: 50,000$
- SL: 49,000$ (1,000$)
- **Position**: 0.01 BTC

## Erreurs à Éviter

❌ **Sur-leverager**: "Je veux être riche vite"  
❌ **Ignorer le SL**: "Je trade sans stop"  
❌ **Taille fixe**: Adapter selon volatilité  

✅ **Toujours calculer AVANT** d'entrer
""",
            order=1
        )
        db.session.add(l8)
        db.session.commit()

        q8 = Quiz(
            lesson_id=l8.id,
            questions=[
                {
                    "question": "Quelle est la formule de Position Sizing ?",
                    "options": [
                        "(Capital + Risque) / SL",
                        "(Capital × % Risque) / Distance SL",
                        "Capital / 100",
                        "Prix × Volume"
                    ],
                    "correct": 1
                },
                {
                    "question": "Avec 10k€ de capital et 1% risque, combien risquez-vous ?",
                    "options": ["10€", "100€", "1,000€", "10,000€"],
                    "correct": 1
                },
                {
                    "question": "Pourquoi le position sizing est important ?",
                    "options": [
                        "Pour trader plus",
                        "Pour respecter son risque maximum",
                        "C'est optionnel",
                        "Pour impressionner"
                    ],
                    "correct": 1
                },
                {
                    "question": "Faut-il calculer la position AVANT d'entrer ?",
                    "options": [
                        "Non, après suffit",
                        "Oui, toujours AVANT",
                        "Peu importe",
                        "Jamais"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quelle erreur éviter ?",
                    "options": [
                        "Calculer précisément",
                        "Sur-leverager",
                        "Utiliser un stop loss",
                        "Suivre son plan"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q8)

        l9 = Lesson(
            course_id=c3.id,
            title="Risk/Reward & Expectancy",
            duration="11m",
            content="""# Risk/Reward Ratio

Le R:R est le **rapport** entre ce que vous risquez et ce que vous visez.

## Comprendre le R:R

**Ratio 1:2** signifie:
- Vous risquez 1€
- Pour gagner 2€

**Ratio 1:3**:
- Risque: 50$
- Gain visé: 150$

## Calcul Simple

```
R:R = Take Profit / Stop Loss
```

**Exemple:**
- Entry: 100€
- SL: 98€ (risque = 2€)
- TP: 106€ (gain = 6€)
- **R:R = 6/2 = 1:3** ✅

## Win Rate vs R:R

### Scénario A: R:R 1:1
- Win rate nécessaire: **50%+**

### Scénario B: R:R 1:2
- Win rate nécessaire: **34%+**

### Scénario C: R:R 1:3
- Win rate nécessaire: **26%+**

## Expectancy (Espérance)

**Formule:**
```
Expectancy = (Win% × Avg Win) - (Loss% × Avg Loss)
```

**Exemple:**
- 40% win rate
- Avg win: 150€
- Avg loss: 50€
- **Expectancy = (0.4 × 150) - (0.6 × 50) = 60€ - 30€ = +30€** ✅

## Règle d'Or

🎯 **Minimum 1:2 R/R**  
✅ Ne prenez que des trades avec R:R favorable
""",
            order=2
        )
        db.session.add(l9)
        db.session.commit()

        q9 = Quiz(
            lesson_id=l9.id,
            questions=[
                {
                    "question": "Que signifie un R:R de 1:2 ?",
                    "options": [
                        "Risquer 2€ pour gagner 1€",
                        "Risquer 1€ pour gagner 2€",
                        "2 trades pour 1 gain",
                        "1 heure pour 2 trades"
                    ],
                    "correct": 1
                },
                {
                    "question": "Avec un R:R 1:3, quel win rate minimum ?",
                    "options": ["50%", "34%", "26%", "10%"],
                    "correct": 2
                },
                {
                    "question": "Comment calculer le R:R ?",
                    "options": [
                        "SL / TP",
                        "TP / SL",
                        "Entry / Exit",
                        "Volume / Prix"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce que l'Expectancy ?",
                    "options": [
                        "Le nombre de trades",
                        "Le gain moyen espéré par trade",
                        "Le risque maximum",
                        "Une plateforme"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel R:R minimum viser ?",
                    "options": ["1:1", "1:2", "1:0.5", "Peu importe"],
                    "correct": 1
                }
            ]
        )
        db.session.add(q9)

        # Lesson 9b - Drawdown Management
        l9b = Lesson(
            course_id=c3.id,
            title="Maîtriser le Drawdown",
            duration="11m",
            content="""# Gestion du Drawdown

Le **Drawdown** est l'ennemi #1 du prop trader.

## Types de Drawdown

### 1. **Daily Drawdown**
Perte maximale autorisée **par jour**.

**Exemple (Compte 100k€):**
- Daily DD: 5% = -5,000€/jour max
- Si solde début: 102,000€ → limite = 96,900€

### 2. **Max Drawdown** 
Perte maximale **totale** depuis le pic.

**Exemple:**
- Max DD: 10% = -10,000€ total
- Solde départ: 100k → compte fermé à 90k

### 3. **Trailing Drawdown**
Le niveau de DD suit votre **profit**.

⚠️ Plus complexe, attention!

## Calculs Importants

### Daily DD Restant
```
DD Restant = (Balance actuelle × 5%) - Pertes du jour
```

**Exemple:**
- Balance: 100k€, P&L jour: -2,000€
- DD Restant = 5,000€ - 2,000€ = **3,000€ encore disponibles**

## Stratégies Anti-Drawdown

### 1. **Règle des 50%**
Si vous atteignez **50% du DD journalier**, STOP!

### 2. **3 Strikes Out**
3 pertes consécutives = arrêt trading

### 3. **Scaling Down**
Après chaque perte, réduire taille position:
- Trade 1: 1% risque
- Après perte: 0.5% risque
- Après 2 pertes: arrêt

### 4. **Horaires Limités**
Ne tradez que pendant vos meilleures heures (track dans journal!)

## Récupération

| Perte | Gain nécessaire pour revenir |
|-------|------------------------------|
| -10%  | +11% |
| -20%  | +25% |
| -50%  | +100% |

**⚠️ Mieux vaut PRÉVENIR que guérir!**

> "Protéger votre capital est plus important que le faire croître."
""",
            order=3
        )
        db.session.add(l9b)
        db.session.commit()

        q9b = Quiz(
            lesson_id=l9b.id,
            questions=[
                {
                    "question": "Quelle est la différence entre Daily DD et Max DD ?",
                    "options": [
                        "Aucune",
                        "Daily = par jour, Max = total depuis le pic",
                        "Daily = total, Max = par jour",
                        "C'est pareil"
                    ],
                    "correct": 1
                },
                {
                    "question": "Que faire si vous atteignez 50% du DD journalier ?",
                    "options": [
                        "Continuer normalement",
                        "Doubler les positions",
                        "STOP trading pour le jour",
                        "Ignorer"
                    ],
                    "correct": 2
                },
                {
                    "question": "Après une perte de 50%, quel gain pour revenir à zéro ?",
                    "options": ["+50%", "+75%", "+100%", "+150%"],
                    "correct": 2
                },
                {
                    "question": "Qu'est-ce que la règle '3 Strikes Out' ?",
                    "options": [
                        "Trader 3 fois",
                        "3 pertes consécutives = arrêt",
                        "Gagner 3 fois",
                        "Utiliser 3 indicateurs"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quelle est la priorité #1 du trader ?",
                    "options": [
                        "Gains maximum",
                        "Protection du capital",
                        "Trading rapide",
                        "Beaucoup de trades"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q9b)

        # Lesson 9c - Stratégies de Protection
        l9c = Lesson(
            course_id=c3.id,
            title="Stratégies de Protection du Capital",
            duration="10m",
            content="""# Protection du Capital

Techniques avancées pour préserver votre compte.

## 1. Hedging Intelligent

### Corrélation des Paires
- EUR/USD et GBP/USD = corrélés positivement
- EUR/USD et USD/CHF = corrélés négativement

**Règle:** Ne pas prendre 2 trades identiques sur paires corrélées!

## 2. Pyramiding Inversé

Réduire taille quand marché incertain:

```
Conviction forte:  1% risque
Conviction moyenne: 0.75% risque
Conviction faible:  0.5% risque ou SKIP
```

## 3. Time-Based Stops

Si trade ne va pas dans votre sens après X temps:
- Sortie avant SL
- Préserve capital pour meilleure opportunité

**Exemple:**
> Si pas +1R après 4 heures = sortie manuelle

## 4. Règle du Break-Even

Après gain égal à votre risque (+1R):
- **Déplacez SL au break-even**
- Trade devient "gratuit"

## 5. Trailing Stop

Protégez les profits en cours:

```
Prix monte de +2R → SL à +1R
Prix monte de +3R → SL à +2R
```

## 6. Max Trades par Jour

| Profil | Max Trades |
|--------|------------|
| Conservateur | 2-3 |
| Modéré | 3-5 |
| Agressif | 5-8 |

**Pour prop trading:** Restez conservateur (2-3)

## 7. Calendrier des News

❌ **Éviter trading 15 min avant/après:**
- NFP (Non-Farm Payrolls)
- FOMC (décisions taux)
- CPI (inflation)
- PIB

## Checklist Protection

☑️ SL placé AVANT entrée
☑️ Risque < 1-2%
☑️ Pas de news majeures
☑️ DD journalier vérifié
☑️ Max trades respecté
☑️ Corrélations vérifiées

> "La survie est la première règle du trader professionnel."
""",
            order=4
        )
        db.session.add(l9c)
        db.session.commit()

        q9c = Quiz(
            lesson_id=l9c.id,
            questions=[
                {
                    "question": "Pourquoi éviter 2 trades sur paires corrélées ?",
                    "options": [
                        "C'est interdit",
                        "Double le risque sans le savoir",
                        "Plus de commissions",
                        "Aucune raison"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quand déplacer son SL au break-even ?",
                    "options": [
                        "Jamais",
                        "Après +1R de profit",
                        "Au début du trade",
                        "Après une perte"
                    ],
                    "correct": 1
                },
                {
                    "question": "Combien de temps éviter trading autour des news majeures ?",
                    "options": ["1 min", "5 min", "15 min", "1 heure"],
                    "correct": 2
                },
                {
                    "question": "Quel est le max trades recommandé pour prop trading ?",
                    "options": ["10-15", "2-3", "20+", "Illimité"],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce qu'un Trailing Stop ?",
                    "options": [
                        "Stop fixe",
                        "Stop qui suit les profits",
                        "Pas de stop",
                        "Stop loss mental"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q9c)

        # Course 4: Psychology (2 lessons)
        c4 = Course(
            title='Psychologie & Discipline du Trader',
            description='Développez le mindset gagnant des traders rentables.',
            total_modules=2,
            duration='18m',
            category='Intermédiaire',
            difficulty_level=2,
            tags=['psychologie', 'discipline', 'mindset', 'trading journal'],
            thumbnail_emoji='🧠'
        )
        db.session.add(c4)
        db.session.commit()

        # Lesson 14 - Psychology lesson for Course 4
        l14 = Lesson(
            course_id=c4.id,
            title="Maîtriser ses Émotions en Trading",
            duration="9m",
            content="""# Psychologie du Trading

90% du trading est mental. Voici les pièges à éviter.

## Les 3 Émotions Toxiques

### 1. **FOMO** (Fear Of Missing Out)
😰 "Je dois entrer MAINTENANT sinon je rate l'opportunité !"
✅ **Solution**: Attendez votre setup. Il y a toujours d'autres opportunités.

### 2. **Revenge Trading**
😡 Après une perte, vous voulez vous "venger" du marché
✅ **Solution**: Si vous perdez 2 trades d'affilée, STOP pour aujourd'hui.

### 3. **Overconfidence**
😎 Après 3-4 wins: "Je suis un génie, je peux tout risquer !"
✅ **Solution**: Respectez TOUJOURS votre plan, peu importe les résultats.

## Le Mindset Gagnant

📝 **Journaling**: Notez chaque trade et vos émotions  
🎯 **Process > Results**: Focalisez sur le respect du plan, pas sur l'argent  
🧘 **Discipline**: Le trading est ennuyeux quand c'est bien fait

## Citation Clé
> "Les meilleurs traders ne sont pas les plus intelligents, mais les plus disciplinés." - Mark Douglas
""",
            order=1
        )
        db.session.add(l14)
        db.session.commit()

        q14 = Quiz(
            lesson_id=l14.id,
            questions=[
                {
                    "question": "Qu'est-ce que le FOMO ?",
                    "options": [
                        "Fear Of Missing Out",
                        "Follow Only My Orders",
                        "First Order Market Open",
                        "Find Opportunities More Often"
                    ],
                    "correct": 0
                },
                {
                    "question": "Que faire après 2 pertes consécutives ?",
                    "options": [
                        "Doubler la position",
                        "Arrêter pour aujourd'hui",
                        "Changer de stratégie",
                        "Trader plus vite"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce que le revenge trading ?",
                    "options": [
                        "Une stratégie avancée",
                        "Trader pour se venger du marché après une perte",
                        "Un type d'analyse",
                        "Suivre la revanche d'un titre"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel est le mindset à adopter ?",
                    "options": [
                        "Process over Results",
                        "Money over Everything",
                        "Risk everything",
                        "Trade non-stop"
                    ],
                    "correct": 0
                },
                {
                    "question": "Quel pourcentage du trading est mental ?",
                    "options": ["50%", "70%", "90%", "100%"],
                    "correct": 2
                }
            ]
        )
        db.session.add(q14)

        # Lesson 15 - Trading Journal & Discipline
        l15 = Lesson(
            course_id=c4.id,
            title="Journal de Trading & Discipline",
            duration="9m",
            content="""# Journal de Trading

Un **journal de trading** est votre meilleur outil d'amélioration.

## Pourquoi Tenir un Journal ?

✅ **Identifier** vos erreurs récurrentes  
✅ **Analyser** vos patterns de succès  
✅ **Éviter** de répéter les mêmes erreurs  
✅ **Progresser** continuellement

## Que Noter ?

### Pour Chaque Trade:

**Avant l'entrée:**
- Date & Heure
- Instrument (EUR/USD, BTC, etc.)
- Setup utilisé (breakout, retest, etc.)
- Raison d'entrée (respecte mon plan ?)
- État émotionnel (calme, FOMO, confiant ?)

**Pendant le trade:**
- Entry price
- Stop Loss
- Take Profit
- Position size
- Risk/Reward ratio

**Après la sortie:**
- Exit price
- Profit/Loss (€ + %)
- Raison de sortie (TP hit, SL hit, manuel)
- Ce qui a bien marché
- Ce qui aurait pu être mieux

## Template Simple

```
📅 Date: 7 Jan 2026, 10:30
📊 Instrument: EUR/USD
🎯 Setup: Breakout + Retest résistance 1.0950
💭 État: Calme, setup clair
📍 Entry: 1.0955
🛑 SL: 1.0945 (-10 pips)
✅ TP: 1.0975 (+20 pips) → R:R 1:2
💰 Size: 0.10 lot = risque 10€
📊 Résultat: +20€ ✅
✍️ Notes: Patience récompensée, retest parfait
```

## Discipline = Répétition

🔄 **Routine quotidienne:**
1. Analyser les marchés (matin)
2. Noter setups potentiels
3. Attendre patiemment
4. Exécuter selon plan
5. Journal après chaque trade
6. Review hebdomadaire

## Review Hebdomadaire

Chaque dimanche, analysez:
- Win rate de la semaine
- Erreurs fréquentes
- Meilleurs trades (pourquoi ?)
- Pires trades (leçons ?)
- Objectifs semaine prochaine

> "La discipline mange le talent au petit-déjeuner." - Unknown
""",
            order=2
        )
        db.session.add(l15)
        db.session.commit()

        q15 = Quiz(
            lesson_id=l15.id,
            questions=[
                {
                    "question": "Pourquoi tenir un journal de trading ?",
                    "options": [
                        "C'est optionnel",
                        "Pour identifier erreurs et progresser",
                        "Pour impressionner",
                        "Juste pour l'historique"
                    ],
                    "correct": 1
                },
                {
                    "question": "Que faut-il noter AVANT l'entrée ?",
                    "options": [
                        "Seulement le prix",
                        "Setup, état émotionnel, raison d'entrée",
                        "Rien",
                        "Juste la date"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quelle information est essentielle pour chaque trade ?",
                    "options": [
                        "Seulement profit/loss",
                        "Entry, SL, TP, size, R:R, résultat, notes",
                        "Juste le résultat",
                        "L'heure uniquement"
                    ],
                    "correct": 1
                },
                {
                    "question": "À quelle fréquence faire une review ?",
                    "options": [
                        "Jamais",
                        "Une fois par an",
                        "Hebdomadaire (chaque dimanche)",
                        "Toutes les 5 minutes"
                    ],
                    "correct": 2
                },
                {
                    "question": "Que révèle un journal de trading ?",
                    "options": [
                        "Vos erreurs récurrentes et patterns de succès",
                        "Rien d'utile",
                        "Seulement vos gains",
                        "Juste les dates"
                    ],
                    "correct": 0
                }
            ]
        )
        db.session.add(q15)


        # Course 5: Smart Money (2 lessons)
        c5 = Course(
            title='Stratégies Smart Money (SMC)',
            description="Comprendre la structure du marché et les flux d'ordres institutionnels.",
            total_modules=2,
            duration='24m',
            category='Avancé',
            difficulty_level=4,
            tags=['smart money', 'order blocks', 'liquidité', 'institutionnels', 'SMC'],
            thumbnail_emoji='🔍'
        )
        db.session.add(c5)
        db.session.commit()

        l10 = Lesson(
            course_id=c5.id,
            title="Introduction au Smart Money",
            duration="12m",
            content="""# Smart Money Concepts (SMC)

Le **Smart Money** représente les **institutionnels** (banques, hedge funds) qui déplacent le marché.

## Retail vs Smart Money

### Retail Traders (Nous) 🐟
- Tradent les breakouts
- Achètent les hauts / Vendent les bas
- Suivent les patterns classiques

### Smart Money (Institutions) 🐋
- Créent les breakouts (piège!)
- Accumulent en silence
- Manipulent pour liquider retail

## Concepts Clés

### 1. **Liquidity (Liquidité)**
Les zones où retail place ses **stop loss** = cible pour Smart Money

**Exemple:**
- Retail SL sous support
- Smart Money **casse** le support
- Stop loss déclenchés = liquidité
- Puis prix **repart à la hausse**

### 2. **Order Blocks**
Zones où Smart Money a placé des **ordres massifs**

**Caractéristiques:**
- Chandelier fort avant mouvement
- Zone de déséquilibre
- Prix revient souvent tester

### 3. **Fair Value Gap (FVG)**
**Déséquilibre** = Zone non comblée

Visual:
```
Prix monte vite →  GAP (zone vide) → Prix revient combler
```

## Stratégie de Base

1. **Identifier** les zones de liquidité
2. **Attendre** la prise de liquidité
3. **Entrer** au Order Block
4. **Viser** la liquidité opposée

> "Trade comme les institutions, pas contre elles!"
""",
            order=1
        )
        db.session.add(l10)
        db.session.commit()

        q10 = Quiz(
            lesson_id=l10.id,
            questions=[
                {
                    "question": "Qu'est-ce que le Smart Money ?",
                    "options": [
                        "Les traders retail",
                        "Les institutions (banques, hedge funds)",
                        "Une stratégie",
                        "Un indicateur"
                    ],
                    "correct": 1
                },
                {
                    "question": "Où les retail traders placent souvent leurs SL ?",
                    "options": [
                        "Nulle part",
                        "Sous les supports / sur résistances",
                        "Au milieu",
                        "Dans le futur"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce qu'un Order Block ?",
                    "options": [
                        "Un bug",
                        "Zone où Smart Money a placé gros ordres",
                        "Un logiciel",
                        "Une escroquerie"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce qu'un Fair Value Gap ?",
                    "options": [
                        "Une zone de déséquilibre/gap non comblé",
                        "Un type de stop loss",
                        "Une plateforme",
                        "Une formation"
                    ],
                    "correct": 0
                },
                {
                    "question": "Comment trader avec SMC ?",
                    "options": [
                        "Suivre retail",
                        "Identifier liquidité + order blocks",
                        "Ignorer tout",
                        "Trader au hasard"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q10)

        l11 = Lesson(
            course_id=c5.id,
            title="Market Structure & Break of Structure",
            duration="12m",
            content="""# Market Structure

La **structure de marché** révèle la **direction** dominante.

## Higher Highs & Higher Lows (Uptrend)

```
HH - Higher High
HL - Higher Low

Prix:   /\    /\     /\
       /  \  /  \   /  \
      /    \/    \ /
     HL         HL
```

**Trend haussière** = HH + HL successifs

## Lower Lows & Lower Highs (Downtrend)

```
LH - Lower High
LL - Lower Low

Prix: \     /\    /
       \   /  \  /  \
        \ /    \/    \
        LL           LL
```

**Trend baissière** = LL + LH successifs

## Break of Structure (BOS)

Quand le prix **casse** un swing précédent:

### Bullish BOS
- Prix casse un **Higher High** précédent
- **Confirmation** de tendance haussière

### Bearish BOS
- Prix casse un **Lower Low** précédent
- **Confirmation** de tendance baissière

## Change of Character (CHoCH)

**Signal de retournement potentiel!**

### Exemple:
```
Uptrend: HH + HL + HH 
Puis: prix casse le HL dernier
→ CHoCH (possible retournement)
```

## Application Trading

1. ✅ **Identifier** la structure actuelle
2. ✅ **Attendre** BOS pour confirmation
3. ✅ **Entrer** au retest d'Order Block
4. ✅ **SL** sous structure

> "La structure ne ment jamais - respectez-la!"
""",
            order=2
        )
        db.session.add(l11)
        db.session.commit()

        q11 = Quiz(
            lesson_id=l11.id,
            questions=[
                {
                    "question": "Qu'est-ce qu'un Higher High (HH) ?",
                    "options": [
                        "Un sommet plus élevé que le précédent",
                        "Un creux plus bas",
                        "Le prix stable",
                        "Une résistance"
                    ],
                    "correct": 0
                },
                {
                    "question": "Une tendance haussière se compose de:",
                    "options": [
                        "LL + LH",
                        "HH + HL",
                        "Seulement HH",
                        "Structure aléatoire"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce qu'un Break of Structure (BOS) ?",
                    "options": [
                        "Cassure d'un swing précédent",
                        "Un stop loss",
                        "Une résistance",
                        "Un pattern"
                    ],
                    "correct": 0
                },
                {
                    "question": "Que signale un Change of Character (CHoCH) ?",
                    "options": [
                        "Continuation",
                        "Retournement potentiel",
                        "Consolidation",
                        "Stop trading"
                    ],
                    "correct": 1
                },
                {
                    "question": "Comment utiliser la structure pour trader ?",
                    "options": [
                        "L'ignorer",
                        "Identifier, attendre BOS, entrer au retest",
                        "Trader contre",
                        "Regarder seulement"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q11)

        # Course 6: Algo Trading (2 lessons)
        c6 = Course(
            title='Introduction au Trading Algorithmique',
            description='Automatisez vos stratégies avec Python.',
            total_modules=2,
            duration='26m',
            category='Avancé',
            difficulty_level=4,
            tags=['algo trading', 'python', 'automatisation', 'backtesting'],
            thumbnail_emoji='🤖'
        )
        db.session.add(c6)
        db.session.commit()

        l12 = Lesson(
            course_id=c6.id,
            title="Bases du Trading Algorithmique",
            duration="13m",
            content="""# Trading Algorithmique

Le **Trading Algo** = automatiser vos décisions de trading via code.

## Pourquoi l'Algo Trading ?

### Avantages ✅
- **Émotions = 0**: Le code n'a pas peur ni avidité
- **Rapidité**: Exécution en millisecondes
- **Backtesting**: Tester sur historique avant risquer
- **Discipline**: Respect strict du plan

### Désavantages ❌
- **Complexité**: Nécessite compétences en code
- **Over-optimization**: Curve fitting sur historique
- **Maintenance**: Marchés évoluent, code aussi

## Langages Populaires

### 1. **Python** 🐍
- Facile à apprendre
- Libraries: pandas, numpy, backtrader
- **Meilleur pour débuter**

### 2. **Pine Script** (TradingView)
- Code directement dans TradingView
- Pour indicateurs custom
- Limité aux backtests TradingView

### 3. **MQL4/5** (MetaTrader)
- Pour Forex/CFDs
- Deployment direct sur MT4/MT5
- Plus technique

## Structure d'un Algo

```python
# 1. Data (récupérer prix)
data = get_market_data()

# 2. Indicator (calculer signaux)
sma_20 = data.rolling(20).mean()

# 3. Signal (conditions d'entrée)
if price > sma_20:
    buy_signal = True

# 4. Execution (passer l'ordre)
if buy_signal:
    place_order(symbol, quantity)

# 5. Risk Management (SL/TP)
set_stop_loss(entry_price * 0.98)
```

## Premiers Pas

1. **Apprendre Python basics**
2. **Installer** pandas, backtrader
3. **Coder** une stratégie simple (SMA crossover)
4. **Backtester** sur données historiques
5. **Paper trade** avant live

> "Ne déployez jamais un algo sans backtesting rigoureux!"
""",
            order=1
        )
        db.session.add(l12)
        db.session.commit()

        q12 = Quiz(
            lesson_id=l12.id,
            questions=[
                {
                    "question": "Qu'est-ce que le trading algorithmique ?",
                    "options": [
                        "Trader manuellement",
                        "Automatiser via code",
                        "Suivre des signaux",
                        "Investir long terme"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel est l'avantage principal de l'algo ?",
                    "options": [
                        "Plus cher",
                        "Zéro émotions",
                        "Moins précis",
                        "Plus lent"
                    ],
                    "correct": 1
                },
                {
                    "question": "Quel langage est recommandé pour débuter ?",
                    "options": [
                        "C++",
                        "Java",
                        "Python",
                        "Rust"
                    ],
                    "correct": 2
                },
                {
                    "question": "Qu'est-ce que le backtesting ?",
                    "options": [
                        "Tester en live",
                        "Tester sur données historiques",
                        "Ignorer les tests",
                        "Copier d'autres"
                    ],
                    "correct": 1
                },
                {
                    "question": "Faut-il backtester avant le déploiement ?",
                    "options": [
                        "Non, inutile",
                        "Oui, absolument",
                        "Parfois",
                        "Jamais"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q12)

        l13 = Lesson(
            course_id=c6.id,
            title="Backtest & Optimisation",
            duration="13m",
            content="""# Backtest & Optimisation

Le **Backtesting** teste votre stratégie sur données historiques.

## Pourquoi Backtester ?

- ✅ **Prouver** que la stratégie fonctionne
- ✅ **Identifier** les faiblesses
- ✅ **Optimiser** paramètres
- ✅ **Éviter** pertes réelles

## Métriques Importantes

### 1. **Win Rate**
```
Win Rate = (Trades gagnants / Total trades) × 100
```
**Exemple**: 60 wins / 100 trades = 60%

### 2. **Profit Factor**
```
Profit Factor = Gains totaux / Pertes totales
```
- **> 1.5** = Bon
- **> 2.0** = Excellent

### 3. **Max Drawdown**
Perte maximale depuis un pic

**Exemple**: De 10,000€ à 8,500€ = **15% drawdown**

### 4. **Sharpe Ratio**
Rendement ajusté au risque

- **> 1** = Acceptable
- **> 2** = Très bon

## Éviter l'Over-Optimization

### Le Piège du Curve Fitting

```
Backtest: +300% 🎉
Live trading: -50% 😱
```

**Pourquoi?** → Sur-optimisé pour historique!

### Solutions:
1. **Out-of-sample testing**: Garder 20-30% données non vues
2. **Walk-forward analysis**: Tester périodes différentes
3. **Simple > Complex**: Moins de paramètres = mieux

## Tools Python

```python
import backtrader as bt

# Créer stratégie
class MyStrategy(bt.Strategy):
    def next(self):
        if self.sma_fast > self.sma_slow:
            self.buy()
        elif self.sma_fast < self.sma_slow:
            self.sell()

# Run backtest
cerebro = bt.Cerebro()
cerebro.addstrategy(MyStrategy)
cerebro.run()
```

## Étapes Backtest

1. **Coder** la stratégie
2. **Charger** données historiques (au moins 1 an)
3. **Executer** le backtest
4. **Analyser** métriques
5. **Optimiser** (avec prudence!)
6. **Forward test** (paper trading)

> "Un bon backtest ne garantit pas le succès, mais un mauvais backtest garantit l'échec!"
""",
            order=2
        )
        db.session.add(l13)
        db.session.commit()

        q13 = Quiz(
            lesson_id=l13.id,
            questions=[
                {
                    "question": "Qu'est-ce que le backtesting ?",
                    "options": [
                        "Trader en direct",
                        "Tester stratégie sur historique",
                        "Acheter actions",
                        "Vendre crypto"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce qu'un bon Profit Factor ?",
                    "options": ["< 1", "= 1", "> 1.5", "< 0"],
                    "correct": 2
                },
                {
                    "question": "Qu'est-ce que le Max Drawdown ?",
                    "options": [
                        "Profit maximum",
                        "Perte max depuis un pic",
                        "Temps de trading",
                        "Nombre de trades"
                    ],
                    "correct": 1
                },
                {
                    "question": "Qu'est-ce que le curve fitting ?",
                    "options": [
                        "Bonne optimisation",
                        "Sur-optimisation pour historique",
                        "Un graphique",
                        "Une stratégie"
                    ],
                    "correct": 1
                },
                {
                    "question": "Faut-il garder des données 'non vues' ?",
                    "options": [
                        "Non, utiliser tout",
                        "Oui, out-of-sample test (20-30%)",
                        "Peu importe",
                        "Seulement 1%"
                    ],
                    "correct": 1
                }
            ]
        )
        db.session.add(q13)

        db.session.commit()
        print("Courses seeded successfully with content and quizzes!")


if __name__ == '__main__':
    seed_courses()
