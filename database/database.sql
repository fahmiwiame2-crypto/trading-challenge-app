-- =============================================
-- TradeSense AI - Script MySQL Complet
-- Version: 2.0 (Compatible MySQL Workbench)
-- =============================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS tradesense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tradesense;

-- =============================================
-- TABLE: users (Utilisateurs)
-- =============================================
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
) ENGINE=InnoDB;

-- =============================================
-- TABLE: accounts (Comptes de trading)
-- =============================================
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
) ENGINE=InnoDB;

-- =============================================
-- TABLE: trades (Transactions)
-- =============================================
CREATE TABLE IF NOT EXISTS trades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    quantity FLOAT NOT NULL,
    price FLOAT NOT NULL,
    type VARCHAR(10) NOT NULL COMMENT 'BUY or SELL',
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
) ENGINE=InnoDB;

-- =============================================
-- TABLE: transactions (Historique financier)
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'DEPOSIT, WITHDRAWAL, TRADE_PROFIT, TRADE_LOSS',
    amount FLOAT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: courses (Cours de formation)
-- =============================================
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
) ENGINE=InnoDB;

-- =============================================
-- TABLE: modules (Modules de cours)
-- =============================================
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_num INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: lessons (Leçons)
-- =============================================
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
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: quizzes (Quiz)
-- =============================================
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    title VARCHAR(255),
    passing_score INT DEFAULT 70,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_id (lesson_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: questions (Questions de quiz)
-- =============================================
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_answer INT NOT NULL,
    explanation TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: options (Options de questions - Alternative)
-- =============================================
CREATE TABLE IF NOT EXISTS options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- TABLE: user_course_progress (Progression des cours)
-- =============================================
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
) ENGINE=InnoDB;

-- =============================================
-- TABLE: user_lesson_progress (Progression des leçons)
-- =============================================
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: certificates (Certificats)
-- =============================================
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    certificate_number VARCHAR(100) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- TABLE: market_signals (Signaux de marché)
-- =============================================
CREATE TABLE IF NOT EXISTS market_signals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    signal_type VARCHAR(20) NOT NULL COMMENT 'BUY, SELL, HOLD',
    confidence FLOAT,
    price_target FLOAT,
    stop_loss FLOAT,
    analysis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    INDEX idx_symbol (symbol)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: risk_alerts (Alertes de risque)
-- =============================================
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
) ENGINE=InnoDB;

-- =============================================
-- TABLE: trading_floors (Salles de trading)
-- =============================================
CREATE TABLE IF NOT EXISTS trading_floors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_participants INT DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- TABLE: user_badges (Badges utilisateur)
-- =============================================
CREATE TABLE IF NOT EXISTS user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    badge_icon VARCHAR(50),
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: user_xp (Points d'expérience)
-- =============================================
CREATE TABLE IF NOT EXISTS user_xp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    xp_points INT DEFAULT 0,
    level INT DEFAULT 1,
    last_xp_gain DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_xp (user_id)
) ENGINE=InnoDB;

-- =============================================
-- TABLE: message_reactions (Réactions aux messages)
-- =============================================
CREATE TABLE IF NOT EXISTS message_reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message_id INT NOT NULL,
    reaction_type VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- TABLE: system_config (Configuration système)
-- =============================================
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- DONNÉES INITIALES
-- =============================================

-- Insérer un utilisateur admin par défaut
INSERT INTO users (full_name, username, email, password_hash, role, balance) 
VALUES ('Admin TradeSense', 'admin', 'admin@tradesense.ma', 'scrypt:32768:8:1$...$...', 'ADMIN', 100000.0)
ON DUPLICATE KEY UPDATE username = username;

-- Insérer des configurations système de base
INSERT INTO system_config (config_key, config_value, description) VALUES
('max_daily_loss', '5', 'Perte quotidienne maximale en pourcentage'),
('max_total_loss', '10', 'Perte totale maximale en pourcentage'),
('profit_target', '8', 'Objectif de profit en pourcentage'),
('trading_days_required', '5', 'Nombre minimum de jours de trading')
ON DUPLICATE KEY UPDATE config_key = config_key;

-- =============================================
-- FIN DU SCRIPT
-- =============================================
SELECT 'Base de données TradeSense créée avec succès!' AS Message;
