
from flask import Blueprint, jsonify, request
from datetime import datetime
from ..services.feed_service import FeedService
from ..services.risk_manager import RiskManager
from ..services.bvc_service import BVCService
from ..models import Trade, User, db

trading_bp = Blueprint('trading', __name__)

@trading_bp.route('/price', methods=['GET'])
def get_price():
    ticker = request.args.get('ticker', 'BTC-USD')
    data = FeedService.get_price_data(ticker)
    return jsonify(data)

@trading_bp.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "trading blueprint ok"})

@trading_bp.route('/trade', methods=['POST'])
def execute_trade():
    try:
        data = request.json
        print(f"=== TRADE REQUEST RECEIVED ===")
        print(f"Full request data: {data}")
        
        ticker_raw = data.get('ticker')
        side = data.get('side')
        amount = float(data.get('amount')) if data.get('amount') else None
        email = data.get('email')
        
        print(f"Parsed fields - ticker: {ticker_raw}, side: {side}, amount: {amount}, email: {email}")

        if not all([ticker_raw, side, amount, email]):
            missing = []
            if not ticker_raw: missing.append('ticker')
            if not side: missing.append('side')
            if not amount: missing.append('amount')
            if not email: missing.append('email')
            print(f"Missing fields: {missing}")
            return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

        # Normalize ticker: Strip TradingView prefixes
        ticker = ticker_raw.replace('CSEMA:', '').replace('CSE:', '').replace('BVC:', '').replace('BINANCE:', '').replace('FX:', '')
        
        print(f"Processing trade: {side} {amount} of {ticker} (raw: {ticker_raw}) for {email}")

        # Find or create user
        user = User.query.filter_by(username=email).first()
        if not user:
            print(f"User {email} not found, creating new user...")
            user = User(username=email)
            db.session.add(user)
            db.session.commit()
            print(f"User created with ID: {user.id}, Balance: {user.balance}")
        else:
            print(f"User found - ID: {user.id}, Balance: {user.balance}, Status: {user.status}")
        
        # Check if user can trade (risk rules)
        can_trade, reason = RiskManager.can_trade(user.id)
        if not can_trade:
            print(f"Trade blocked for user {user.id}: {reason}")
            return jsonify({
                "message": f"Trading blocked: {reason}",
                "status": "FAILED"
            }), 403

        # Get current price
        # Check BVC first
        bvc_data = BVCService.get_market_data()
        bvc_stock = next((item for item in bvc_data if item['symbol'] == ticker), None)
        
        current_price = 0
        if bvc_stock:
            current_price = bvc_stock['price']
            print(f"Found BVC price for {ticker}: {current_price}")
        else:
            # Fallback to standard FeedService (Crypto/Forex/US Stocks)
            price_data = FeedService.get_price_data(ticker)
            if not price_data:
                print(f"No price data found for {ticker}")
                return jsonify({"message": f"Market data unavailable for {ticker}"}), 400
            current_price = price_data[-1]['close']
            print(f"Found Feed price for {ticker}: {current_price}")

        quantity = amount / current_price

        # Check Balance
        if user.balance < amount:
            print(f"Insufficient balance: {user.balance} < {amount}")
            return jsonify({"message": "Insufficient balance"}), 400

        # Execute Trade
        trade = Trade(
            user_id=user.id,
            symbol=ticker,
            quantity=quantity,
            price=current_price,
            type=side,
            timestamp=datetime.utcnow(),
            status='OPEN'
        )

        # Update Balance (Deduct amount for both BUY and SELL as margin/cost)
        user.balance -= amount

        db.session.add(trade)
        db.session.commit()
        
        # Check risk rules after trade execution
        risk_check = RiskManager.check_risk_rules(user.id)

        return jsonify({
            "message": "Trade executed successfully", 
            "trade": {
                "id": trade.id,
                "ticker": trade.symbol,
                "side": trade.type,
                "amount": amount,
                "quantity": quantity,
                "entry_price": current_price,
                "timestamp": trade.timestamp.isoformat(),
                "status": "OPEN"
            },
            "new_balance": user.balance,
            "risk_status": risk_check['status'],
            "account_status": user.status
        })

    except Exception as e:
        print(f"Trade execution error: {e}")
        return jsonify({"message": str(e)}), 500

@trading_bp.route('/trade/close', methods=['POST'])
def close_trade():
    try:
        data = request.json
        email = data.get('email')
        position_id = data.get('position_id')
        
        if not email or not position_id:
            return jsonify({"message": "Missing email or position_id"}), 400
            
        user = User.query.filter_by(username=email).first()
        if not user:
             return jsonify({"message": "User not found"}), 404
             
        trade = Trade.query.filter_by(id=position_id, user_id=user.id, status='OPEN').first()
        if not trade:
            return jsonify({"message": "Open position not found"}), 404
            
        # Get current price
        price_data = FeedService.get_price_data(trade.symbol)
        if not price_data:
            return jsonify({"message": "Market data unavailable"}), 400
        
        current_price = price_data[-1]['close']
        
        # Calculate PnL
        if trade.type == 'BUY':
            pnl = (current_price - trade.price) * trade.quantity
        else: # SELL
            pnl = (trade.price - current_price) * trade.quantity
        
        # Calculate initial amount (what was deducted when opening the position)
        initial_amount = trade.quantity * trade.price
            
        # Return initial amount + pnl to balance
        user.balance += initial_amount + pnl
            
        trade.status = 'CLOSED'
        trade.close_price = current_price
        trade.close_timestamp = datetime.utcnow()
        trade.pnl = round(pnl, 2)  # Round to 2 decimals
        
        db.session.commit()
        
        # Check risk rules after closing position
        risk_check = RiskManager.check_risk_rules(user.id)
        
        return jsonify({
            "message": "Position closed successfully",
            "pnl": round(pnl, 2),
            "new_balance": user.balance,
            "risk_status": risk_check['status'],
            "account_status": user.status,
            "violations": risk_check.get('violations', [])
        })
    except Exception as e:
        print(f"Close trade error: {e}")
        return jsonify({"message": str(e)}), 500

@trading_bp.route('/ai-signals', methods=['GET'])
def get_ai_signals():
    ticker = request.args.get('ticker', 'BTC-USD')
    # Mock AI signal logic
    import random
    signals = ["BUY", "SELL", "HOLD"]
    signal = random.choice(signals)
    confidence = random.randint(60, 95)
    reasons = {
        "BUY": "Strong bullish momentum, RSI oversold bounce",
        "SELL": "Bearish divergence detected, resistance near",
        "HOLD": "Consolidating near support, wait for confirmation"
    }
    return jsonify({
        "symbol": ticker,
        "signal": signal,
        "confidence": confidence,
        "reason": reasons[signal]
    })

@trading_bp.route('/expert-signals', methods=['GET'])
def get_expert_signals():
    # Mock Expert signals
    # In a real app, this would query a database of expert analysis
    expert_signals = [
        { 
            "expert": 'Expert_Karim', 
            "action": 'BUY', 
            "price": 'Current', 
            "target": '+2.5%', 
            "confidence": 92, 
            "time": 'Il y a 5 min', 
            "reason": 'Rejet du support H4 avec bougie de retournement.' 
        },
        { 
            "expert": 'Sarah_FX', 
            "action": 'HOLD', 
            "price": 'Wait', 
            "target": 'N/A', 
            "confidence": 75, 
            "time": 'Il y a 15 min', 
            "reason": 'Zone d\'incertitude avant la news US.' 
        },
        { 
            "expert": 'Mohammed_Pro', 
            "action": 'SELL', 
            "price": '96200', 
            "target": '94500', 
            "confidence": 88, 
            "time": 'Il y a 45 min', 
            "reason": 'Divergence baissière sur le RSI daily.' 
        }
    ]
    return jsonify(expert_signals)

@trading_bp.route('/news', methods=['GET'])
def get_news():
    # Mock News Data
    news_items = [
        {
            "id": 1,
            "title": 'Bitcoin dépasse les 45K$',
            "description": 'Le BTC rallye hausse confirmée ?',
            "category": 'Crypto',
            "time": 'Il y a 2 min',
            "impact": 'high',
            "icon": '📈',
            "content": "Le Bitcoin a franchi la barre symbolique des 45 000 dollars aujourd'hui, porté par un regain d'intérêt institutionnel et des volumes d'achat importants sur les bourses asiatiques. Les analystes prévoient une résistance majeure à 48 000 $. Si ce niveau est franchi, la prochaine cible pourrait être les 52 000 $. Cependant, une correction vers 42 000 $ reste possible si les prises de bénéfices s'accélèrent."
        },
        {
            "id": 2,
            "title": 'M. Telecom (IAM) annonce des résultats trimestriels records',
            "description": 'Hausse de 15% du chiffre d\'affaires',
            "category": 'BVC',
            "time": 'Il y a 10 min',
            "impact": 'medium',
            "icon": '📊',
            "content": "Maroc Telecom a publié ses résultats pour le troisième trimestre, affichant une performance exceptionnelle avec une hausse de 15% de son chiffre d'affaires consolidé. Cette croissance est principalement tirée par l'expansion de ses activités en Afrique subsaharienne et la forte demande pour la fibre optique au Maroc. Le titre a réagi positivement à l'ouverture de la Bourse de Casablanca."
        },
        {
            "id": 3,
            "title": 'Forex: L\'EUR/USD en forte volatilité',
            "description": 'Décision BCE attendue aujourd\'hui',
            "category": 'Forex',
            "time": 'Il y a 1h',
            "impact": 'high',
            "icon": '💱',
            "content": "La paire EUR/USD connaît une forte volatilité alors que les traders attendent la décision de politique monétaire de la Banque Centrale Européenne (BCE). Christine Lagarde devrait s'exprimer sur l'inflation et les taux d'intérêt. Les marchés anticipent un maintien des taux, mais le ton du discours pourrait provoquer des mouvements brusques. Prudence recommandée."
        },
        {
            "id": 4,
            "title": 'Apple (AAPL) présente de nouveaux produits',
            "description": 'L\'action grimpe de 3% en pré-market',
            "category": 'Stocks',
            "time": 'Il y a 2h',
            "impact": 'medium',
            "icon": '🍎',
            "content": "Apple a dévoilé sa nouvelle gamme de produits lors de sa keynote annuelle, incluant le très attendu iPhone 16 et une nouvelle version de l'Apple Watch axée sur la santé. Les investisseurs ont accueilli favorablement ces annonces, propulsant l'action AAPL de 3% dans les échanges avant-bourse. Les analystes soulignent le potentiel des nouvelles fonctionnalités d'IA intégrées."
        },
        {
            "id": 5,
            "title": 'Alerte: Forte volatilité sur les marchés',
            "description": 'Prudence recommandée pour les traders',
            "category": 'Alerte',
            "time": 'Il y a 3h',
            "impact": 'high',
            "icon": '⚠️',
            "content": "L'indice de volatilité VIX a bondi de 12% ce matin, signalant une nervosité accrue des investisseurs face aux tensions géopolitiques et aux incertitudes économiques. Les mouvements sur les indices boursiers et les crypto-monnaies pourraient être amplifiés. Il est conseillé de réduire l'effet de levier et de resserrer les stop-loss."
        }
    ]
    return jsonify(news_items)



@trading_bp.route('/market-data/bvc', methods=['GET'])
def get_bvc_data():
    try:
        data = BVCService.get_market_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@trading_bp.route('/market-data/global', methods=['GET'])
def get_global_market_data():
    try:
        # Define tickers to monitor
        tickers = [
            {'symbol': 'BTC-USD', 'market': 'CRYPTO'},
            {'symbol': 'ETH-USD', 'market': 'CRYPTO'},
            {'symbol': 'SOL-USD', 'market': 'CRYPTO'},
            {'symbol': 'BNB-USD', 'market': 'CRYPTO'},
            {'symbol': 'EURUSD=X', 'display': 'EURUSD', 'market': 'FOREX'},
            {'symbol': 'JPY=X', 'display': 'USDJPY', 'market': 'FOREX'},
            {'symbol': 'GBPUSD=X', 'display': 'GBPUSD', 'market': 'FOREX'},
            {'symbol': 'GC=F', 'display': 'GOLD', 'market': 'FOREX'}
        ]
        
        results = []
        
        # 1. Fetch Crypto & Forex via FeedService
        for t in tickers:
            try:
                data = FeedService.get_price_data(t['symbol'])
                if data and len(data) >= 2:
                    current = data[-1]['close']
                    previous = data[0]['open'] # Or data[-2]['close'] for last candle change
                    # Calculate 24h change (approximate with what we have)
                    # For stability, let's use the difference between last close and first open of the fetched period
                    change_pct = ((current - previous) / previous) * 100
                    
                    results.append({
                        'symbol': t.get('display', t['symbol']),
                        'change': round(change_pct, 2),
                        'market': t['market'],
                        'price': current
                    })
            except Exception as e:
                print(f"Error fetching {t['symbol']}: {e}")
                results.append({
                    'symbol': t.get('display', t['symbol']),
                    'change': 0.0,
                    'market': t['market'],
                    'price': 0
                })

        # 2. Fetch BVC Data
        try:
            bvc_data = BVCService.get_market_data()
            if bvc_data:
                for stock in bvc_data:
                    results.append({
                        'symbol': stock['symbol'],
                        'change': stock['change'],
                        'market': 'BVC',
                        'price': stock['price']
                    })
        except Exception as e:
             print(f"Error fetching BVC for heatmap: {e}")

        return jsonify(results)

    except Exception as e:
        print(f"Global market data error: {e}")
        return jsonify({"error": str(e)}), 500
@trading_bp.route('/market-data/watchlist', methods=['GET'])
def get_watchlist_data():
    """
    Get real-time data for the default watchlist.
    """
    try:
        data = FeedService.get_watchlist_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@trading_bp.route('/market-data/trends', methods=['GET'])
def get_market_trends():
    """
    Get live trends across all markets.
    """
    try:
        data = FeedService.get_market_trends()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/market-data/heatmap', methods=['GET'])
def get_heatmap_data():
    """
    Get live performance data for heatmap.
    """
    try:
        data = FeedService.get_market_heatmap()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@trading_bp.route('/market-data/global-stats', methods=['GET'])
def get_global_stats():
    """
    Get live global market statistics.
    """
    try:
        data = FeedService.get_global_market_stats()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
