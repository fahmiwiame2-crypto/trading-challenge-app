import requests
import time
import sys

# Configuration
BASE_URL = "http://localhost:5000"
EMAIL = "test@test.com"  # Changez ceci avec votre email si différent

print("=" * 60)
print("🚀 DÉMONSTRATION DU SYSTÈME DE TRADING P&L")
print("=" * 60)

# 1. Vérifier les stats initiales
print("\n📊 ÉTAPE 1: Vérification des statistiques initiales...")
try:
    response = requests.get(f"{BASE_URL}/api/challenge", params={"email": EMAIL})
    stats_before = response.json()
    print(f"✅ Balance initiale: ${stats_before['balance']:,.2f}")
    print(f"✅ Profit actuel: ${stats_before['profit']:,.2f}")
    print(f"✅ Positions ouvertes: {len(stats_before['open_positions'])}")
    print(f"✅ Trades clôturés: {len(stats_before['trades'])}")
except Exception as e:
    print(f"❌ Erreur: {e}")
    print("ℹ️  Assurez-vous que le backend est lancé sur http://localhost:5000")
    sys.exit(1)

# 2. Ouvrir une position BUY
print("\n📈 ÉTAPE 2: Ouverture d'une position BUY sur BTC-USD...")
trade_data = {
    "email": EMAIL,
    "ticker": "BTC-USD",
    "side": "BUY",
    "amount": 5000  # $5000
}

try:
    response = requests.post(f"{BASE_URL}/api/trading/trade", json=trade_data)
    trade_result = response.json()
    
    if response.status_code == 200:
        trade_id = trade_result['trade']['id']
        entry_price = trade_result['trade']['entry_price']
        quantity = trade_result['trade']['quantity']
        
        print(f"✅ Position ouverte avec succès!")
        print(f"   ID: {trade_id}")
        print(f"   Type: BUY")
        print(f"   Montant: $5,000")
        print(f"   Prix d'entrée: ${entry_price:,.2f}")
        print(f"   Quantité: {quantity:.6f} BTC")
        print(f"   Nouvelle balance: ${trade_result['new_balance']:,.2f}")
    else:
        print(f"❌ Erreur lors de l'ouverture: {trade_result.get('message')}")
        sys.exit(1)
except Exception as e:
    print(f"❌ Erreur: {e}")
    sys.exit(1)

# 3. Attendre un peu pour simuler le temps
print("\n⏳ ÉTAPE 3: Attente de 3 secondes (simulation du changement de prix)...")
time.sleep(3)

# 4. Vérifier le P&L non réalisé
print("\n💹 ÉTAPE 4: Vérification du P&L non réalisé...")
try:
    response = requests.get(f"{BASE_URL}/api/challenge", params={"email": EMAIL})
    stats_during = response.json()
    
    if stats_during['open_positions']:
        open_pos = stats_during['open_positions'][0]
        print(f"✅ Position ouverte détectée:")
        print(f"   Prix actuel: ${open_pos['current_price']:,.2f}")
        print(f"   P&L non réalisé: ${open_pos['pnl']:,.2f}")
        
        if open_pos['pnl'] >= 0:
            print(f"   📈 Vous êtes en PROFIT de ${open_pos['pnl']:,.2f}!")
        else:
            print(f"   📉 Vous êtes en PERTE de ${abs(open_pos['pnl']):,.2f}")
except Exception as e:
    print(f"❌ Erreur: {e}")

# 5. Fermer la position
print(f"\n🔒 ÉTAPE 5: Fermeture de la position (ID: {trade_id})...")
close_data = {
    "email": EMAIL,
    "position_id": trade_id
}

try:
    response = requests.post(f"{BASE_URL}/api/trading/trade/close", json=close_data)
    close_result = response.json()
    
    if response.status_code == 200:
        pnl = close_result['pnl']
        new_balance = close_result['new_balance']
        
        print(f"✅ Position clôturée avec succès!")
        print(f"   P&L réalisé: ${pnl:,.2f}")
        print(f"   Nouvelle balance: ${new_balance:,.2f}")
        
        if pnl >= 0:
            print(f"   🎉 FÉLICITATIONS! Vous avez gagné ${pnl:,.2f}!")
        else:
            print(f"   ⚠️  Perte de ${abs(pnl):,.2f}")
    else:
        print(f"❌ Erreur lors de la fermeture: {close_result.get('message')}")
except Exception as e:
    print(f"❌ Erreur: {e}")

# 6. Vérifier les stats finales
print("\n📊 ÉTAPE 6: Vérification des statistiques finales...")
try:
    response = requests.get(f"{BASE_URL}/api/challenge", params={"email": EMAIL})
    stats_after = response.json()
    
    print(f"✅ Balance finale: ${stats_after['balance']:,.2f}")
    print(f"✅ Profit total: ${stats_after['profit']:,.2f} ({stats_after['profit_percent']:.2f}%)")
    print(f"✅ Equity: ${stats_after['equity']:,.2f}")
    print(f"✅ Positions ouvertes: {len(stats_after['open_positions'])}")
    print(f"✅ Trades clôturés: {len(stats_after['trades'])}")
    
    # Calculer le changement
    profit_change = stats_after['profit'] - stats_before['profit']
    print(f"\n💰 Changement de profit: ${profit_change:,.2f}")
    
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n" + "=" * 60)
print("✅ DÉMONSTRATION TERMINÉE!")
print("=" * 60)
print("\nℹ️  Vous pouvez maintenant:")
print("   1. Vérifier le dashboard à http://localhost:8080")
print("   2. Voir votre trade dans l'historique")
print("   3. Observer que le profit a changé!")
print("\n💡 Pour trader manuellement:")
print("   - Allez sur le Dashboard")
print("   - Utilisez le panneau BUY/SELL à droite")
print("   - Clôturez vos positions pour réaliser vos profits!")
