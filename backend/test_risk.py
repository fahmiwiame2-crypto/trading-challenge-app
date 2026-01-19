from app import create_app, db
from app.models import User
from app.services.risk_manager import RiskManager
from datetime import datetime

app = create_app()

def test_risk_logic():
    with app.app_context():
        print("="*60)
        print("🧪 TEST DE LA GESTION DES RISQUES")
        print("="*60)
        
        # --- SCÉNARIO 1 : DRAWDOWN TOTAL (10%) ---
        print("\n[SCÉNARIO 1] Test de la Perte Totale Max (10%)")
        
        # 1. Créer un utilisateur frais
        username = "risky_trader_total@test.com"
        user = User.query.filter_by(username=username).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            
        user = User(username=username, balance=100000.0, initial_capital=100000.0)
        db.session.add(user)
        db.session.commit()
        print(f"✅ Utilisateur créé: Solde=${user.balance}")
        
        # 2. Simuler une perte massive (> 10k)
        print("📉 Simulation d'une perte de $11,000...")
        user.balance = 89000.0  # $11,000 de perte (11%)
        db.session.commit()
        
        # 3. Vérifier le risque
        print("🔍 Vérification des règles...")
        result = RiskManager.check_risk_rules(user.id)
        
        if result['status'] == 'FAILED':
            print(f"✅ SUCCÈS: Compte marqué comme FAILED")
            print(f"   Raison: {result['reason']}")
            print(f"   Métriques: {result['violations']}")
        else:
            print(f"❌ ÉCHEC: Le compte aurait dû échouer. Statut actuel: {result['status']}")

        # --- SCÉNARIO 2 : PERTE JOURNALIÈRE (5%) ---
        print("\n[SCÉNARIO 2] Test de la Perte Journalière Max (5%)")
        
        # 1. Créer un utilisateur frais
        username = "risky_trader_daily@test.com"
        user = User.query.filter_by(username=username).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            
        # Démarrage de la journée avec $100,000
        user = User(
            username=username, 
            balance=100000.0, 
            initial_capital=100000.0,
            daily_starting_equity=100000.0
        )
        db.session.add(user)
        db.session.commit()
        print(f"✅ Utilisateur créé: DailyEquity=${user.daily_starting_equity}")
        
        # 2. Simuler une perte journalière (> 5k) mais safe sur le total
        # Disons qu'il avait gagné de l'argent avant, donc son solde est haut, 
        # mais il perd 6k aujourd'hui.
        
        # Cas simple pour le test: Start $100k -> Current $94k (Perte $6k = 6%)
        print("📉 Simulation d'une perte journalière de $6,000...")
        user.balance = 94000.0
        db.session.commit()
        
        # 3. Vérifier le risque
        print("🔍 Vérification des règles...")
        result = RiskManager.check_risk_rules(user.id)
        
        if result['status'] == 'FAILED':
            print(f"✅ SUCCÈS: Compte marqué comme FAILED")
            print(f"   Raison: {result['reason']}")
        else:
            print(f"❌ ÉCHEC: Le compte aurait dû échouer pour perte journalière. Statut: {result['status']}")
            
        print("\n" + "="*60)

if __name__ == "__main__":
    test_risk_logic()
