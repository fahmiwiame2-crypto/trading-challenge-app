from app import create_app, db
from sqlalchemy import text

app = create_app()

def update_schema():
    with app.app_context():
        print("Mise à jour du schéma de la base de données...")
        
        # Connexion directe pour exécuter du SQL brut
        with db.engine.connect() as conn:
            # Vérifier si les colonnes existent déjà (pour éviter les erreurs)
            # SQLite ne supporte pas IF NOT EXISTS sur ADD COLUMN dans toutes les versions, 
            # donc on essaie et on ignore l'erreur si elle existe
            
            columns_to_add = [
                ("status", "VARCHAR(20) DEFAULT 'ACTIVE'"),
                ("initial_capital", "FLOAT DEFAULT 100000.0"),
                ("daily_starting_equity", "FLOAT DEFAULT 100000.0"),
                ("last_equity_reset", "DATETIME"),
                ("failure_reason", "VARCHAR(255)")
            ]
            
            for col_name, col_type in columns_to_add:
                try:
                    conn.execute(text(f"ALTER TABLE user ADD COLUMN {col_name} {col_type}"))
                    print(f"✅ Colonne '{col_name}' ajoutée.")
                except Exception as e:
                    print(f"ℹ️  Colonne '{col_name}' existe probablement déjà ou erreur: {e}")
            
            conn.commit()
            print("Terminé.")

if __name__ == "__main__":
    update_schema()
