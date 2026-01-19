import pymysql
import sys

print("Initialisation de la base de donnees MySQL...")

try:
    # Connexion au serveur MySQL (sans specifier de base)
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='wiamefahmi',
        charset='utf8mb4'
    )
    
    cursor = connection.cursor()
    
    # Creer la base de donnees
    print("Creation de la base 'tradesense'...")
    cursor.execute("CREATE DATABASE IF NOT EXISTS tradesense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    print("OK - Base de donnees creee!")
    
    # Selectionner la base
    cursor.execute("USE tradesense")
    
    # Lire et executer le fichier SQL
    print("Lecture du fichier database/database.sql...")
    with open('../database/database.sql', 'r', encoding='utf-8') as f:
        sql_script = f.read()
    
    # Separer les commandes SQL (ignorer les commentaires)
    print("Execution des commandes SQL...")
    commands = []
    current_command = []
    
    for line in sql_script.split('\n'):
        # Ignorer les commentaires
        if line.strip().startswith('--') or line.strip().startswith('/*') or not line.strip():
            continue
        
        current_command.append(line)
        
        # Si la ligne se termine par ;, c'est la fin d'une commande
        if line.strip().endswith(';'):
            command = '\n'.join(current_command)
            if command.strip():
                commands.append(command)
            current_command = []
    
    # Executer chaque commande
    executed = 0
    for i, command in enumerate(commands):
        try:
            # Ignorer les commandes USE et CREATE DATABASE (deja fait)
            if 'CREATE DATABASE' in command.upper() or command.strip().upper().startswith('USE '):
                continue
            
            cursor.execute(command)
            executed += 1
            if i % 10 == 0:
                print(f"  Progression: {i}/{len(commands)} commandes...")
        except Exception as e:
            # Ignorer les erreurs de duplication (ON DUPLICATE KEY)
            if 'Duplicate' not in str(e):
                print(f"Avertissement sur commande {i}: {str(e)[:100]}")
    
    connection.commit()
    print(f"OK - {executed} commandes SQL executees avec succes!")
    
    # Verifier les tables creees
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print(f"\nTables creees ({len(tables)}) :")
    for table in tables[:10]:  # Afficher les 10 premieres
        print(f"  - {table[0]}")
    if len(tables) > 10:
        print(f"  ... et {len(tables) - 10} autres tables")
    
    cursor.close()
    connection.close()
    
    print("\nSUCCES - Base de donnees MySQL initialisee!")
    print("TradeSense est maintenant connecte a MySQL Workbench!")
    
except pymysql.err.OperationalError as e:
    print(f"\nERREUR de connexion MySQL:")
    print(f"   {str(e)}")
    print("\nVerifiez que:")
    print("   1. MySQL est demarre")
    print("   2. L'utilisateur 'root' existe sans mot de passe")
    print("   3. MySQL ecoute sur localhost:3306")
    sys.exit(1)
    
except Exception as e:
    print(f"\nERREUR inattendue: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
