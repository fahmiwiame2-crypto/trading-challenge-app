# 🚀 TradeSense AI - Plateforme de Prop Trading

![TradeSense AI](https://img.shields.io/badge/TradeSense-AI-purple?style=for-the-badge&logo=bitcoin)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18-cyan?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)

## 📋 Description

TradeSense AI est une plateforme SaaS de Prop Trading qui permet aux traders de prouver leurs compétences et d'obtenir du capital de trading. La plateforme utilise l'Intelligence Artificielle pour fournir des signaux de trading en temps réel.

## ✨ Fonctionnalités

### Module A : Moteur du Challenge
- ✅ Capital initial configurable (5K, 25K, 100K)
- ✅ Règle de Perte Max Journalière (5%)
- ✅ Règle de Perte Max Totale (10%)
- ✅ Objectif de Profit (10%) pour réussir le challenge
- ✅ Vérification automatique après chaque trade

### Module B : Paiement & Accès
- ✅ Page de tarification avec 3 plans (Starter, Pro, Elite)
- ✅ Paiement par Carte, PayPal, Crypto
- ✅ Configuration PayPal dans SuperAdmin
- ✅ Création automatique du challenge après paiement

### Module C : Dashboard Temps Réel
- ✅ Graphiques TradingView intégrés
- ✅ Données Yahoo Finance (BTC, ETH, AAPL, TSLA)
- ✅ Scraper Bourse de Casablanca (IAM, ATW, BCP)
- ✅ Mise à jour automatique (10-60 secondes)
- ✅ Signaux IA avec confiance %

### Module D : Classement (Gamification)
- ✅ Leaderboard Top 10 Traders
- ✅ Requête SQL agrégée depuis la table trades
- ✅ Tri par % de profit

## 🏗️ Structure du Projet

```
tradesense-ai/
├── backend/               # API Flask
│   ├── app/
│   │   ├── models.py     # Modèles SQLAlchemy
│   │   ├── routes/       # Endpoints API
│   │   └── services/     # Services métier
│   ├── app.py            # Point d'entrée Gunicorn
│   ├── debug_watchlist.py # Script de debug
│   ├── test_api_endpoint.py # Test d'endpoint
│   ├── requirements.txt  # Dépendances Python
│   └── .env.example      # Variables d'environnement
├── frontend/              # Application React
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Pages de l'application
│   │   └── api/          # Service API
│   └── package.json
├── database/              # Schéma et scripts SQL
│   └── database.sql       # Schéma complet avec données initiales
├── render.yaml            # Configuration de déploiement
└── .gitignore             # Fichiers ignorés
```

## 🛠️ Installation Locale

### Prérequis
- Python 3.11+
- Node.js 18+
- MySQL 8.0+

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Configurer la base de données
cp .env.example .env
# Éditer .env avec vos credentials MySQL

# Lancer le serveur
python run.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Base de Données

```bash
# Créer la base de données
mysql -u root -p
> CREATE DATABASE tradesense CHARACTER SET utf8mb4;
> exit

# Importer le schéma
mysql -u root -p tradesense < database/database.sql
```

## 🌐 Déploiement

### Render.com (Recommandé)

1. Forkez ce repository
2. Connectez-vous à [Render.com](https://render.com)
3. Créez un nouveau "Blueprint" et sélectionnez votre repo
4. Configurez les variables d'environnement :
   - `DATABASE_URL`: Votre URL MySQL
5. Déployez !

### Variables d'Environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `mysql+pymysql://user:pass@host:3306/tradesense` |
| `VITE_API_URL` | URL du backend (ex: `https://api.tradesense.com`) |

## 📊 API Endpoints

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/trading/price` | GET | Prix en temps réel |
| `/api/trading/trade` | POST | Exécuter un trade |
| `/api/challenge` | GET | Stats du challenge |
| `/api/leaderboard` | GET | Top 10 traders |
| `/api/risk/metrics` | GET | Métriques de risque |
| `/api/purchase` | POST | Acheter un challenge |

## 🔧 Technologies Utilisées

- **Backend**: Flask, SQLAlchemy, yfinance, BeautifulSoup
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Base de données**: MySQL 8.0
- **Graphiques**: TradingView Widget
- **Déploiement**: Render.com, Gunicorn

## 📦 Scraper Bourse de Casablanca

Le scraper BVC utilise BeautifulSoup pour récupérer les prix des actions marocaines :

```python
# backend/app/services/bvc_service.py
class BVCService:
    def get_market_data():
        url = "https://www.richbourse.com/bourse/cotations/actions"
        response = requests.get(url, headers={'User-Agent': '...'})
        soup = BeautifulSoup(response.content, 'html.parser')
        # Parse table rows for IAM, ATW, BCP, etc.
```

## 🎬 Démo Vidéo

La démo vidéo (3-5 minutes) couvre :
1. Landing Page & Achat d'un Challenge
2. Dashboard avec prix temps réel (IAM, BTC)
3. Démonstration de l'échec du challenge
4. Structure du code et scraper marocain

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

Développé pour le projet TradeSense AI Platform.

---

⭐ **N'oubliez pas de star le repo si ce projet vous a été utile !**
