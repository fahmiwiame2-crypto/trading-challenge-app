"""
Script unique pour gérer la base de données MySQL de TradeSense AI.
Ce script remplace les anciens scripts (init_mysql.py, setup_mysql_tables.py, etc.)
Il utilise la configuration du fichier .env pour se connecter à MySQL Workbench/Server.

Fonctionnalités :
1. Crée la base de données si elle n'existe pas.
2. Crée toutes les tables nécessaires.
3. Vérifie la connexion.
"""
import os
import pymysql
import sys
from urllib.parse import urlparse
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

def setup_database():
    print("=== GESTIONNAIRE DE BASE DE DONNÉES TRADESENSE ===")
    
    # 1. Récupérer la configuration
    db_url = os.environ.get('DATABASE_URL', '')
    
    if not db_url or 'mysql' not in db_url:
        print("❌ ERREUR: DATABASE_URL non configuré pour MySQL dans .env")
        print("   Veuillez vérifier votre fichier backend/.env")
        return False

    try:
        # Analyser l'URL de connexion
        # format: mysql+pymysql://user:pass@host:port/dbname
        p = urlparse(db_url.replace('mysql+pymysql://', 'http://'))
        user = p.username
        password = p.password
        host = p.hostname
        port = p.port or 3306
        dbname = p.path.lstrip('/')

        print(f"[1/3] Connexion au serveur MySQL ({host}:{port}) en tant que '{user}'...")
        
        # Connexion SANS base de données pour pouvoir la créer si besoin
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            port=port,
            charset='utf8mb4'
        )
        cursor = connection.cursor()
        
        # 2. Créer la base de données
        print(f"[2/3] Vérification/Création de la base de données '{dbname}'...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {dbname} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute(f"USE {dbname}")
        print(f"   -> Base de données prête.")
        
        # 3. Créer les tables
        print(f"[3/3] Création de la structure des tables (Schema)...")
        
        # Liste des tables à créer (Définition SQL complète)
        tables = [
            # Users
            """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100),
                username VARCHAR(80) NOT NULL UNIQUE,
                email VARCHAR(120) UNIQUE,
                password_hash VARCHAR(255),
                role VARCHAR(20) DEFAULT 'USER',
                balance FLOAT DEFAULT 100000.0,
                status VARCHAR(20) DEFAULT 'ACTIVE',
                initial_capital FLOAT DEFAULT 100000.0,
                daily_starting_equity FLOAT DEFAULT 100000.0,
                last_equity_reset DATETIME DEFAULT CURRENT_TIMESTAMP,
                failure_reason VARCHAR(255),
                avatar_url VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_username (username),
                INDEX idx_email (email),
                INDEX idx_status (status)
            ) ENGINE=InnoDB
            """,
            
            # Accounts
            """
            CREATE TABLE IF NOT EXISTS accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                account_type VARCHAR(50) DEFAULT 'DEMO',
                balance FLOAT DEFAULT 100000.0,
                currency VARCHAR(10) DEFAULT 'USD',
                leverage INT DEFAULT 100,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB
            """,
            
            # Trades
            """
            CREATE TABLE IF NOT EXISTS trades (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                symbol VARCHAR(20) NOT NULL,
                quantity FLOAT NOT NULL,
                price FLOAT NOT NULL,
                type VARCHAR(10) NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) DEFAULT 'OPEN',
                close_price FLOAT,
                close_timestamp DATETIME,
                pnl FLOAT DEFAULT 0.0,
                stop_loss FLOAT,
                take_profit FLOAT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_status (status),
                INDEX idx_symbol (symbol)
            ) ENGINE=InnoDB
            """,
            
            # Transactions
            """
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type VARCHAR(50) NOT NULL,
                amount FLOAT NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB
            """,
            
            # Courses
            """
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                thumbnail_url VARCHAR(255),
                total_modules INT DEFAULT 0,
                duration VARCHAR(50),
                category VARCHAR(50) DEFAULT 'Débutant',
                difficulty_level INT DEFAULT 1,
                tags JSON,
                thumbnail_emoji VARCHAR(10),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
            """,
            
            # Modules
            """
            CREATE TABLE IF NOT EXISTS modules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                order_num INT DEFAULT 0,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                INDEX idx_course_id (course_id)
            ) ENGINE=InnoDB
            """,
            
            # Lessons
            """
            CREATE TABLE IF NOT EXISTS lessons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_id INT NOT NULL,
                module_id INT,
                title VARCHAR(255) NOT NULL,
                duration VARCHAR(50),
                content TEXT,
                video_url VARCHAR(255),
                order_num INT DEFAULT 0,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                INDEX idx_course_id (course_id)
            ) ENGINE=InnoDB
            """,
            
            # Quizzes
            """
            CREATE TABLE IF NOT EXISTS quizzes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                lesson_id INT NOT NULL,
                title VARCHAR(255),
                passing_score INT DEFAULT 70,
                FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
                INDEX idx_lesson_id (lesson_id)
            ) ENGINE=InnoDB
            """,
            
            # Questions
            """
            CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                quiz_id INT NOT NULL,
                question_text TEXT NOT NULL,
                options JSON NOT NULL,
                correct_answer INT NOT NULL,
                explanation TEXT,
                FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
                INDEX idx_quiz_id (quiz_id)
            ) ENGINE=InnoDB
            """,
            
            # Options
            """
            CREATE TABLE IF NOT EXISTS options (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question_id INT NOT NULL,
                option_text VARCHAR(255) NOT NULL,
                is_correct BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
            """,
            
            # User Course Progress
            """
            CREATE TABLE IF NOT EXISTS user_course_progress (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                course_id INT NOT NULL,
                progress_percentage INT DEFAULT 0,
                completed BOOLEAN DEFAULT FALSE,
                last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
                completed_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_course (user_id, course_id)
            ) ENGINE=InnoDB
            """,
            
            # User Lesson Progress
            """
            CREATE TABLE IF NOT EXISTS user_lesson_progress (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                lesson_id INT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                completed_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_lesson (user_id, lesson_id)
            ) ENGINE=InnoDB
            """,
            
            # Certificates
            """
            CREATE TABLE IF NOT EXISTS certificates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                course_id INT NOT NULL,
                issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                certificate_number VARCHAR(100) UNIQUE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
            """,
            
            # Market Signals
            """
            CREATE TABLE IF NOT EXISTS market_signals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                symbol VARCHAR(20) NOT NULL,
                signal_type VARCHAR(20) NOT NULL,
                confidence FLOAT,
                price_target FLOAT,
                stop_loss FLOAT,
                analysis TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME,
                INDEX idx_symbol (symbol)
            ) ENGINE=InnoDB
            """,
            
            # Risk Alerts
            """
            CREATE TABLE IF NOT EXISTS risk_alerts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                alert_type VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                severity VARCHAR(20) DEFAULT 'WARNING',
                is_read BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB
            """,
            
            # Trading Floors
            """
            CREATE TABLE IF NOT EXISTS trading_floors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                max_participants INT DEFAULT 50,
                is_active BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
            """,
            
            # User Badges
            """
            CREATE TABLE IF NOT EXISTS user_badges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                badge_name VARCHAR(100) NOT NULL,
                badge_icon VARCHAR(50),
                earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB
            """,
            
            # User XP
            """
            CREATE TABLE IF NOT EXISTS user_xp (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                xp_points INT DEFAULT 0,
                level INT DEFAULT 1,
                last_xp_gain DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_xp (user_id)
            ) ENGINE=InnoDB
            """,
            
            # Message Reactions
            """
            CREATE TABLE IF NOT EXISTS message_reactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                message_id INT NOT NULL,
                reaction_type VARCHAR(20) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
            """,
            
            # System Config
            """
            CREATE TABLE IF NOT EXISTS system_config (
                id INT AUTO_INCREMENT PRIMARY KEY,
                config_key VARCHAR(100) NOT NULL UNIQUE,
                config_value TEXT,
                description TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
            """,
             # User Challenges (Added for fullness)
            """
            CREATE TABLE IF NOT EXISTS user_challenges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                plan_name VARCHAR(50) NOT NULL,
                plan_price FLOAT NOT NULL,
                initial_capital FLOAT NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                payment_status VARCHAR(20) DEFAULT 'pending',
                transaction_id VARCHAR(100),
                challenge_status VARCHAR(20) DEFAULT 'active',
                profit_target FLOAT DEFAULT 10.0,
                max_daily_loss FLOAT DEFAULT 5.0,
                max_total_loss FLOAT DEFAULT 10.0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME,
                completed_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
            """,
            # Payments (Added for fullness)
            """
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                challenge_id INT,
                amount FLOAT NOT NULL,
                currency VARCHAR(10) DEFAULT 'USD',
                payment_method VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                transaction_id VARCHAR(100),
                paypal_order_id VARCHAR(100),
                payment_metadata JSON,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                completed_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (challenge_id) REFERENCES user_challenges(id)
            ) ENGINE=InnoDB
            """,
            # Chat Messages
            """
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                message TEXT NOT NULL,
                response TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
            """,
             # Leaderboard
            """
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                username VARCHAR(80) NOT NULL,
                rank_position INT NOT NULL,
                profit_percent FLOAT DEFAULT 0.0,
                total_trades INT DEFAULT 0,
                win_rate FLOAT DEFAULT 0.0,
                status VARCHAR(20) DEFAULT 'ACTIVE',
                snapshot_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB
            """,
            # Configs
            """
            CREATE TABLE IF NOT EXISTS configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                config_key VARCHAR(100) NOT NULL UNIQUE,
                config_value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB
            """
        ]
        
        # Créer chaque table
        for i, table_sql in enumerate(tables):
            try:
                cursor.execute(table_sql)
                print(f"  [OK] Table {i+1}/{len(tables)} traitée.")
            except Exception as e:
                # Ignorer l'erreur si c'est juste que la table existe
                print(f"  [INFO] Note sur la table {i+1}: {e}")
        
        connection.commit()
        
        # Vérifier les tables créées
        cursor.execute("SHOW TABLES")
        tables_found = cursor.fetchall()
        print(f"\n[SUCCÈS] {len(tables_found)} tables présentes dans la base '{dbname}':")
        for table in tables_found:
            print(f"   * {table[0]}")
        
        cursor.close()
        connection.close()
        print(f"\n✅ Tout est prêt ! Ce fichier est le seul nécessaire pour gérer la structure de votre base de données.")
        return True
        
    except Exception as e:
        print(f"\n❌ ERREUR CRITIQUE : {e}")
        print("Assurez-vous que MySQL est lancé et que les identifiants dans .env sont corrects.")
        return False

if __name__ == "__main__":
    setup_database()
